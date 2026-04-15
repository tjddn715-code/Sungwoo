import express from 'express';
import cors from 'cors';
import newsRouter from './routes/news.js';

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // 서버-to-서버 요청 또는 허용된 오리진
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
      cb(null, true);
    } else {
      cb(new Error('CORS 차단: ' + origin));
    }
  },
  methods: ['GET'],
}));

app.use(express.json());

app.use('/api/news', newsRouter);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
