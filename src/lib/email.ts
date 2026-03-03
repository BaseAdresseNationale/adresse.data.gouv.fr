import nodemailer from 'nodemailer'

interface ContactFormData {
  prenom: string
  nom: string
  email: string
  sujet: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '25'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
    tls: {
      rejectUnauthorized: false,
    },
  })

  const subjectPrefix
    = data.sujet === 'Questions sur la BAN'
      ? '[BAN]'
      : data.sujet === 'Questions sur la BAL'
        ? '[BAL]'
        : '[Autre]'

  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@adresse.data.gouv.fr',
    to: process.env.SMTP_TO || 'contact@adresse.data.gouv.fr',
    replyTo: data.email,
    subject: `${subjectPrefix} Contact depuis adresse.data.gouv.fr`,
    text: generateTextEmail(data, subjectPrefix),
    html: generateHtmlEmail(data, subjectPrefix),
  }

  await transporter.sendMail(mailOptions)
}

function generateTextEmail(data: ContactFormData, prefix: string): string {
  return `
${prefix} Nouveau message de contact

Prénom : ${data.prenom}
Nom : ${data.nom}
E-mail : ${data.email}
Sujet : ${data.sujet}

Message :
${data.message}

---
Message envoyé depuis adresse.data.gouv.fr le ${new Date().toLocaleString('fr-FR')}
  `.trim()
}

function generateHtmlEmail(data: ContactFormData, prefix: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prefix} Contact</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f6f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f6f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #000091; padding: 20px; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">${prefix} Nouveau message de contact</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px; background-color: #f6f6f6; border-radius: 4px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                      <strong style="color: #000091;">Prénom :</strong> ${escapeHtml(data.prenom)}
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                      <strong style="color: #000091;">Nom :</strong> ${escapeHtml(data.nom)}
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                      <strong style="color: #000091;">E-mail :</strong> 
                      <a href="mailto:${escapeHtml(data.email)}" style="color: #000091; text-decoration: none;">${escapeHtml(data.email)}</a>
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #666;">
                      <strong style="color: #000091;">Sujet :</strong> ${escapeHtml(data.sujet)}
                    </p>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 20px;">
                <h2 style="color: #000091; font-size: 18px; font-weight: 700; margin: 0 0 15px 0;">Message :</h2>
                <div style="padding: 15px; background-color: #f6f6f6; border-left: 4px solid #000091; border-radius: 4px;">
                  <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #333;">${escapeHtml(data.message)}</p>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background-color: #f6f6f6; text-align: center; border-top: 1px solid #ddd;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                Message envoyé depuis <strong>adresse.data.gouv.fr</strong><br>
                le ${new Date().toLocaleString('fr-FR', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;',
  }
  return text.replace(/[&<>"']/g, char => map[char])
}
