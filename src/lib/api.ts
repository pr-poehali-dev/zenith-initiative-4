const URLS = {
  auth: "https://functions.poehali.dev/51996d77-edb6-45be-b004-1d6e78071649",
  games: "https://functions.poehali.dev/81eda09b-65b6-4baf-9b91-be6b74f99bd2",
  wallet: "https://functions.poehali.dev/1fc3700a-c772-48ea-a127-dc8683cc390d",
}

export async function apiAuth(action: "login" | "register", username: string, password: string) {
  const res = await fetch(URLS.auth, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, username, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error")
  return data as { id: number; username: string; balance: number }
}

export async function apiGetGames() {
  const res = await fetch(URLS.games)
  const data = await res.json()
  return data.games as { id: number; title: string; genre: string; price: number; steam_id: string }[]
}

export async function apiBuyGame(user_id: number, game_id: number) {
  const res = await fetch(URLS.games, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, game_id }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error")
  return data as { success: boolean; new_balance: number }
}

export async function apiGetWallet(user_id: number) {
  const res = await fetch(`${URLS.wallet}?user_id=${user_id}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error")
  return data as {
    balance: number
    purchases: { id: number; title: string; price: number; date: string }[]
    withdrawals: { id: number; amount: number; commission: number; received: number; method: string; status: string; date: string }[]
  }
}

export async function apiWithdraw(user_id: number, amount: number, method: string) {
  const res = await fetch(URLS.wallet, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, amount, method }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error")
  return data as { success: boolean; commission: number; received: number; new_balance: number }
}
