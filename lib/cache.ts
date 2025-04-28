type CacheItem<T> = {
  value: T
  expiry: number
}

class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) return null

    // Check if the item has expired
    if (item.expiry < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  set<T>(key: string, value: T, ttlSeconds = 60): void {
    const expiry = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { value, expiry })
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

// Create a singleton instance
export const memoryCache = new MemoryCache()

// Helper function to cache the result of an async function
export async function cachedFetch<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds = 60): Promise<T> {
  // Try to get from cache first
  const cached = memoryCache.get<T>(key)
  if (cached) return cached

  // If not in cache, fetch and cache the result
  const result = await fetchFn()
  memoryCache.set(key, result, ttlSeconds)
  return result
}
