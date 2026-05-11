import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/route';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/not-found';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-job-application-tracker-weld.vercel.app',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

// CORS must be first
app.use(cors(corsOptions));

// Explicitly handle preflight for all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
