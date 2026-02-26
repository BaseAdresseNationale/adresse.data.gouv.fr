import { useCallback, useState, useEffect } from 'react'
import { customFetch } from '@/lib/fetch'
import { NotificationSubscription, FormData, UseSubscriptionsReturn } from './types'

export const useSubscriptions = (): UseSubscriptionsReturn => {
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [editingSubscription, setEditingSubscription] = useState<NotificationSubscription | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const parseResponse = (response: any) => {
    if (typeof response === 'string') {
      return JSON.parse(response)
    }
    else if (typeof response === 'object' && response !== null) {
      return response
    }
    else {
      throw new Error('Format de réponse invalide')
    }
  }

  const extractErrorMessage = (error: any, defaultMessage: string): string => {
    try {
      if (typeof error.message === 'string') {
        const errorData = JSON.parse(error.message)
        if (errorData.error) {
          return errorData.error
        }
      }
    }
    catch {
    }

    return error.message || defaultMessage
  }

  const validateCommunes = (communesString: string): string[] => {
    if (!communesString.trim()) return []

    return communesString
      .split(',')
      .map(code => code.trim())
      .filter((code) => {
        if (!/^\d{5}$/.test(code)) {
          console.warn(`Code commune invalide ignoré: ${code}`)
          return false
        }
        return true
      })
  }

  const loadSubscriptions = useCallback(async () => {
    try {
      const response = await customFetch('/api/alerts/subscriptions')
      const data = parseResponse(response)

      const subs = data.subscriptions || []
      setSubscriptions(subs)
    }
    catch (error) {
      console.error('Erreur lors du chargement des abonnements:', error)
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des abonnements',
      })
    }
  }, [])

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await customFetch('/api/me')
      const user = parseResponse(response)
      setUserInfo(user)
      setAuthenticated(true)

      await loadSubscriptions()
    }
    catch (error: any) {
      if (error?.status === 401) {
        setAuthenticated(false)
        setUserInfo(null)
      }
    }
    finally {
      setAuthLoading(false)
    }
  }, [loadSubscriptions])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  const startEditSubscription = (subscription: NotificationSubscription) => {
    setEditingSubscription(subscription)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setEditingSubscription(null)
    setIsEditing(false)
  }

  const createSubscription = useCallback(async (formData: FormData) => {
    setLoading(true)
    setMessage(null)

    try {
      const payload = {
        userID: userInfo.sub,
        subscriptionName: formData.subscriptionName.trim() || undefined,
        webhookURL: formData.webhookURL,
        statusesToFollow: formData.statusesToFollow,
        districtsToFollow: formData.allDistricts ? [] : validateCommunes(formData.districtsToFollow),
        allDistricts: formData.allDistricts,
      }

      const response = await customFetch('/api/alerts/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = parseResponse(response)
      setMessage({
        type: 'success',
        text: data.message || 'Abonnement créé avec succès !',
      })

      await loadSubscriptions()
    }
    catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erreur lors de la création de l\'abonnement')
      setMessage({ type: 'error', text: errorMessage })
      throw new Error(errorMessage)
    }
    finally {
      setLoading(false)
    }
  }, [userInfo, loadSubscriptions])

  const updateSubscription = useCallback(async (formData: FormData) => {
    if (!editingSubscription) return

    setLoading(true)
    setMessage(null)

    try {
      const updateData = {
        id: editingSubscription.id,
        subscriptionName: formData.subscriptionName.trim() || null,
        statusesToFollow: formData.statusesToFollow,
        districtsToFollow: formData.allDistricts ? [] : validateCommunes(formData.districtsToFollow),
      }

      const response = await customFetch('/api/alerts/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = parseResponse(response)

      setSubscriptions(prev =>
        prev.map(sub => sub.id === editingSubscription.id
          ? {
              ...sub,
              subscriptionName: updateData.subscriptionName || undefined,
              statusesToFollow: updateData.statusesToFollow,
              districtsToFollow: updateData.districtsToFollow,
              allDistricts: formData.allDistricts,
            }
          : sub
        )
      )

      setMessage({
        type: 'success',
        text: data.message || 'Abonnement modifié avec succès',
      })

      cancelEdit()
    }
    catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erreur lors de la modification')
      setMessage({ type: 'error', text: errorMessage })
      throw new Error(errorMessage)
    }
    finally {
      setLoading(false)
    }
  }, [editingSubscription])

  const toggleSubscription = useCallback(async (id: string, active: boolean) => {
    setActionLoading(id)
    try {
      const response = await customFetch('/api/alerts/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active }),
      })

      const data = parseResponse(response)

      setSubscriptions(prev =>
        prev.map(sub => sub.id === id ? { ...sub, isActive: active } : sub)
      )

      setMessage({
        type: 'success',
        text: data.message || `Abonnement ${active ? 'activé' : 'désactivé'} avec succès`,
      })
    }
    catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erreur lors de la modification')
      setMessage({ type: 'error', text: errorMessage })
    }
    finally {
      setActionLoading(null)
    }
  }, [])

  const deleteSubscription = useCallback(async (id: string) => {
    setActionLoading(id)
    try {
      const response = await customFetch('/api/alerts/subscriptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      const data = parseResponse(response)

      setSubscriptions(prev => prev.filter(sub => sub.id !== id))
      setMessage({
        type: 'success',
        text: data.message || 'Abonnement supprimé avec succès',
      })
    }
    catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Erreur lors de la suppression')
      setMessage({ type: 'error', text: errorMessage })
    }
    finally {
      setActionLoading(null)
    }
  }, [])

  return {
    authLoading,
    authenticated,
    userInfo,
    subscriptions,
    loading,
    actionLoading,
    message,
    editingSubscription,
    isEditing,
    setMessage,
    startEditSubscription,
    cancelEdit,
    createSubscription,
    updateSubscription,
    toggleSubscription,
    deleteSubscription,
  }
}
