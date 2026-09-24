import type { AuthUser } from '@/shared/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const AUTH_USER_CHANGED = 'skillswap:auth-user-changed'
export function subscribeAuthUser(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCAL_STORAGE_KEYS.AUTH_USER || event.key === null) {
      onChange()
    }
  }

  window.addEventListener(AUTH_USER_CHANGED, onChange)
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener(AUTH_USER_CHANGED, onChange)
    window.removeEventListener('storage', onStorage)
  }
}

/** Читает текущего авторизованного пользователя из localStorage */
export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)

    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

/** Сохраняет пользователя и mock-токен в localStorage */
export function saveAuthUser(user: Omit<AuthUser, 'token'>): AuthUser {
  const authUser: AuthUser = {
    ...user,
    token: 'mock_token_' + user.id,
  }

  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser))
  window.dispatchEvent(new Event(AUTH_USER_CHANGED))

  return authUser
}

/** Обновляет данные текущего пользователя */
export function updateAuthUser(data: Partial<Omit<AuthUser, 'id' | 'token'>>): AuthUser | null {
  const currentUser = getAuthUser()

  if (!currentUser) {
    return null
  }

  const updatedUser: AuthUser = {
    ...currentUser,
    ...data,
  }

  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser))
  window.dispatchEvent(new Event(AUTH_USER_CHANGED))

  return updatedUser
}

/** Удаляет пользователя из localStorage (logout) */
export function clearAuthUser(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER)
  window.dispatchEvent(new Event(AUTH_USER_CHANGED))
}
