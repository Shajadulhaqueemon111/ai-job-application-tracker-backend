import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/route';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/not-found';
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://quick-hire-job-board-application.vercel.app',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
