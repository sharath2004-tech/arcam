const router = require('express').Router()

// Static plan definitions — replace with DB-backed plans if needed
const PLANS = {
  photographer: [
    {
      id: 'photographer_free',
      name: 'Free',
      price: 0,
      currency: 'INR',
      interval: 'month',
      features: ['Up to 5 albums', '20 customers', '1 QR code per album', 'Basic analytics'],
    },
    {
      id: 'photographer_pro',
      name: 'Pro',
      price: 499,
      currency: 'INR',
      interval: 'month',
      features: ['Unlimited albums', 'Unlimited customers', 'Unlimited QR codes', 'Advanced analytics', 'Priority support'],
      recommended: true,
    },
    {
      id: 'photographer_studio',
      name: 'Studio',
      price: 1499,
      currency: 'INR',
      interval: 'month',
      features: ['Everything in Pro', 'Team collaboration', 'White-label QR codes', 'Custom domain', 'Dedicated support'],
    },
  ],
  studio_manager: [
    {
      id: 'studio_starter',
      name: 'Starter',
      price: 999,
      currency: 'INR',
      interval: 'month',
      features: ['Up to 3 photographers', '50 albums', 'Basic analytics'],
    },
    {
      id: 'studio_growth',
      name: 'Growth',
      price: 2499,
      currency: 'INR',
      interval: 'month',
      features: ['Up to 10 photographers', 'Unlimited albums', 'Advanced analytics', 'Client portal'],
      recommended: true,
    },
  ],
  customer: [
    {
      id: 'customer_free',
      name: 'Free',
      price: 0,
      currency: 'INR',
      interval: 'month',
      features: ['View shared albums', 'AR camera access', 'Scan QR codes'],
    },
    {
      id: 'customer_premium',
      name: 'Premium',
      price: 199,
      currency: 'INR',
      interval: 'month',
      features: ['Everything in Free', 'Download photos', 'Offline AR', 'Priority access'],
      recommended: true,
    },
  ],
}

// GET /api/plans?role=photographer  — return plans for a role
router.get('/', (req, res) => {
  const role = req.query.role || 'photographer'
  const plans = PLANS[role] || []
  return res.json({ ok: true, plans })
})

module.exports = router
