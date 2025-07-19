const nodemailer = require('nodemailer');

// Create transporter with error handling
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
   
    return null;
  }

  // Gmail configuration with better error handling
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
    });
  }
  
  // Alternative: SMTP configuration for other providers (Ethereal, custom SMTP)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const transporter = createTransporter();

const sendOrderConfirmationEmail = async (toEmail, order) => {
  if (!transporter) {
    throw new Error('Email service not configured');
  }

  const mailOptions = {
    from: `"Cratly Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Order Confirmation - ${order._id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${order._id}</p>
      <p>Total Price: PKR ${order.totalPrice}</p>
      <h3>Items:</h3>
      <ul>
        ${order.items.map(item => `
          <li>${item.quantity} x ${item.productId.title} (Size: ${item.size || 'N/A'})</li>
        `).join('')}
      </ul>
      <p>We will notify you when your order is shipped.</p>
      <br/>
      <p>Cheers,</p>
      <p><strong>Cratly Team</strong></p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (toEmail, otpCode) => {
  if (!transporter) {
    throw new Error('Email service not configured');
  }

  const mailOptions = {
    from: `"Cartly Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset - Cartly',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Cartly Account Security</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. Use the verification code below to set a new password:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
            <h3 style="color: #667eea; margin: 0 0 10px 0;">Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; font-family: monospace;">
              ${otpCode}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            • This code will expire in 10 minutes<br/>
            • If you didn't request this, please ignore this email<br/>
            • Your password will remain unchanged until you set a new one
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This email was sent by Cartly Store. If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendEmailVerificationOTP = async (toEmail, otpCode, userName) => {
  if (!transporter) {
    throw new Error('Email service not configured');
  }

  const mailOptions = {
    from: `"Cartly Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify Your Email - Cartly',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Cartly!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Email Verification Required</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName || 'there'}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Welcome to Cartly! We're excited to have you join our community. To complete your registration and secure your account, please verify your email address using the code below:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #4f46e5; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
            <h3 style="color: #4f46e5; margin: 0 0 10px 0;">Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; font-family: monospace;">
              ${otpCode}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            • This code will expire in 10 minutes<br/>
            • Enter this code on the verification page to activate your account<br/>
            • If you didn't create an account, please ignore this email
          </p>
          
          <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="color: #0284c7; font-size: 14px; margin: 0;">
              <strong>Next Steps:</strong> Once verified, you'll be able to browse our products, add items to your cart, and place orders!
            </p>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This email was sent by Cartly Store. If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendEmailVerificationOTP
};
