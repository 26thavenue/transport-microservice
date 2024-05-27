import  {type Request, type Response, type NextFunction} from 'express'
import logger from './config';



export class ErrorMiddleware extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
   toJSON() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}



export const loggerMiddleware = (req: Request, res:Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path} ${req.ip}`);
  next();
};





const rateLimit = 20; 
const interval = 60 * 1000; 


const requestCounts: Record<string, number> = {};


setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0; 
  });
}, interval)

export function rateLimitAndTimeout(req:Request, res:Response, next:NextFunction) {
  const ip = req.ip; 

  if(!ip){
    throw new ErrorMiddleware(400, 'Invalid IP');
  }

  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > rateLimit) {
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  req.setTimeout(15000, () => {
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
    res.end()
  });

  next(); 
}