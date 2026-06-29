const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { createUser, findUserByEmail, findUserById, setOtpCode, verifyUserEmail, sanitizeUser, VALID_ROLES } = require('../models/user')
const { signToken, requireAuth } = require('../middleware/auth')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, phone } = req.body

    if (!email || !password || !name || !role) {
      return res.status(400).json({ ok: false, message: 'email, password, name, and role are required' })
    }
    if (!['customer', 'photographer', 'studio_manager'].includes(role)) {
      return res.status(400).json({ ok: false, message: 'Invalid role. Allowed: customer, photographer, studio_manager' })
    }
    if (password.length < 8) {
      return res.status(400).json({ ok: false, message: 'Password must be at least 8 characters' })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return res.status(409).json({ ok: false, message: 'An account with this email already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await createUser({ email, passwordHash, name, phone, role })

    // OTP email verification is disabled for now — mark verified immediately.
    await verifyUserEmail(user._id.toString())

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role })
    return res.status(201).json({
      ok: true,
      message: 'Account created successfully.',
      token,
      user: { ...sanitizeUser(user), isVerified: true },
      requiresVerification: false,
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ ok: false, message: 'Registration failed. Please try again.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password are required' })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' })
    }
    if (!user.isActive) {
      return res.status(403).json({ ok: false, message: 'Account has been deactivated' })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' })
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role })
    return res.json({
      ok: true,
      token,
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ ok: false, message: 'Login failed. Please try again.' })
  }
})

// POST /api/auth/verify-otp
router.post('/verify-otp', requireAuth, async (req, res) => {
  try {
    const { otp } = req.body
    if (!otp) return res.status(400).json({ ok: false, message: 'OTP is required' })

    const user = await findUserById(req.user.id)
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' })

    if (user.isVerified) {
      return res.json({ ok: true, message: 'Email already verified' })
    }
    if (!user.otpCode || user.otpCode !== otp.trim()) {
      return res.status(400).json({ ok: false, message: 'Invalid OTP' })
    }
    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ ok: false, message: 'OTP has expired. Request a new one.' })
    }

    await verifyUserEmail(user._id.toString())
    return res.json({ ok: true, message: 'Email verified successfully' })
  } catch (err) {
    console.error('Verify OTP error:', err)
    return res.status(500).json({ ok: false, message: 'Verification failed' })
  }
})

// POST /api/auth/resend-otp
router.post('/resend-otp', requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' })
    if (user.isVerified) return res.json({ ok: true, message: 'Email already verified' })

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await setOtpCode(user._id.toString(), otpCode, otpExpiresAt)

    console.log(`[OTP Resend] ${user.email}: ${otpCode}`)
    // TODO: send OTP via email

    return res.json({ ok: true, message: 'New OTP sent to your email' })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Failed to resend OTP' })
  }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required' })

    const user = await findUserByEmail(email)
    // Always return success to prevent email enumeration
    if (user) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
      await setOtpCode(user._id.toString(), otpCode, otpExpiresAt)
      console.log(`[Password Reset OTP] ${email}: ${otpCode}`)
      // TODO: send OTP via email
    }

    return res.json({ ok: true, message: 'If an account exists, a reset code has been sent to your email.' })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Request failed' })
  }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ ok: false, message: 'email, otp, and newPassword are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ ok: false, message: 'Password must be at least 8 characters' })
    }

    const user = await findUserByEmail(email)
    if (!user || !user.otpCode || user.otpCode !== otp.trim()) {
      return res.status(400).json({ ok: false, message: 'Invalid or expired reset code' })
    }
    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ ok: false, message: 'Reset code has expired. Request a new one.' })
    }

    const { updateUserPassword, verifyUserEmail } = require('../models/user')
    const passwordHash = await bcrypt.hash(newPassword, 12)
    await updateUserPassword(user._id.toString(), passwordHash)
    await verifyUserEmail(user._id.toString()) // also marks as verified

    return res.json({ ok: true, message: 'Password reset successfully. You can now log in.' })
  } catch (err) {
    console.error('Reset password error:', err)
    return res.status(500).json({ ok: false, message: 'Password reset failed' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' })
    return res.json({ ok: true, user: sanitizeUser(user) })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Failed to fetch profile' })
  }
})

// PUT /api/auth/me
router.put('/me', requireAuth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body
    const { updateUser } = require('../models/user')
    const updated = await updateUser(req.user.id, { name, phone, avatar })
    return res.json({ ok: true, user: sanitizeUser(updated) })
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Update failed' })
  }
})

module.exports = router
