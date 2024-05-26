import express , {type Application, type Request, type Response} from 'express'

import morgan from 'morgan'

import cors from 'cors'

import helmet from 'helmet'

import dotenv from 'dotenv'

import { corsConfig } from './config'

import {createProxyMiddleware} from 'http-proxy-middleware'

dotenv.config()

const app: Application = express()

const PORT = process.env.PORT || 3000

app.use(morgan('combined'))

app.use(cors(corsConfig))

app.use(helmet())

app.use(express.json())


app.use('/auth', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
app.use('/properties', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
app.use('/users', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/notifications', createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));



app.get('/health', (req:Request, res:Response) =>{
    res.status(200).send('OK')
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

