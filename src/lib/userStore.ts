export interface UserSession {
  id: number
  username: string
  balance: number
}

const KEY = "fi_user"

export function saveUser(user: UserSession) {
  localStorage.setItem(KEY, JSON.stringify(user))
}

export function loadUser(): UserSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearUser() {
  localStorage.removeItem(KEY)
}
