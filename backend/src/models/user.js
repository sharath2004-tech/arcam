const { connectToDatabase } = require('../db')

const VALID_ROLES = ['customer', 'photographer', 'studio_manager', 'staff', 'admin', 'super_admin']

async function getUsersCollection() {
  const db = await connectToDatabase()
  return db.collection('users')
}

async function createUser({ email, passwordHash, name, phone, role, studioId }) {
  const col = await getUsersCollection()
  const now = new Date()
  const doc = {
    email: email.toLowerCase().trim(),
    passwordHash,
    name: name.trim(),
    phone: phone || null,
    role,
    studioId: studioId || null,
    avatar: null,
    isVerified: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }
  const result = await col.insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

async function findUserByEmail(email) {
  const col = await getUsersCollection()
  return col.findOne({ email: email.toLowerCase().trim() })
}

async function findUserById(id) {
  const { ObjectId } = require('mongodb')
  const col = await getUsersCollection()
  return col.findOne({ _id: new ObjectId(id) })
}

async function updateUser(id, updates) {
  const { ObjectId } = require('mongodb')
  const col = await getUsersCollection()
  const { _id, passwordHash, ...safeUpdates } = updates
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...safeUpdates, updatedAt: new Date() } }
  )
  return findUserById(id)
}

async function updateUserPassword(id, passwordHash) {
  const { ObjectId } = require('mongodb')
  const col = await getUsersCollection()
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { passwordHash, updatedAt: new Date() } }
  )
}

async function setOtpCode(id, otpCode, expiresAt) {
  const { ObjectId } = require('mongodb')
  const col = await getUsersCollection()
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { otpCode, otpExpiresAt: expiresAt, updatedAt: new Date() } }
  )
}

async function verifyUserEmail(id) {
  const { ObjectId } = require('mongodb')
  const col = await getUsersCollection()
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isVerified: true, otpCode: null, otpExpiresAt: null, updatedAt: new Date() } }
  )
}

async function listUsers({ page = 1, limit = 20, role, search } = {}) {
  const col = await getUsersCollection()
  const filter = {}
  if (role && VALID_ROLES.includes(role)) filter.role = role
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ]
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    col.find(filter).project({ passwordHash: 0, otpCode: 0 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
  ])
  return { users, total, page, limit, pages: Math.ceil(total / limit) }
}

function sanitizeUser(user) {
  if (!user) return null
  const { passwordHash, otpCode, otpExpiresAt, ...safe } = user
  return { ...safe, id: safe._id.toString() }
}

module.exports = {
  VALID_ROLES,
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  updateUserPassword,
  setOtpCode,
  verifyUserEmail,
  listUsers,
  sanitizeUser,
}
