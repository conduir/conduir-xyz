import type { PredictionCacheEntry, PredictionResponse } from '../types/yield.js';

class PredictionCache {
  private cache = new Map<string, PredictionCacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Generate a cache key from vault IDs and time horizon
   */
  private generateKey(vaultIds: string[], timeHorizon: string = 'all'): string {
    return `${vaultIds.sort().join('-')}:${timeHorizon}`;
  }

  /**
   * Get a cached prediction
   */
  get(vaultIds: string[], timeHorizon: string = 'all'): PredictionResponse | null {
    const key = this.generateKey(vaultIds, timeHorizon);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a cached prediction
   */
  set(vaultIds: string[], data: PredictionResponse, timeHorizon: string = 'all', ttl?: number): void {
    const key = this.generateKey(vaultIds, timeHorizon);
    const entry: PredictionCacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    };
    this.cache.set(key, entry);
  }

  /**
   * Invalidate cache for specific vaults
   */
  invalidate(vaultIds: string[]): void {
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (vaultIds.some(id => key.includes(id))) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Export singleton instance
export const predictionCache = new PredictionCache();

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => predictionCache.cleanup(), 10 * 60 * 1000);
}
