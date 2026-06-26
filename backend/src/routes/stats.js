const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { connectToDatabase } = require('../db')

// GET /api/stats — returns stats scoped to the requesting user's role
router.get('/', requireAuth, async (req, res) => {
  try {
    const db = await connectToDatabase()
    const { id, role } = req.user

    if (role === 'admin' || role === 'super_admin') {
      const [totalUsers, totalAlbums, totalStudios, totalScans] = await Promise.all([
        db.collection('users').countDocuments({ isActive: true }),
        db.collection('albums').countDocuments({ deleted: { $ne: true } }),
        db.collection('users').countDocuments({ role: 'studio_manager', isActive: true }),
        db.collection('albums').aggregate([
          { $group: { _id: null, total: { $sum: '$qrCode.scans' } } }
        ]).toArray().then(r => r[0]?.total ?? 0),
      ])
      return res.json({ ok: true, stats: { totalUsers, totalAlbums, totalStudios, totalScans } })
    }

    if (role === 'photographer') {
      const [totalAlbums, totalCustomers, qrScans, totalEvents] = await Promise.all([
        db.collection('albums').countDocuments({ ownerId: id, deleted: { $ne: true } }),
        db.collection('albums').distinct('customerIds', { ownerId: id }).then(ids => ids.length),
        db.collection('albums').aggregate([
          { $match: { ownerId: id } },
          { $group: { _id: null, total: { $sum: '$qrCode.scans' } } }
        ]).toArray().then(r => r[0]?.total ?? 0),
        db.collection('events').countDocuments({ ownerId: id, deleted: { $ne: true } }),
      ])
      return res.json({ ok: true, stats: { totalAlbums, totalCustomers, qrScans, totalEvents } })
    }

    if (role === 'studio_manager') {
      const [totalAlbums, teamMembers, totalBookings, qrScans] = await Promise.all([
        db.collection('albums').countDocuments({ ownerId: id, deleted: { $ne: true } }),
        // Team members = photographers with studioId matching this user
        db.collection('users').countDocuments({ studioManagerId: id, role: 'photographer', isActive: true }),
        db.collection('events').countDocuments({ ownerId: id, deleted: { $ne: true } }),
        db.collection('albums').aggregate([
          { $match: { ownerId: id } },
          { $group: { _id: null, total: { $sum: '$qrCode.scans' } } }
        ]).toArray().then(r => r[0]?.total ?? 0),
      ])
      return res.json({ ok: true, stats: { totalAlbums, teamMembers, totalBookings, qrScans } })
    }

    if (role === 'customer') {
      const [sharedAlbums, totalScans] = await Promise.all([
        db.collection('albums').countDocuments({
          $or: [{ customerIds: id }, { isPublic: true }],
          deleted: { $ne: true }
        }),
        db.collection('albums').aggregate([
          { $match: { customerIds: id } },
          { $group: { _id: null, total: { $sum: '$totalViews' } } }
        ]).toArray().then(r => r[0]?.total ?? 0),
      ])
      return res.json({ ok: true, stats: { sharedAlbums, totalScans } })
    }

    return res.json({ ok: true, stats: {} })
  } catch (err) {
    console.error('Stats error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to load stats' })
  }
})

module.exports = router
