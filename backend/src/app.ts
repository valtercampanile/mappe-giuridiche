import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server';
import authRoutes from './routes/auth.routes';
import entitiesRoutes from './routes/entities.routes';
import relationsRoutes from './routes/relations.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/error.middleware';
import logger from './utils/logger';

const app = express();

app.use(cors({ origin: serverConfig.frontendUrl }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/entities', entitiesRoutes);
app.use('/api/v1/relations', relationsRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(serverConfig.port, () => {
    logger.info(`Server avviato sulla porta ${String(serverConfig.port)}`);
  });
}

export default app;
