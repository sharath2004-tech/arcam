const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { requireRole } = require('../middleware/rbac')
const { listUsers, findUserById, updateUser, sanitizeUser } = require('../models/user')

// GET /api/users — admin/super_admin only
router.get('/', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query
    const result = await listUsers({ page: Number(page), limit: Number(limit), role, search })
    return res.json({ ok: true, ...result })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Failed to fetch users' })
  }
})

// GET /api/users/:id — own profile or admin
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    if (req.user.id !== id && !['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ ok: false, message: 'Access denied' })
    }
    const user = await findUserById(id)
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' })
    return res.json({ ok: true, user: sanitizeUser(user) })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Failed to fetch user' })
  }
})

// PUT /api/users/:id — own profile or admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    if (req.user.id !== id && !['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ ok: false, message: 'Access denied' })
    }
    const { name, phone, avatar } = req.body
    const updated = await updateUser(id, { name, phone, avatar })
    return res.json({ ok: true, user: sanitizeUser(updated) })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Update failed' })
  }
})

// PUT /api/users/:id/role — super_admin only
router.put('/:id/role', requireAuth, requireRole('super_admin'), async (req, res) => {
  try {
    const { role } = req.body
    const { VALID_ROLES } = require('../models/user')
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ ok: false, message: 'Invalid role' })
    }
    const updated = await updateUser(req.params.id, { role })
    return res.json({ ok: true, user: sanitizeUser(updated) })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Role update failed' })
  }
})

// DELETE /api/users/:id — admin/super_admin only (soft delete)
router.delete('/:id', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  try {
    await updateUser(req.params.id, { isActive: false })
    return res.json({ ok: true, message: 'User deactivated' })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Deactivation failed' })
  }
})

module.exports = router
