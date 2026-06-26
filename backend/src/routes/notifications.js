const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { connectToDatabase } = require('../db')
const { ObjectId } = require('mongodb')

async function getNotificationsCollection() {
  const db = await connectToDatabase()
  return db.collection('notifications')
}

function sanitize(n) {
  const { _id, ...rest } = n
  return { id: _id.toString(), ...rest, createdAt: n.createdAt?.toISOString() }
}

// GET /api/notifications — list notifications for the requesting user
router.get('/', requireAuth, async (req, res) => {
  try {
    const col = await getNotificationsCollection()
    const notifications = await col
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
    return res.json({ ok: true, notifications: notifications.map(sanitize) })
  } catch (err) {
    console.error('Notifications list error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to fetch notifications' })
  }
})

// PATCH /api/notifications/:id/read — mark one as read
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const col = await getNotificationsCollection()
    await col.updateOne(
      { _id: new ObjectId(req.params.id), userId: req.user.id },
      { $set: { read: true } }
    )
    return res.json({ ok: true })
  } catch (err) {
    console.error('Notification read error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to mark notification' })
  }
})

// PATCH /api/notifications/read-all — mark all as read
router.patch('/read-all', requireAuth, async (req, res) => {
  try {
    const col = await getNotificationsCollection()
    await col.updateMany({ userId: req.user.id, read: false }, { $set: { read: true } })
    return res.json({ ok: true })
  } catch (err) {
    console.error('Notification read-all error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to mark notifications' })
  }
})

module.exports = router
