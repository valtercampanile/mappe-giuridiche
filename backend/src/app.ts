import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import logger from './utils/logger';

const app = express();

app.use(cors({ origin: serverConfig.frontendUrl }));
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(serverConfig.port, () => {
    logger.info(`Server avviato sulla porta ${String(serverConfig.port)}`);
  });
}

export default app;
