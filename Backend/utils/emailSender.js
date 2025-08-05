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

  // Calculate order date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate items HTML with proper product details
  const itemsHtml = order.items.map(item => {
    const product = item.productId;
    const productImage = item.image || (product && product.image) || '';
    const productTitle = item.title || (product && product.title) || 'Product';
    const productPrice = item.price || (product && product.price) || 0;
    
    return `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px 0; vertical-align: top;">
          <div style="display: flex; align-items: center;">
            ${productImage ? `<img src="${productImage}" alt="${productTitle}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">` : ''}
            <div>
              <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${productTitle}</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">
                ${item.size ? `Size: ${item.size}` : ''} 
                ${item.color ? `${item.size ? ' • ' : ''}Color: ${item.color}` : ''}
              </p>
            </div>
          </div>
        </td>
        <td style="padding: 15px 0; text-align: center; color: #333; font-weight: 500;">
          ${item.quantity}
        </td>
        <td style="padding: 15px 0; text-align: right; color: #333; font-weight: 600;">
          PKR ${productPrice.toLocaleString()}
        </td>
        <td style="padding: 15px 0; text-align: right; color: #333; font-weight: 700;">
          PKR ${(productPrice * item.quantity).toLocaleString()}
        </td>
      </tr>
    `;
  }).join('');

  // Calculate delivery charges based on order amount
  const orderAmount = order.totalPrice || 0;
  const deliveryCharges = orderAmount >= 5000 ? 0 : 200; // Free delivery on 5000+ PKR, otherwise 200 PKR
  const tax = order.tax || 0;
  
  // Calculate subtotal (order amount without delivery charges)
  const subtotal = orderAmount - deliveryCharges - tax;
  
  // Final total should match order.totalPrice
  const finalTotal = order.totalPrice;

  const mailOptions = {
    from: `"Cartly Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎉 Order Confirmation #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #a9a9a9 0%, #4f4f4f 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🎉 Order Confirmed!</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Thank you for shopping with Cartly</p>
            <div style="background: rgba(255,255,255,0.2); border-radius: 25px; padding: 10px 20px; margin: 20px auto 0; display: inline-block;">
              <span style="font-size: 16px; font-weight: 600;">Order #${order._id.toString().slice(-8).toUpperCase()}</span>
            </div>
          </div>

          <!-- Order Summary -->
          <div style="padding: 30px;">
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">📋 Order Summary</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Order Date</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600;">${orderDate}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Payment Method</p>
                  <p style="margin: 5px 0 0 0; color: #333; font-weight: 600;">${order.paymentMethod || 'COD'}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Payment Status</p>
                  <p style="margin: 5px 0 0 0; color: ${order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b'}; font-weight: 600; text-transform: capitalize;">${order.paymentStatus || 'Pending'}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Order Status</p>
                  <p style="margin: 5px 0 0 0; color: #3b82f6; font-weight: 600; text-transform: capitalize;">${order.status || 'Processing'}</p>
                </div>
              </div>
            </div>

            <!-- Items Table -->
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">🛍️ Your Items</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 15px; text-align: left; color: #666; font-weight: 600; font-size: 14px;">PRODUCT</th>
                  <th style="padding: 15px; text-align: center; color: #666; font-weight: 600; font-size: 14px;">QTY</th>
                  <th style="padding: 15px; text-align: right; color: #666; font-weight: 600; font-size: 14px;">PRICE</th>
                  <th style="padding: 15px; text-align: right; color: #666; font-weight: 600; font-size: 14px;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Order Total -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 30px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Subtotal:</td>
                  <td style="padding: 8px 0; text-align: right; color: #333; font-weight: 600;">PKR ${subtotal.toLocaleString()}</td>
                </tr>
                ${deliveryCharges > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Delivery Charges:</td>
                  <td style="padding: 8px 0; text-align: right; color: #333; font-weight: 600;">PKR ${deliveryCharges.toLocaleString()}</td>
                </tr>
                <tr style="background: #fff3cd; border-left: 4px solid #ffc107;">
                  <td colspan="2" style="padding: 10px; color: #856404; font-size: 12px; font-style: italic;">
                    💡 Tip: Get FREE delivery on orders of PKR 5,000 or more!
                  </td>
                </tr>
                ` : `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Delivery:</td>
                  <td style="padding: 8px 0; text-align: right; color: #10b981; font-weight: 600;">FREE</td>
                </tr>
                <tr style="background: #d1fae5; border-left: 4px solid #10b981;">
                  <td colspan="2" style="padding: 10px; color: #065f46; font-size: 12px; font-style: italic;">
                    🎉 Congratulations! You qualified for FREE delivery (PKR 5,000+)
                  </td>
                </tr>
                `}
                ${tax > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Tax:</td>
                  <td style="padding: 8px 0; text-align: right; color: #333; font-weight: 600;">PKR ${tax.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #667eea;">
                  <td style="padding: 15px 0 8px 0; color: #333; font-size: 18px; font-weight: 700;">Total:</td>
                  <td style="padding: 15px 0 8px 0; text-align: right; color: #667eea; font-size: 24px; font-weight: 700;">PKR ${finalTotal.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <!-- Shipping Address -->
            ${order.shippingInfo ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 5px; padding: 20px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #0284c7; font-size: 18px;">📍 Shipping Address</h3>
              <p style="margin: 0; color: #333; line-height: 1.6;">
                <strong>${order.shippingInfo.address}</strong><br>
                ${order.shippingInfo.city}, ${order.shippingInfo.postalCode}<br>
                ${order.shippingInfo.country}
              </p>
            </div>
            ` : ''}

            <!-- What's Next -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; font-size: 20px;">🚀 What's Next?</h3>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">
                We're preparing your order with care! You'll receive a shipping confirmation email with tracking details once your order is on its way.
              </p>
              <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; margin: 20px 0 0 0;">
                <p style="margin: 0; font-size: 14px;">
                  <strong>Estimated Delivery:</strong> 3-5 business days
                </p>
              </div>
            </div>

            <!-- Footer Message -->
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee;">
              <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Thank you for choosing Cartly! 💜</h3>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                If you have any questions about your order, feel free to contact our support team.<br>
                We're here to help make your shopping experience amazing!
              </p>
              
              <div style="margin: 25px 0 0 0;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                  This email was sent by Cartly Store<br>
                  Order confirmation for ${toEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
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
