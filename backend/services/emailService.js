const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send contact form notification to company
exports.sendContactNotification = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: `Contact Form: ${subject || 'New Message from JELLOF Website'}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #2d5016;">New Contact Form Submission</h2>
        <hr style="border: 1px solid #e0e0e0;">
        <div style="margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
        </div>
        <div style="margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message}
          </p>
        </div>
        <hr style="border: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from the JELLOF website contact form.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Send auto-reply to contact form submitter
exports.sendContactAutoReply = async ({ name, email }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting JELLOF',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #2d5016;">Thank You for Reaching Out!</h2>
        <p>Dear ${name},</p>
        <p>
          We've received your message and appreciate you contacting JELLOF.
          Our team will review your inquiry and get back to you within 24 hours.
        </p>
        <p>
          In the meantime, feel free to explore our collections and learn more
          about our sustainable fashion practices.
        </p>
        <p style="margin-top: 30px;">
          Best regards,<br><strong>The JELLOF Team</strong>
        </p>
        <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
        <div style="text-align: center; color: #666;">
          <p style="font-size: 14px; margin: 10px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}"
               style="color: #2d5016; text-decoration: none;">Visit our website</a>
            |
            <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/collections"
               style="color: #2d5016; text-decoration: none;">Shop Collections</a>
          </p>
          <p style="font-size: 12px; color: #999;">
            © 2026 JELLOF. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Send newsletter welcome email
exports.sendNewsletterWelcome = async ({ email }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to JELLOF Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #2d5016;">Welcome to the JELLOF Community!</h2>
        <p>
          Thank you for subscribing to our newsletter.
          You're now part of our exclusive community!
        </p>
        <div style="background: #f9fdf7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d5016; margin-top: 0;">What to expect:</h3>
          <ul style="color: #333;">
            <li>Exclusive early access to new collections</li>
            <li>Special subscriber-only discounts</li>
            <li>Style tips and fashion inspiration</li>
            <li>Sustainability updates and initiatives</li>
          </ul>
        </div>
        <p>Stay tuned for our latest updates!</p>
        <p style="margin-top: 30px;">
          Best regards,<br><strong>The JELLOF Team</strong>
        </p>
        <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          You're receiving this email because you subscribed to the JELLOF newsletter.<br>
          <a href="#" style="color: #2d5016;">Unsubscribe</a>
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
