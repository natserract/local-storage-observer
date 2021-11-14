import { BehaviorSubject, EMPTY, isEmpty, Observable, tap } from 'rxjs'
import { decryptData, encryptData } from './utils/encrypt'
import { deserialize, serialize } from './utils/serialize'

const defaultConfig = {
  description: '',
  storeName: 'localstorage_observer',
  version: 1.0,
}

type Options = Partial<typeof defaultConfig>

class LocalStorageObserver {
  // Providers
  private _config: Record<string, typeof defaultConfig> = { defaultConfig }
  private _cache: Record<string, BehaviorSubject<any>>

  constructor(options?: Options) {
    // Create initial value for _cache
    this._cache = Object.create(null)
  }

  // Set any config values for localStorageObserver; can be called anytime before
  // the first API call (e.g. `getItem`, `setItem`).
  config(options: Options | any) {
    if (typeof options === 'object') {
      for (const [key] of Object.entries(options)) {
        if (key === 'storeName') {
          options[key] = options[key].replace(/\W/g, '_')
        }

        this._config[key] = options[key]
      }
    }
  }

  /**
   * Get and listen any change of storage value.
   * If key not found will be return null
   *
   * This is like `window.addEventListener('storage', ...);`
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
   *
   * Example:
   * ```ts
   * setTimeout(() => {
   *   localStorageObserver.set$(key, value, true)
   * }, 3000)
   *
   * localStorageObserver.get$(key, true).subscribe(..)
   * ```
   *
   * @returns Observable<T>
   */
  get$<T>(key: string, encrypted = false): Observable<T> {
    try {
      const state = localStorage.getItem(key)

      // If _cache null, set new value from storage
      if (!this._cache[key]) {
        return (this._cache[key] = new BehaviorSubject(
          state ? (encrypted ? state : deserialize(decryptData(state))) : null
        ))
      } else {
        this._cache[key].next(state)

        return this._cache[key].pipe(
          tap((next) => {
            if (!encrypted) {
              return decryptData(next)
            }
            return next
          })
        )
      }
    } catch (error) {
      return this.throwError(key, error)
    }
  }

  /**
   * Set any storage value.
   * You can encrypt your values for safe
   *
   * Example:
   * localStorageObserver.set$(key, value, true)
   *
   * @returns Observable<T>
   */
  set$<T>(key: string, value: T, encrypted = false): Observable<T> {
    try {
      let serializeState = value
        ? serialize(value)
        : ((value as unknown) as null)

      // Set value on localstorage
      if (encrypted) {
        serializeState = serializeState
          ? encryptData(serializeState)
          : serializeState
      }

      if (!this._cache[key]) {
        // Create initial values for the first time,
        // We've to keep making it inside like this (local scope),
        // Because if observer completed, localStorage.setItem() still applied
        localStorage.setItem(
          key,
          encrypted ? serializeState : decryptData(serializeState)
        )

        return (this._cache[key] = new BehaviorSubject(
          serializeState
            ? encrypted
              ? deserialize(serializeState)
              : decryptData(serializeState)
            : null
        ))
      } else {
        // Next values after this._cache added
        // Check if next observer values is empty
        this.isStopped$(key).subscribe((isStopped) => {
          if (!isStopped) {
            localStorage.setItem(
              key,
              encrypted ? serializeState : decryptData(serializeState)
            )
          }
        })

        this._cache[key].next(serializeState)

        return this._cache[key]
      }
    } catch (error) {
      return this.throwError(key, error)
    }
  }

  /**
   * Destroy / unsubscribe all subscriptions
   * It's used for cleanup
   *
   * Example:
   * ```ts
   * return () => {
   *    localStorageObserver.destroySubscription$()
   * }
   * ```
   */
  destroySubscription$() {
    for (const [key] of Object.entries(this._cache)) {
      this._cache[key].next(EMPTY)
      this._cache[key].complete()
    }
  }

  private isStopped$(key: string): Observable<boolean> {
    return isEmpty()(this._cache[key])
  }

  private throwError(key: string, error: any) {
    this._cache[key].next(EMPTY)
    this._cache[key].complete()

    return this._cache[key]
  }
}

export default new LocalStorageObserver()
