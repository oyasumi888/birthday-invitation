import type { ReactElement } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { AdminPage } from './pages/AdminPage'
import { InvitationPage } from './pages/InvitationPage'
import { LoginPage } from './pages/LoginPage'
import { isTokenExpired } from './utils/token'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { token } = useAuth()
  const location = useLocation()

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InvitationPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
