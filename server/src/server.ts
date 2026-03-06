import 'dotenv/config';
import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';

import routes       from './routes';
import { errorHandler } from './middleware/errorHandler';

const app  = express();
const PORT = process.env.PORT ?? 3333;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173' }));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));
app.use('/api', routes);

// ─── Error Handler ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
