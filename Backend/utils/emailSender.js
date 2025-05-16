const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendOrderConfirmationEmail = async (toEmail, order) => {
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

module.exports = sendOrderConfirmationEmail;
