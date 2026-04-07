const nodemailer = require('nodemailer');

// Check if email is configured
const isEmailConfigured = () => {
  return !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
};

// Create transporter only if configured
let transporter = null;

if (isEmailConfigured()) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('✅ Email service configured');
  } catch (error) {
    console.warn('⚠️ Email service configuration failed:', error.message);
    transporter = null;
  }
} else {
  console.warn('⚠️ Email not configured. Set EMAIL_* variables in .env file.');
}

// Send contact notification to admin
exports.sendContactNotification = async ({ name, email, phone, subject, message }) => {
  if (!transporter) {
    console.log('📧 Email not configured - skipping notification');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Jellof Fashion'}" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Contact Form: ${subject || 'No Subject'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #667eea; }
            .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🆕 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              ${phone ? `
              <div class="field">
                <div class="label">📱 Phone:</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              ${subject ? `
              <div class="field">
                <div class="label">📝 Subject:</div>
                <div class="value">${subject}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">${message}</div>
              </div>
              <div class="footer">
                <p>Received: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification sent to admin');
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send contact notification:', error.message);
    throw error;
  }
};

// Send auto-reply to customer
exports.sendContactAutoReply = async ({ name, email }) => {
  if (!transporter) {
    console.log('📧 Email not configured - skipping auto-reply');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Jellof'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting Jellof Fashion',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; 
                     padding: 12px 30px; text-decoration: none; border-radius: 6px; 
                     margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              
              <p>Thank you for reaching out to Jellof Fashion! We've received your message and appreciate you taking the time to contact us.</p>
              
              <p>Our team will review your inquiry and get back to you within 24-48 hours.</p>
              
              <p>In the meantime, feel free to:</p>
              <ul>
                <li>Browse our latest collections</li>
                <li>Check out our FAQ page for quick answers</li>
                <li>Follow us on social media for updates and promotions</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}" class="button">
                  Visit Our Store
                </a>
              </div>
              
              <div class="footer">
                <p><strong>Jellof Fashion</strong></p>
                <p>123 Fashion Avenue, New York, NY 10001</p>
                <p>📧 hello@jellof.com | 📱 +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Auto-reply sent to customer');
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send auto-reply:', error.message);
    throw error;
  }
};

// Send order confirmation
exports.sendOrderConfirmation = async ({ email, name, orderId, total, items }) => {
  if (!transporter) {
    console.log('📧 Email not configured - skipping order confirmation');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Jellof Fashion'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 30px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f0f0f0; font-weight: bold; }
            .total { font-size: 1.2em; font-weight: bold; color: #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
              <p>Order #${orderId}</p>
            </div>
            <div style="padding: 20px;">
              <p>Hi ${name},</p>
              <p>Thank you for your order! We've received your payment and are preparing your items for shipment.</p>
              
              <h3>Order Details:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                    <td class="total">$${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <p>We'll send you another email with tracking information once your order ships.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation sent');
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send order confirmation:', error.message);
    throw error;
  }
};

module.exports = exports;