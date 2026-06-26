const router = require('express').Router()
const crypto = require('crypto')
const { requireAuth } = require('../middleware/auth')
const { getAlbumById, setAlbumQRCode, sanitizeAlbum } = require('../models/album')

// ── POST /api/qr/generate  ───────────────────────────────────────────────────
// Generate a QR code token for an album
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { albumId } = req.body
    if (!albumId) return res.status(400).json({ ok: false, message: 'albumId is required' })

    const album = await getAlbumById(albumId)
    if (!album || album.deleted) return res.status(404).json({ ok: false, message: 'Album not found' })

    const isOwner = album.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })

    const token = crypto.randomBytes(16).toString('hex')
    const qrData = {
      token,
      albumId: albumId.toString(),
      createdAt: new Date(),
      scans: 0,
    }

    await setAlbumQRCode(albumId, qrData)

    // The QR code encodes a URL — frontend scans this and opens the album
    const baseUrl = process.env.FRONTEND_URL || 'https://arcam.vercel.app'
    const qrUrl = `${baseUrl}/scan/${token}`

    return res.json({ ok: true, token, qrUrl, albumId })
  } catch (err) {
    console.error('QR generate error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to generate QR code' })
  }
})

// ── GET /api/qr/scan/:token  ─────────────────────────────────────────────────
// Resolve a QR scan token → return the album
router.get('/scan/:token', async (req, res) => {
  try {
    const { connectToDatabase } = require('../db')
    const db = await connectToDatabase()
    const album = await db.collection('albums').findOne({ 'qrCode.token': req.params.token, deleted: { $ne: true } })
    if (!album) return res.status(404).json({ ok: false, message: 'QR code not found or expired' })

    // Increment scan count
    await db.collection('albums').updateOne(
      { 'qrCode.token': req.params.token },
      { $inc: { 'qrCode.scans': 1 } }
    )

    const { sanitizeAlbum } = require('../models/album')
    return res.json({ ok: true, album: sanitizeAlbum(album) })
  } catch (err) {
    console.error('QR scan error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to resolve QR code' })
  }
})

module.exports = router
