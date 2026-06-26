const PORT = Number(process.env.PORT || 5000)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'arcam'
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!MONGODB_URI) {
  throw new Error('Missing MongoDB Atlas URI. Set MONGODB_URI (or MONGO_URI) in backend/.env.')
}

const normalizedMongoUri = MONGODB_URI.trim().toLowerCase()
const isAtlasUri = normalizedMongoUri.startsWith('mongodb+srv://') || normalizedMongoUri.includes('.mongodb.net')

if (!isAtlasUri) {
  throw new Error('MONGODB_URI must be a MongoDB Atlas URI (mongodb+srv://...mongodb.net).')
}

module.exports = {
  PORT,
  MONGODB_URI,
  MONGODB_DB_NAME,
  JWT_SECRET,
  JWT_EXPIRES_IN,
}
