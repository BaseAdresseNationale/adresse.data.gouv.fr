import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

interface ContactFormData {
  prenom: string
  nom: string
  email: string
  sujet: string
  message: string
}

function validateContactForm(data: any): { isValid: boolean, errors: string[] } {
  const errors: string[] = []

  if (!data.prenom?.trim() || data.prenom.trim().length < 2) {
    errors.push('Le prénom est requis (minimum 2 caractères)')
  }

  if (!data.nom?.trim() || data.nom.trim().length < 2) {
    errors.push('Le nom est requis (minimum 2 caractères)')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Une adresse e-mail valide est requise')
  }

  const validSubjects = ['Questions sur la BAN', 'Questions sur la BAL', 'Autre']
  if (!data.sujet || !validSubjects.includes(data.sujet)) {
    errors.push('Le sujet est invalide')
  }

  if (!data.message?.trim() || data.message.trim().length < 10) {
    errors.push('Le message est requis (minimum 10 caractères)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    const validation = validateContactForm(data)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      )
    }

    if (!process.env.SMTP_HOST) {
      console.error('Configuration SMTP manquante : SMTP_HOST non défini')
      return NextResponse.json(
        { error: 'Le service d\'envoi de messages est temporairement indisponible' },
        { status: 503 }
      )
    }

    await sendContactEmail(data)

    return NextResponse.json(
      { message: 'Message envoyé avec succès' },
      { status: 200 }
    )
  }
  catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    return NextResponse.json(
      { error: 'Message non envoyé' },
      { status: 500 }
    )
  }
}
