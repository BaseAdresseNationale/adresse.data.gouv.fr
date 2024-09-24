class Cache {
  constructor(public internalCache: Map<string, { value: any, expiresAt?: number, resolver: () => Promise<any> }> = new Map()) {
    // Refresh cache every 3 hours
    setInterval(() => this.updateCache(), 3 * 3600000)
  }

  async updateCache() {
    console.log('Updating cache...')
    const now = Date.now()
    for (const [key, cacheEntry] of this.internalCache) {
      // If the cache entry has an expiration date and it's passed, we delete it
      if (cacheEntry.expiresAt && now > cacheEntry.expiresAt) {
        console.log(`Deleting cache ${key}`)
        this.internalCache.delete(key)
      }
      // If the cache entry has no expiration date, we update it
      else if (!cacheEntry.expiresAt) {
        try {
          console.log(`Updating cache ${key}`)
          const updatedValue = await cacheEntry.resolver()
          this.internalCache.set(key, { value: updatedValue, resolver: cacheEntry.resolver })
        }
        catch (e) {
          console.error(`Error while updating cache ${key}`, e)
        }
      }
    }
    console.log('Cache updated')
  }

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

  set(key: string, value: any, resolver: () => Promise<any>, ttl?: number) {
    const expiresAt = ttl && (Date.now() + (ttl * 1000))
    return this.internalCache.set(key, { value, expiresAt, resolver })
  }
}

const globalCache = new Cache()

export async function getCachedData(key: string, resolver: () => Promise<any>, ttl?: number) {
  if (!globalCache.has(key)) {
    const promizedValue = resolver()
    globalCache.set(key, promizedValue.then((value) => {
      globalCache.set(key, value, resolver, ttl)
      return value
    }), resolver, ttl)

    return promizedValue
  }

  return globalCache.get(key)
}
