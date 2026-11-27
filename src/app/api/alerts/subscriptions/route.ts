import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/utils/env'
import { getCurrentAgent } from '@/lib/identity'
import { banAgentHeaders } from '@/lib/ban-session'
import { rejectCrossSiteRequest } from '@/lib/request-guard'
import { encodePathSegment } from '@/utils/url'
import { isUUIDv4 } from '@/utils/validate'

interface CreateSubscriptionBody {
  userID: string
  subscriptionName?: string
  webhookURL: string
  statusesToFollow: string[]
  districtsToFollow: string[]
  allDistricts: boolean
}

interface PatchSubscriptionBody {
  id: string
  active?: boolean
  subscriptionName?: string
  statusesToFollow?: string[]
  districtsToFollow?: string[]
}

interface DeleteSubscriptionBody {
  id: string
}

export async function GET() {
  try {
    const agent = await getCurrentAgent()

    if (!agent) {
      return NextResponse.json(
        { error: 'Non autorisé - utilisateur non trouvé' },
        { status: 401 }
      )
    }

    const response = await fetch(`${env('NEXT_PUBLIC_API_BAN_URL')}/api/alerts/subscribers`, {
      headers: banAgentHeaders(agent),
    })

    if (!response.ok) {
      console.error('Erreur API lors du GET:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Erreur lors du chargement des abonnements' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(normalizeAPIResponse(data))
  }
  catch (error) {
    console.error('Erreur dans GET /api/alerts/subscriptions:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const rejection = rejectCrossSiteRequest(request)
  if (rejection) return rejection

  try {
    const body: CreateSubscriptionBody = await request.json()
    const agent = await getCurrentAgent()

    if (!agent) {
      return NextResponse.json(
        { error: 'Non autorisé - utilisateur non trouvé' },
        { status: 401 }
      )
    }

    const validationError = validateSubscriptionData(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const payload = {
      subscriptionName: body.subscriptionName || null,
      webhookUrl: body.webhookURL,
      statusesToFollow: body.statusesToFollow,
      districtsToFollow: body.allDistricts ? [] : body.districtsToFollow,
    }

    const response = await fetch(`${env('NEXT_PUBLIC_API_BAN_URL')}/api/alerts/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...banAgentHeaders(agent),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API Express lors du POST:', response.status, errorText)
      return NextResponse.json(
        { error: `Erreur lors de la création: ${errorText}` },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      subscription: result,
      message: result.message || 'Abonnement créé avec succès',
    })
  }
  catch (error) {
    console.error('Erreur dans POST /api/alerts/subscriptions:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const rejection = rejectCrossSiteRequest(request)
  if (rejection) return rejection

  try {
    const body: PatchSubscriptionBody = await request.json()
    const agent = await getCurrentAgent()

    if (!agent) {
      return NextResponse.json(
        { error: 'Non autorisé - utilisateur non trouvé' },
        { status: 401 }
      )
    }

    if (typeof body.id !== 'string' || !isUUIDv4(body.id)) {
      return NextResponse.json(
        { error: 'ID de l\'abonnement invalide' },
        { status: 400 }
      )
    }

    const validationError = validatePatchData(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const updateData = buildUpdateData(body)

    const response = await fetch(`${env('NEXT_PUBLIC_API_BAN_URL')}/api/alerts/subscription/${encodePathSegment(body.id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...banAgentHeaders(agent),
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API Express lors du PATCH:', response.status, errorText)
      return NextResponse.json(
        { error: 'Erreur lors de la modification' },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      subscription: result.response || result,
      message: result.message || 'Abonnement modifié avec succès',
    })
  }
  catch (error) {
    console.error('Erreur dans PATCH /api/alerts/subscriptions:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const rejection = rejectCrossSiteRequest(request)
  if (rejection) return rejection

  try {
    const body: DeleteSubscriptionBody = await request.json()
    const agent = await getCurrentAgent()

    if (!agent) {
      return NextResponse.json(
        { error: 'Non autorisé - utilisateur non trouvé' },
        { status: 401 }
      )
    }

    if (typeof body.id !== 'string' || !isUUIDv4(body.id)) {
      return NextResponse.json(
        { error: 'ID de l\'abonnement invalide' },
        { status: 400 }
      )
    }

    const response = await fetch(`${env('NEXT_PUBLIC_API_BAN_URL')}/api/alerts/subscription/${encodePathSegment(body.id)}`, {
      method: 'DELETE',
      headers: banAgentHeaders(agent),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API Express lors du DELETE:', response.status, errorText)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Abonnement supprimé avec succès',
    })
  }
  catch (error) {
    console.error('Erreur dans DELETE /api/alerts/subscriptions:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

function normalizeAPIResponse(data: any): { subscriptions: any[], total: number } {
  if (data.response && data.response.subscriptions) {
    return {
      subscriptions: data.response.subscriptions || [],
      total: data.response.total || 0,
    }
  }

  return {
    subscriptions: data.subscriptions || [],
    total: data.total || 0,
  }
}

function buildUpdateData(body: PatchSubscriptionBody): any {
  const updateData: any = {}

  if (body.subscriptionName !== undefined) {
    updateData.subscriptionName = body.subscriptionName
  }
  if (body.active !== undefined) {
    updateData.isActive = body.active
  }
  if (body.statusesToFollow !== undefined) {
    updateData.statusesToFollow = body.statusesToFollow
  }
  if (body.districtsToFollow !== undefined) {
    updateData.districtsToFollow = body.districtsToFollow
  }

  return updateData
}

function validatePatchData(data: PatchSubscriptionBody): string | null {
  if (data.statusesToFollow && Array.isArray(data.statusesToFollow)) {
    const validStatuses = ['success', 'error', 'warning', 'info']
    const invalidStatuses = data.statusesToFollow.filter((s: string) => !validStatuses.includes(s))
    if (invalidStatuses.length > 0) {
      return `Statuts invalides: ${invalidStatuses.join(', ')}`
    }
  }

  return null
}

function validateSubscriptionData(data: CreateSubscriptionBody): string | null {
  if (!data.webhookURL) {
    return 'URL du webhook requise'
  }

  try {
    const url = new URL(data.webhookURL)
    if (url.protocol !== 'https:') {
      return 'URL du webhook doit être en HTTPS'
    }
  }
  catch {
    return 'URL du webhook invalide'
  }

  if (!data.statusesToFollow || data.statusesToFollow.length === 0) {
    return 'Au moins un type de statut requis'
  }

  const validStatuses = ['success', 'error', 'warning', 'info']
  const invalidStatuses = data.statusesToFollow.filter(s => !validStatuses.includes(s))
  if (invalidStatuses.length > 0) {
    return `Statuts invalides: ${invalidStatuses.join(', ')}`
  }

  if (!data.allDistricts && (!data.districtsToFollow || data.districtsToFollow.length === 0)) {
    return 'Au moins une commune requise ou cocher "Toutes les communes"'
  }

  return null
}