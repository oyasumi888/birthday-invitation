-- Requires PostgreSQL with pgcrypto (gen_random_uuid).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE guest_status AS ENUM ('going', 'not_going', 'cancelled');

CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  status guest_status NOT NULL DEFAULT 'going',
  plus_ones INTEGER NOT NULL DEFAULT 0 CHECK (plus_ones >= 0 AND plus_ones <= 5),
  message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_guests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guests_updated_at
BEFORE UPDATE ON guests
FOR EACH ROW
EXECUTE PROCEDURE set_guests_updated_at();
