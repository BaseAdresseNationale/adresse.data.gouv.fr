class Cache {
  constructor(public internalCache: Map<string, { value: any, expiresAt?: number }> = new Map()) {}

  has(key: string) {
    if (this.internalCache.has(key)) {
      const now = Date.now()
      const cacheEntry = this.internalCache.get(key) as { value: any, expiresAt?: number }
      if (cacheEntry.expiresAt) {
        return now < cacheEntry.expiresAt
      }
      else {
        return true
      }
    }

    return false
  }

  get(key: string) {
    if (this.has(key)) {
      const cacheEntry = this.internalCache.get(key)

      if (!cacheEntry) {
        throw new Error('Unexpected behavior: cache entry not available anymore')
      }

      return cacheEntry.value
    }
  }

  set(key: string, value: any, ttl?: number) {
    const expiresAt = ttl && (Date.now() + (ttl * 1000))
    return this.internalCache.set(key, { value, expiresAt })
  }
}

const globalCache = new Cache()

export async function getCachedData(key: string, resolver: () => Promise<any>, ttl?: number) {
  if (!globalCache.has(key)) {
    const value = await resolver()
    globalCache.set(key, value, ttl)
    return value
  }

  return globalCache.get(key)
}
