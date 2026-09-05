
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'VitalSync Pro Upgrade',
            },
            unit_amount: 999, // amount in cents = $9.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://prodesk-capstone-vital-sync-sooty.vercel.app/success',
      cancel_url: 'https://prodesk-capstone-vital-sync-sooty.vercel.app/dashboard',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Stripe error', error: error.message });
  }
});

module.exports = router;