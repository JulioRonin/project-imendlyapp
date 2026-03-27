import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Basic express setup to satisfy the ts-node-dev script
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

app.listen(port, () => {
  console.log(`[api] Server running on port ${port}`);
});
