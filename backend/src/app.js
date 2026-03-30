import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import userRoutes from './routes/user.routes.js'
import leadRoutes from './routes/lead.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import categoryRoutes from './routes/category.routes.js'

connectDB()

const app = express()

app.use(helmet())
app.use(cors({ origin:[ process.env.FRONTEND_URL, /\.vercel\.app$/ ],
    credentials:true
    
    
 }))
app.use(express.json())
app.use(morgan('dev'))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/categories', categoryRoutes)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// Ruta no encontrada
app.use('*', (req, res) => res.status(404).json({ message: 'Ruta no encontrada' }))

// Error handler global (debe ir al final)
app.use(errorHandler)

export default app