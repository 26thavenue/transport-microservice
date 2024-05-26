import {type Request, type Response, type NextFunction} from 'express'

const rateLimit = 20; 
const interval = 60 * 1000; 


const requestCounts: Record<string, number> = {};


setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0; 
  });
}, interval)

function rateLimitAndTimeout(req:Request, res:Response, next:NextFunction) {
  const ip = req.ip; 

  if(!ip){
    throw new Error('No IP provided')
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