const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const { findUserById, sanitizeUser } = require('../models/user')

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, message: 'No token provided' })
  }
  const token = header.slice(7)
  try {
    const decoded = verifyToken(token)
    const user = await findUserById(decoded.id)
    if (!user || !user.isActive) {
      return res.status(401).json({ ok: false, message: 'User not found or inactive' })
    }
    req.user = sanitizeUser(user)
    next()
  } catch {
    return res.status(401).json({ ok: false, message: 'Invalid or expired token' })
  }
}

// Optional auth - attaches user if token present, never rejects
async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try {
      const decoded = verifyToken(header.slice(7))
      const user = await findUserById(decoded.id)
      if (user && user.isActive) req.user = sanitizeUser(user)
    } catch {
      // ignore
    }
  }
  next()
}

module.exports = { signToken, verifyToken, requireAuth, optionalAuth }
