const { connectToDatabase } = require('../db')
const { ObjectId } = require('mongodb')

async function getEventsCollection() {
  const db = await connectToDatabase()
  return db.collection('events')
}

async function createEvent(data) {
  const col = await getEventsCollection()
  const now = new Date()
  const event = {
    title: data.title,
    description: data.description || '',
    date: new Date(data.date),
    location: data.location || '',
    clientName: data.clientName || '',
    clientEmail: data.clientEmail || '',
    status: data.status || 'upcoming', // 'upcoming' | 'completed' | 'cancelled'
    ownerId: data.ownerId,
    ownerRole: data.ownerRole,
    albumId: data.albumId || null,
    createdAt: now,
    updatedAt: now,
  }
  const result = await col.insertOne(event)
  return { ...event, _id: result.insertedId }
}

async function getEventsByOwner(ownerId) {
  const col = await getEventsCollection()
  return col.find({ ownerId, deleted: { $ne: true } }).sort({ date: 1 }).toArray()
}

async function getEventById(eventId) {
  const col = await getEventsCollection()
  return col.findOne({ _id: new ObjectId(eventId) })
}

async function updateEvent(eventId, updates) {
  const col = await getEventsCollection()
  const allowed = ['title', 'description', 'date', 'location', 'clientName', 'clientEmail', 'status', 'albumId']
  const set = {}
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      set[key] = key === 'date' ? new Date(updates[key]) : updates[key]
    }
  }
  set.updatedAt = new Date()
  await col.updateOne({ _id: new ObjectId(eventId) }, { $set: set })
  return getEventById(eventId)
}

async function deleteEvent(eventId) {
  const col = await getEventsCollection()
  await col.updateOne({ _id: new ObjectId(eventId) }, { $set: { deleted: true, updatedAt: new Date() } })
}

function sanitizeEvent(event) {
  if (!event) return null
  const { _id, ...rest } = event
  return { id: _id.toString(), ...rest, date: event.date?.toISOString(), createdAt: event.createdAt?.toISOString(), updatedAt: event.updatedAt?.toISOString() }
}

module.exports = { createEvent, getEventsByOwner, getEventById, updateEvent, deleteEvent, sanitizeEvent }
