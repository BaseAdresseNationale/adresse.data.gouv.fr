const nodemailer = require('nodemailer')
const {pick} = require('lodash')

function createTransport() {
  if (!process.env.SMTP_HOST && process.env.NODE_ENV === 'production') {
    throw new Error('SMTP_HOST must be provided in production mode')
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'YES',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  })
}

const transport = createTransport()

async function sendMail(email, recipients = []) {
  if (recipients.length === 0) {
    throw new Error('At least one recipient must be provided')
  }

  const info = await transport.sendMail({
    ...pick(email, 'text', 'html', 'subject'),
    from: process.env.SMTP_FROM,
    to: recipients,
    bcc: process.env.SMTP_BCC ? process.env.SMTP_BCC.split(',') : undefined
  })

  if (process.env.SHOW_EMAILS === 'YES' && transport.transporter.options.streamTransport) {
    console.log('-----------------------')
    console.log(info.message.toString())
    console.log('-----------------------')
  }

  return info
}

module.exports = {sendMail, createTransport, transport}
