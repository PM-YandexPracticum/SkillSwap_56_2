import type { AuthUser, StoredUser } from '@/shared/types'
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

/** Читает список зарегистрированных пользователей */
export function getRegisteredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)

    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

/** Сохраняет нового зарегистрированного пользователя */
export function saveRegisteredUser(user: StoredUser): void {
  const users = getRegisteredUsers()

  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify([...users, user]))
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

/** Авторизует пользователя по email и паролю */
export function loginUser(email: string, password: string): AuthUser | null {
  const users = getRegisteredUsers()

  const user = users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
  )

  if (!user) {
    return null
  }

  const { password: storedPassword, ...authUser } = user

  void storedPassword

  return saveAuthUser(authUser)
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
