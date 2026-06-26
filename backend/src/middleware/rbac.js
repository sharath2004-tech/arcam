// Role hierarchy: higher roles can access lower-role routes
const ROLE_HIERARCHY = {
  super_admin: ['super_admin', 'admin', 'studio_manager', 'staff', 'photographer', 'customer'],
  admin:        ['admin', 'studio_manager', 'staff', 'photographer', 'customer'],
  studio_manager: ['studio_manager', 'staff'],
  photographer: ['photographer'],
  staff:        ['staff'],
  customer:     ['customer'],
}

/**
 * requireRole('admin', 'super_admin') — user must have one of the listed roles
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: 'Authentication required' })
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, message: `Access denied. Required roles: ${allowedRoles.join(', ')}` })
    }
    next()
  }
}

/**
 * requireMinRole('studio_manager') — user must be studio_manager or above in hierarchy
 */
function requireMinRole(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: 'Authentication required' })
    }
    const allowed = ROLE_HIERARCHY[req.user.role] || []
    // Check if the user's hierarchy includes the minRole
    const userLevel = Object.keys(ROLE_HIERARCHY).indexOf(req.user.role)
    const requiredLevel = Object.keys(ROLE_HIERARCHY).indexOf(minRole)
    if (userLevel > requiredLevel) {
      return res.status(403).json({ ok: false, message: `Insufficient permissions. Minimum role required: ${minRole}` })
    }
    next()
  }
}

/**
 * ownerOrRole — user can access their own resource, or must have one of the listed roles
 */
function ownerOrRole(getOwnerId, ...adminRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: 'Authentication required' })
    }
    const ownerId = getOwnerId(req)
    if (req.user.id === ownerId || adminRoles.includes(req.user.role)) {
      return next()
    }
    return res.status(403).json({ ok: false, message: 'Access denied' })
  }
}

module.exports = { requireRole, requireMinRole, ownerOrRole, ROLE_HIERARCHY }
