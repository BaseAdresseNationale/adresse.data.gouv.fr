import { useState, useEffect, useCallback } from 'react'
import { customFetch } from '@/lib/fetch'

interface UserInfo {
  sub: string
  email?: string
  given_name?: string
  usual_name?: string
  siret?: string
  organization?: {
    name?: string
    id?: string
  }
  nom_structure?: string
  [key: string]: any
}

interface UseAuthReturn {
  authenticated: boolean
  userInfo: UserInfo | null
  loading: boolean
  checkAuthentication: () => Promise<void>
}

export const useAuth = (): UseAuthReturn => {
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (typeof document !== 'undefined' && document.cookie.includes('ban_connected=true')) {
      setAuthenticated(true)
    }
  }, [])

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

  const checkAuthentication = useCallback(async () => {
    try {
      setLoading(true)
      const response = await customFetch('/api/me')
      const user = parseResponse(response)
      setUserInfo(user)
      setAuthenticated(true)
    }
    catch (error: any) {
      if (error?.status === 401) {
        setAuthenticated(false)
        setUserInfo(null)
      }
    }
    finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  return {
    authenticated,
    userInfo,
    loading,
    checkAuthentication,
  }
}
