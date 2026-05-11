import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/route';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/not-found';

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://ai-job-application-tracker-weld.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ CORS must be first
app.use(cors(corsOptions));

// ✅ Handle preflight requests explicitly
app.options('/{*wildcard}', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
