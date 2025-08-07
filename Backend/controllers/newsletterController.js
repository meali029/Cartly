const nodemailer = require('nodemailer')

// Create Newsletter model (simplified - you can create a proper MongoDB model later)
const Newsletter = {
  subscribers: new Set(), // In-memory storage for demo - replace with database
  
  async add(email) {
    this.subscribers.add(email.toLowerCase())
    return true
  },
  
  async remove(email) {
    return this.subscribers.delete(email.toLowerCase())
  },
  
  async exists(email) {
    return this.subscribers.has(email.toLowerCase())
  },
  
  async getAll() {
    return Array.from(this.subscribers)
  }
}

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null
  }

  if (process.env.EMAIL_USER.includes('gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

const transporter = createTransporter()

// Send newsletter welcome email
const sendNewsletterWelcomeEmail = async (toEmail) => {
  if (!transporter) {
    throw new Error('Email service not configured')
  }

  const unsubscribeLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter/unsubscribe?email=${encodeURIComponent(toEmail)}`

 const mailOptions = {
  from: `"Cartly Newsletter" <${process.env.EMAIL_USER}>`,
  to: toEmail,
  subject: '🎉 Welcome to Cartly! Enjoy 15% OFF Your Next Order',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Cartly Newsletter</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; text-align: center; padding: 30px 20px;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Cartly</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Thanks for joining our newsletter</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px; text-align: center; color: #333;">
          <h2 style="font-size: 22px; margin-bottom: 10px;">Here's What to Expect</h2>
          <ul style="list-style: none; padding: 0; margin: 20px 0; font-size: 15px; color: #555;">
            <li>🏷️ Early Access to Sales</li>
            <li>👗 Latest Fashion Arrivals</li>
            <li>⚡ Flash Deals & Trends</li>
          </ul>

          <!-- Welcome Offer -->
          <div style="background: #10b981; color: #fff; border-radius: 10px; padding: 20px; margin: 30px 0;">
            <h3 style="margin: 0 0 10px; font-size: 20px;">🎁 15% OFF Just for You!</h3>
            <p style="margin: 0 0 10px;">Use code <strong>WELCOME15</strong> on your next order.</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">Valid for 7 days • Min. PKR 2,000</p>
          </div>

          <!-- Social Icons -->
          <p style="margin-top: 30px; font-size: 14px;">Follow us for updates</p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <a href="#" style="width: 40px; height: 40px; background: #1877f2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white;">📘</span>
            </a>
            <a href="#" style="width: 40px; height: 40px; background: #e4405f; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white;">📷</span>
            </a>
            <a href="#" style="width: 40px; height: 40px; background: #ff0000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white;">📺</span>
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;">
          <p style="margin: 0;">Sent to: ${toEmail}</p>
          <a href="${unsubscribeLink}" style="color: #999; text-decoration: underline; display: inline-block; margin-top: 8px;">
            Unsubscribe
          </a>
          <p style="margin-top: 10px;">© 2025 Cartly - All rights reserved</p>
        </div>

      </div>
    </body>
    </html>
  `
};


  await transporter.sendMail(mailOptions)
}

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      })
    }

    // Check if already subscribed
    const alreadySubscribed = await Newsletter.exists(email)
    if (alreadySubscribed) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        alreadySubscribed: true
      })
    }

    // Add to newsletter
    await Newsletter.add(email)

    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email)
      console.log(`Welcome email sent successfully to: ${email}`)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Still consider subscription successful even if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed! Check your email for a welcome message.',
      email: email
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    const removed = await Newsletter.remove(email)
    
    if (removed) {
      res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from newsletter.'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Email not found in newsletter list.'
      })
    }

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe. Please try again later.'
    })
  }
}

module.exports = {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  Newsletter // Export for potential admin use
}
