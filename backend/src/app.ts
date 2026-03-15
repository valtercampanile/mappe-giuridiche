import express from 'express';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.listen(PORT, () => {
  // Logger will replace this in implementation phase
});

export default app;
