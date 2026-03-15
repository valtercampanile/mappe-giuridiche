import winston from 'winston';
import { serverConfig } from '../config/server';

const logger = winston.createLogger({
  level: serverConfig.nodeEnv === 'production' ? 'info' : 'debug',
  format:
    serverConfig.nodeEnv === 'production'
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

export default logger;
