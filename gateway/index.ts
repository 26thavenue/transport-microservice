import express , {type Application, type Request, type Response} from 'express'

import morgan from 'morgan'

import cors from 'cors'

import helmet from 'helmet'

import dotenv from 'dotenv'

import { corsConfig } from './config'

import {createProxyMiddleware } from 'http-proxy-middleware'

import {rateLimitAndTimeout,loggerMiddleware} from './middleware'





dotenv.config()

const app: Application = express()

const PORT = process.env.PORT || 3000

app.use(morgan('combined'))

app.use(cors(corsConfig))

app.use(helmet())

app.use(express.json())

app.use(loggerMiddleware)


app.disable("x-powered-by");


app.use('/auth',rateLimitAndTimeout, createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
app.use('/booking',rateLimitAndTimeout, createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
app.use('/users',rateLimitAndTimeout, createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/notifications', rateLimitAndTimeout,createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));
app.use('/driver', rateLimitAndTimeout,createProxyMiddleware({ target: 'http://localhost:5004', changeOrigin: true }))
app.use('/location', rateLimitAndTimeout,createProxyMiddleware({ target: 'http://localhost:5005', changeOrigin: true }))
app.use('/passenger', rateLimitAndTimeout,createProxyMiddleware({ target: 'http://localhost:5006', changeOrigin: true }))
app.use('/ride', rateLimitAndTimeout,createProxyMiddleware({ target: 'http://localhost:5007', changeOrigin: true }))


app.get('/health', (req:Request, res:Response) =>{
    res.status(200).send('OK')
})

app.use((_req, res) => {
 res.status(404).json({
   code: 404,
   status: "Error",
   message: "Route not found.",
   data: null,
 });
});






app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

