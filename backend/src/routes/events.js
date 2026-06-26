const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { createEvent, getEventsByOwner, getEventById, updateEvent, deleteEvent, sanitizeEvent } = require('../models/event')

// GET /api/events — list own events
router.get('/', requireAuth, async (req, res) => {
  try {
    const events = await getEventsByOwner(req.user.id)
    return res.json({ ok: true, events: events.map(sanitizeEvent) })
  } catch (err) {
    console.error('Events list error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to fetch events' })
  }
})

// POST /api/events — create event
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, date, location, clientName, clientEmail, status, albumId } = req.body
    if (!title) return res.status(400).json({ ok: false, message: 'title is required' })
    if (!date) return res.status(400).json({ ok: false, message: 'date is required' })

    const event = await createEvent({
      title, description, date, location, clientName, clientEmail, status, albumId,
      ownerId: req.user.id,
      ownerRole: req.user.role,
    })
    return res.status(201).json({ ok: true, event: sanitizeEvent(event) })
  } catch (err) {
    console.error('Event create error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to create event' })
  }
})

// PATCH /api/events/:id — update event
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const event = await getEventById(req.params.id)
    if (!event || event.deleted) return res.status(404).json({ ok: false, message: 'Event not found' })

    const isOwner = event.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })

    const updated = await updateEvent(req.params.id, req.body)
    return res.json({ ok: true, event: sanitizeEvent(updated) })
  } catch (err) {
    console.error('Event update error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to update event' })
  }
})

// DELETE /api/events/:id — soft delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const event = await getEventById(req.params.id)
    if (!event || event.deleted) return res.status(404).json({ ok: false, message: 'Event not found' })

    const isOwner = event.ownerId === req.user.id
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role)
    if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, message: 'Access denied' })

    await deleteEvent(req.params.id)
    return res.json({ ok: true })
  } catch (err) {
    console.error('Event delete error:', err)
    return res.status(500).json({ ok: false, message: 'Failed to delete event' })
  }
})

module.exports = router
