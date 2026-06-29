const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { requireRole } = require('../middleware/rbac')
const {
  createAlbum, getAlbumsByOwner, getAlbumsForCustomer,
  getAlbumById, updateAlbum, addPhotoToAlbum, removePhotoFromAlbum,
  deleteAlbum, incrementViews, sanitizeAlbum,
} = require('../models/album')

const CREATOR_ROLES = ['photographer', 'studio_manager', 'admin', 'super_admin']

// ── GET /api/albums  ─────────────────────────────────────────────────────────
// Returns albums owned by current user (creators) or accessible to customer
router.get('/', requireAuth, async (req, res) => {
  try {
    const { role, id } = req.user
    let albums
    if (role === 'customer' || role === 'staff') {
      albums = await getAlbumsForCustomer(id)
    } else {
      albums = await getAlbumsByOwner(id)
    }
    return res.json({ ok: true, albums: albums.filter(a => !a.deleted).map(sanitizeAlbum) })
  } catch (err) {
    console.error('Get albums error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to fetch albums' })
  }
})

// ── POST /api/albums  ────────────────────────────────────────────────────────
router.post('/', requireAuth, requireRole(...CREATOR_ROLES), async (req, res) => {
  try {
    const { title, description, isPublic } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ ok: false, message: 'Album title is required' })
    }
    const album = await createAlbum({
      title: title.trim(),
      description,
      ownerId: req.user.id,
      ownerRole: req.user.role,
      isPublic: isPublic ?? false,
    })
    return res.status(201).json({ ok: true, album: sanitizeAlbum(album) })
  } catch (err) {
    console.error('Create album error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to create album' })
  }
})

// ── GET /api/albums/:id  ─────────────────────────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id)
    if (!album || album.deleted) {
      return res.status(404).json({ ok: false, message: 'Album not found' })
    }
    const { role, id } = req.user
    const isOwner = album.ownerId === id
    const isAdmin = ['admin', 'super_admin'].includes(role)
    const isCustomer = album.isPublic || (album.customerIds || []).includes(id)
    if (!isOwner && !isAdmin && !isCustomer) {
      return res.status(403).json({ ok: false, message: 'Access denied' })
    }
    await incrementViews(req.params.id)
    return res.json({ ok: true, album: sanitizeAlbum(album) })
  } catch (err) {
    console.error('Get album error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to fetch album' })
  }
})

// ── PUT /api/albums/:id  ─────────────────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id)
    if (!album || album.deleted) return res.status(404).json({ ok: false, message: 'Album not found' })
    const isOwner = album.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })
    const updated = await updateAlbum(req.params.id, req.body)
    return res.json({ ok: true, album: sanitizeAlbum(updated) })
  } catch (err) {
    console.error('Update album error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to update album' })
  }
})

// ── DELETE /api/albums/:id  ──────────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id)
    if (!album || album.deleted) return res.status(404).json({ ok: false, message: 'Album not found' })
    const isOwner = album.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })
    await deleteAlbum(req.params.id)
    return res.json({ ok: true, message: 'Album deleted' })
  } catch (err) {
    console.error('Delete album error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to delete album' })
  }
})

// ── POST /api/albums/:id/photos  ─────────────────────────────────────────────
router.post('/:id/photos', requireAuth, async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id)
    if (!album || album.deleted) return res.status(404).json({ ok: false, message: 'Album not found' })
    const isOwner = album.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })
    const { url, caption, videoUrl } = req.body
    if (!url) return res.status(400).json({ ok: false, message: 'Photo URL is required' })
    const photo = await addPhotoToAlbum(req.params.id, { url, caption, videoUrl: videoUrl || null })
    return res.status(201).json({ ok: true, photo })
  } catch (err) {
    console.error('Add photo error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to add photo' })
  }
})

// ── DELETE /api/albums/:id/photos  ───────────────────────────────────────────
router.delete('/:id/photos', requireAuth, async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id)
    if (!album || album.deleted) return res.status(404).json({ ok: false, message: 'Album not found' })
    const isOwner = album.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })
    const { url } = req.body
    if (!url) return res.status(400).json({ ok: false, message: 'Photo URL is required' })
    await removePhotoFromAlbum(req.params.id, url)
    return res.json({ ok: true, message: 'Photo removed' })
  } catch (err) {
    console.error('Remove photo error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to remove photo' })
  }
})

// ── POST /api/albums/:id/customers  ──────────────────────────────────────────
// Grant a customer access to this album
router.post('/:id/customers', requireAuth, requireRole(...CREATOR_ROLES), async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id)
    if (!album || album.deleted) return res.status(404).json({ ok: false, message: 'Album not found' })
    const isOwner = album.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })
    const { customerId } = req.body
    if (!customerId) return res.status(400).json({ ok: false, message: 'customerId is required' })
    const existing = album.customerIds || []
    if (!existing.includes(customerId)) {
      await updateAlbum(req.params.id, { customerIds: [...existing, customerId] })
    }
    return res.json({ ok: true, message: 'Customer granted access' })
  } catch (err) {
    console.error('Grant access error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to grant access' })
  }
})

module.exports = router
