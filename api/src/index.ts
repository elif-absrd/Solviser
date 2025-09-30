// File: apps/api/src/index.ts
import express, { Request, Response } from 'express'; // Add Request, Response types
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mainRouter from './routes';
import logger, { stream } from './middleware/logger.middleware';

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3001', 'https://solviser.in', 'https://app.solviser.in'],
  credentials: true,
}));

// We need to extend the Request interface to add our custom rawBody property
interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

// THE FIX IS HERE: Use a verify function to capture the raw body before parsing
app.use(express.json({
  verify: (req: RequestWithRawBody, res: Response, buf: Buffer) => {
    // We only need the raw body for the Razorpay webhook route
    if (req.originalUrl.startsWith('/api/subscriptions/webhook')) {
      req.rawBody = buf;
    }
  }
}));

app.use(cookieParser());
app.use(morgan('combined', { stream }));
app.use('/api', mainRouter);

app.listen(port, () => {
  logger.info(`⚡️[server]: API Server is running at http://localhost:${port}`);
});