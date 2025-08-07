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
    subject: '🎉 Welcome to Cartly Newsletter - Exclusive Deals Await!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Cartly Newsletter</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🎉 Welcome to Cartly!</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">You're now part of our exclusive newsletter family</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 24px;">🛍️ Thanks for Subscribing!</h2>
              <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">
                You've successfully subscribed to our newsletter! Get ready for exclusive deals, new arrivals, and fashion inspiration delivered straight to your inbox.
              </p>
            </div>

            <!-- Benefits -->
            <div style="background: #f8f9fa; border-radius: 15px; padding: 30px; margin: 30px 0;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 20px; text-align: center;">✨ What You'll Get</h3>
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 40px; height: 40px; background: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="color: white; font-size: 20px;">🏷️</span>
                  </div>
                  <div>
                    <h4 style="margin: 0; color: #333; font-size: 16px;">Exclusive Discounts</h4>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Be the first to know about sales and special offers</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 40px; height: 40px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="color: white; font-size: 20px;">👗</span>
                  </div>
                  <div>
                    <h4 style="margin: 0; color: #333; font-size: 16px;">New Arrivals</h4>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Get early access to our latest fashion collections</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 40px; height: 40px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="color: white; font-size: 20px;">💡</span>
                  </div>
                  <div>
                    <h4 style="margin: 0; color: #333; font-size: 16px;">Style Tips</h4>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Fashion advice and styling inspiration from our experts</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 40px; height: 40px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="color: white; font-size: 20px;">⚡</span>
                  </div>
                  <div>
                    <h4 style="margin: 0; color: #333; font-size: 16px;">Flash Sales</h4>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Limited-time offers and lightning deals</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Welcome Offer -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 15px; padding: 30px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; font-size: 22px;">🎁 Welcome Gift</h3>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">
                As a thank you for joining us, enjoy <strong>15% OFF</strong> your next purchase!
              </p>
              <div style="background: rgba(255,255,255,0.2); border-radius: 10px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 2px;">
                  Code: WELCOME15
                </p>
              </div>
              <p style="margin: 0; font-size: 14px; opacity: 0.8;">
                Valid for 7 days • Minimum order PKR 2,000
              </p>
            </div>

            <!-- Social Media -->
            <div style="text-align: center; margin: 40px 0;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px;">Follow Us for More</h3>
              <div style="display: flex; justify-content: center; gap: 15px;">
                <a href="#" style="width: 45px; height: 45px; background: #1877f2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">
                  <span style="color: white; font-size: 20px;">📘</span>
                </a>
                <a href="#" style="width: 45px; height: 45px; background: #e4405f; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">
                  <span style="color: white; font-size: 20px;">📷</span>
                </a>
                <a href="#" style="width: 45px; height: 45px; background: #1da1f2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">
                  <span style="color: white; font-size: 20px;">🐦</span>
                </a>
                <a href="#" style="width: 45px; height: 45px; background: #ff0000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">
                  <span style="color: white; font-size: 20px;">📺</span>
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #eee; padding-top: 30px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">
                Happy Shopping! 💜
              </p>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px; line-height: 1.6;">
                You're receiving this email because you subscribed to Cartly newsletter.<br>
                We respect your privacy and will never share your email with third parties.
              </p>
              
              <div style="margin: 20px 0;">
                <a href="${unsubscribeLink}" style="color: #999; font-size: 12px; text-decoration: underline;">
                  Unsubscribe from newsletter
                </a>
              </div>
              
              <p style="margin: 0; color: #999; font-size: 12px;">
                Cartly Store - Pakistan's Leading Fashion Destination<br>
                Email sent to: ${toEmail}
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

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
      message: 'Failed to subscribe. Please try again later.'
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
