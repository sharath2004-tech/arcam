const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { connectToDatabase } = require('../db')

// GET /api/analytics?range=30  — returns chart data scoped to the user's role
router.get('/', requireAuth, async (req, res) => {
  try {
    const db = await connectToDatabase()
    const { id, role } = req.user
    const days = Math.min(parseInt(req.query.range || '30', 10), 365)
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    // Helper: build a 0-filled daily series from a date→count map
    function buildSeries(countMap) {
      const series = []
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const key = d.toISOString().slice(0, 10)
        series.push({ date: key, value: countMap[key] || 0 })
      }
      return series
    }

    if (role === 'admin' || role === 'super_admin') {
      // User signups per day
      const signups = await db.collection('users').aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      ]).toArray()
      const signupMap = Object.fromEntries(signups.map(s => [s._id, s.count]))

      const albumsCreated = await db.collection('albums').aggregate([
        { $match: { createdAt: { $gte: since }, deleted: { $ne: true } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      ]).toArray()
      const albumsMap = Object.fromEntries(albumsCreated.map(a => [a._id, a.count]))

      return res.json({
        ok: true,
        charts: {
          signups: buildSeries(signupMap),
          albums: buildSeries(albumsMap),
        },
      })
    }

    if (role === 'photographer' || role === 'studio_manager') {
      // Albums created per day
      const albumsCreated = await db.collection('albums').aggregate([
        { $match: { ownerId: id, createdAt: { $gte: since }, deleted: { $ne: true } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      ]).toArray()
      const albumsMap = Object.fromEntries(albumsCreated.map(a => [a._id, a.count]))

      // Events per day
      const eventsCreated = await db.collection('events').aggregate([
        { $match: { ownerId: id, createdAt: { $gte: since }, deleted: { $ne: true } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      ]).toArray()
      const eventsMap = Object.fromEntries(eventsCreated.map(e => [e._id, e.count]))

      return res.json({
        ok: true,
        charts: {
          albums: buildSeries(albumsMap),
          events: buildSeries(eventsMap),
        },
      })
    }

    return res.json({ ok: true, charts: {} })
  } catch (err) {
    console.error('Analytics error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to load analytics' })
  }
})

module.exports = router
