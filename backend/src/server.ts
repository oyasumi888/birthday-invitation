import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `[EADDRINUSE] Port ${port} is already in use. Stop the other process (see README / netstat) or set PORT in .env to a free port.`
    );
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
