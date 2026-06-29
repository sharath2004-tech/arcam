const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')

dotenv.config({ override: true })

const { PORT } = require('./config')
const { connectToDatabase, closeDatabaseConnection } = require('./db')

const app = express()

// CORS: allow localhost in dev + production frontend URL via env var
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : []),
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true)
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true)
    }
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/albums', require('./routes/albums'))
app.use('/api/qr', require('./routes/qr'))
app.use('/api/events', require('./routes/events'))
app.use('/api/stats', require('./routes/stats'))
app.use('/api/plans', require('./routes/plans'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/customers', require('./routes/customers'))
app.use('/api/upload', require('./routes/upload'))

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'arcam-backend' })
})

app.get('/api/db-health', async (_req, res) => {
  try {
    const db = await connectToDatabase()
    await db.command({ ping: 1 })
    res.status(200).json({ ok: true, database: 'connected' })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

const shutdown = async () => {
  server.close(async () => {
    await closeDatabaseConnection()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
