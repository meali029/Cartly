console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY);
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Checkout Session (PKR)
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'pkr', // 🇵🇰 Currency
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round(item.price * 100), // Convert PKR to paisa
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Stripe Checkout error:', error.message);
    res.status(500).json({ message: 'Failed to create Stripe session' });
  }
};

module.exports = { createCheckoutSession };
