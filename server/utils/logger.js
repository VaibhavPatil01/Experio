import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Filter out logs based on their category tag
const categoryFilter = (category) => winston.format((info, opts) => {
  return info.category === category ? info : false;
});

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // 1. Critical Errors
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    // 2. AI specific telemetry (Gemini, Memory, Vectors)
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/ai.log'),
      format: winston.format.combine(categoryFilter('ai')(), logFormat)
    }),
    // 3. HTTP Request/Response tracking
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/http.log'),
      format: winston.format.combine(categoryFilter('http')(), logFormat)
    }),
    // 4. Database interactions (Mongo/Qdrant queries)
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/db.log'),
      format: winston.format.combine(categoryFilter('db')(), logFormat)
    }),
    // 5. Global chronological log of everything
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log') 
    })
  ]
});

// Always log to console in non-production, colored for readability
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, stack, category, ...metadata }) => {
        let metaString = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
        let catString = category ? `[${category.toUpperCase()}] ` : '';
        if (stack) {
          return `${timestamp} ${level}: ${catString}${message} ${metaString}\n${stack}`;
        }
        return `${timestamp} ${level}: ${catString}${message} ${metaString}`;
      })
    )
  }));
}

export default logger;
