const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { requireRole } = require('../middleware/rbac')
const { connectToDatabase } = require('../db')
const { ObjectId } = require('mongodb')
const { findUserByEmail, sanitizeUser } = require('../models/user')
const { getAlbumsByOwner, updateAlbum } = require('../models/album')

const CREATOR_ROLES = ['photographer', 'studio_manager', 'admin', 'super_admin']

async function getUsersCollection() {
  const db = await connectToDatabase()
  return db.collection('users')
}

async function getAlbumsCollection() {
  const db = await connectToDatabase()
  return db.collection('albums')
}

// GET /api/customers
// Returns all unique customers linked to the requesting photographer's albums,
// along with which albums they have access to.
router.get('/', requireAuth, requireRole(...CREATOR_ROLES), async (req, res) => {
  try {
    const albums = await getAlbumsByOwner(req.user.id)
    const activeAlbums = albums.filter(a => !a.deleted)

    // Collect all unique customer IDs across albums
    const customerIdSet = new Set()
    const customerAlbumMap = {}   // customerId -> [{ albumId, albumTitle }]

    for (const album of activeAlbums) {
      for (const cid of (album.customerIds || [])) {
        customerIdSet.add(cid)
        if (!customerAlbumMap[cid]) customerAlbumMap[cid] = []
        customerAlbumMap[cid].push({ albumId: album._id.toString(), albumTitle: album.title })
      }
    }

    if (customerIdSet.size === 0) {
      return res.json({ ok: true, customers: [] })
    }

    // Fetch user documents for each customer ID
    const col = await getUsersCollection()
    const objectIds = [...customerIdSet].map(id => {
      try { return new ObjectId(id) } catch { return null }
    }).filter(Boolean)

    const users = await col
      .find({ _id: { $in: objectIds } })
      .project({ passwordHash: 0, otpCode: 0, otpExpiresAt: 0 })
      .toArray()

    const customers = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      avatar: u.avatar || null,
      albums: customerAlbumMap[u._id.toString()] || [],
    }))

    return res.json({ ok: true, customers })
  } catch (err) {
    console.error('List customers error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to fetch customers' })
  }
})

// POST /api/customers/invite
// Body: { email, albumIds? }  — albumIds is optional array; if omitted, grants access to ALL albums
// Finds the customer by email and adds them to the specified (or all) albums.
router.post('/invite', requireAuth, requireRole(...CREATOR_ROLES), async (req, res) => {
  try {
    const { email, albumIds } = req.body
    if (!email || !email.trim()) {
      return res.status(400).json({ ok: false, message: 'Email is required' })
    }

    const target = await findUserByEmail(email.trim())
    if (!target) {
      return res.status(404).json({ ok: false, message: 'No account found with that email address. Ask the customer to sign up first.' })
    }
    if (!['customer', 'staff'].includes(target.role)) {
      return res.status(400).json({ ok: false, message: 'That account is not a customer account.' })
    }

    const customerId = target._id.toString()
    const albums = await getAlbumsByOwner(req.user.id)
    const activeAlbums = albums.filter(a => !a.deleted)

    // Determine which albums to grant access to
    const targetAlbums = albumIds && albumIds.length > 0
      ? activeAlbums.filter(a => albumIds.includes(a._id.toString()))
      : activeAlbums

    if (targetAlbums.length === 0) {
      return res.status(400).json({ ok: false, message: 'No valid albums found to grant access to.' })
    }

    // Add customerId to each album's customerIds (idempotent)
    for (const album of targetAlbums) {
      const existing = album.customerIds || []
      if (!existing.includes(customerId)) {
        await updateAlbum(album._id.toString(), { customerIds: [...existing, customerId] })
      }
    }

    return res.status(201).json({
      ok: true,
      message: `${target.name} has been granted access to ${targetAlbums.length} album(s).`,
      customer: {
        id: customerId,
        name: target.name,
        email: target.email,
        avatar: target.avatar || null,
        albums: targetAlbums.map(a => ({ albumId: a._id.toString(), albumTitle: a.title })),
      },
    })
  } catch (err) {
    console.error('Invite customer error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to invite customer' })
  }
})

// DELETE /api/customers/:customerId
// Removes the customer from ALL of the photographer's albums.
router.delete('/:customerId', requireAuth, requireRole(...CREATOR_ROLES), async (req, res) => {
  try {
    const { customerId } = req.params
    if (!customerId) {
      return res.status(400).json({ ok: false, message: 'customerId is required' })
    }

    const albums = await getAlbumsByOwner(req.user.id)
    const activeAlbums = albums.filter(a => !a.deleted)

    let removed = 0
    for (const album of activeAlbums) {
      const existing = album.customerIds || []
      if (existing.includes(customerId)) {
        await updateAlbum(album._id.toString(), {
          customerIds: existing.filter(id => id !== customerId),
        })
        removed++
      }
    }

    return res.json({ ok: true, message: `Customer removed from ${removed} album(s).` })
  } catch (err) {
    console.error('Remove customer error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to remove customer' })
  }
})

module.exports = router
