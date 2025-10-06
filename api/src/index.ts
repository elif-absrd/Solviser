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
const PORT = parseInt(process.env.PORT || '3002', 10);

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

// Add basic root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running', timestamp: new Date().toISOString() });
});

app.use('/api', mainRouter);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`⚡️[server]: API Server is running at http://localhost:${PORT}`);
  logger.info(`⚡️[server]: Server is also accessible at http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  logger.error(`❌[server]: Failed to start server: ${err.message}`);
});