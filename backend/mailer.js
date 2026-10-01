const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Custom SMTP / Gmail
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  } else {
    // Fallback console-logger & Ethereal test transporter
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'wayflow.demo@ethereal.email',
        pass: 'demo_password',
      },
    })
  }

  return transporter
}

async function sendWelcomeEmail({ toEmail, fullName, role, facility, tempPassword }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"WayFlow Operations" <no-reply@wayflow.internal>',
    to: toEmail,
    subject: `Welcome to WayFlow - Your Account Credentials (${role})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0284c7; margin: 0; font-size: 24px;">WayFlow Delivery Intelligence</h1>
          <p style="color: #64748b; margin-top: 4px; font-size: 14px;">Next-generation fleet and delivery management</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0284c7;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Welcome, ${fullName}!</h2>
          <p style="color: #334155; line-height: 1.6; margin-bottom: 0;">
            An operational account has been provisioned for you on the WayFlow Console with the role <strong>${role}</strong> assigned to <strong>${facility}</strong>.
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 15px;">Your Temporary Login Credentials</h3>
          <p style="margin: 6px 0; color: #475569; font-size: 14px;"><strong>Email / Corporate ID:</strong> <span style="font-family: monospace; color: #0f172a;">${toEmail}</span></p>
          <p style="margin: 6px 0; color: #475569; font-size: 14px;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 4px;">${tempPassword}</span></p>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
          <p style="color: #92400e; margin: 0; font-size: 13px;">
            ⚠️ <strong>Action Required:</strong> For security protocols, you will be required to create a new personal password immediately upon your first sign in.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="http://localhost:5173/login" style="background: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
            Sign in to WayFlow Console &rarr;
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          WayFlow Operations Center • Peliyagoda DC • Automated Notification
        </p>
      </div>
    `,
  }

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const info = await getTransporter().sendMail(mailOptions)
      console.log(`📧 Real email sent to ${toEmail}: ${info.messageId}`)
      return { success: true, messageId: info.messageId, mode: 'smtp' }
    } else {
      // Dev / Demo Mode: Log credentials clearly in terminal
      console.log('\n============================================================')
      console.log('📧 [SIMULATED EMAIL DISPATCH] (Configure EMAIL_USER in .env for real SMTP)')
      console.log(`To: ${toEmail}`)
      console.log(`Subject: ${mailOptions.subject}`)
      console.log(`User: ${fullName} (${role})`)
      console.log(`Facility: ${facility}`)
      console.log(`Temporary Password: ${tempPassword}`)
      console.log('============================================================\n')
      return { success: true, mode: 'simulated', tempPassword }
    }
  } catch (error) {
    console.error('Failed to send email:', error.message)
    // Even if external SMTP fails, do not block user creation
    return { success: false, error: error.message, tempPassword }
  }
}

module.exports = {
  sendWelcomeEmail,
}
