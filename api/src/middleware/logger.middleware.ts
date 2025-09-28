import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Format for logging to files (NO color)
const fileLogFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message} `;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

// Format for logging to the console (WITH color)
const consoleLogFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message} `;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});


const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  // Default format for transports that don't have their own
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    fileLogFormat
  ),
  transports: [
    // Console transport uses its own format with colorize()
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        align(),
        consoleLogFormat
      ),
    }),
    // File transports use the default format without color
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '5d',
      level: 'info',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '5d',
      level: 'error',
    }),
  ],
  exitOnError: false,
});

export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;