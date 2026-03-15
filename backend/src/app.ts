import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.listen(serverConfig.port, () => {
  // Logger will replace this in implementation phase
});

export default app;
