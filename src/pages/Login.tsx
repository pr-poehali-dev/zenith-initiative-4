import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiAuth } from "@/lib/api"
import { saveUser } from "@/lib/userStore"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Icon from "@/components/ui/icon"

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) return
    setLoading(true)
    try {
      const user = await apiAuth(mode, username.trim(), password)
      saveUser(user)
      navigate("/dashboard")
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Ошибка", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm">
          <Icon name="ArrowLeft" size={15} /> На главную
        </button>

        <div className="rounded-2xl bg-[#141414] border border-[#262626] p-8">
          <div className="flex items-center gap-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="#8B5CF6" />
              <rect x="13" y="3" width="8" height="8" rx="2" fill="#8B5CF6" opacity="0.6" />
              <rect x="3" y="13" width="8" height="8" rx="2" fill="#8B5CF6" opacity="0.4" />
              <rect x="13" y="13" width="8" height="8" rx="2" fill="#8B5CF6" opacity="0.2" />
            </svg>
            <span className="font-semibold text-white">Fast Issuance™</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            {mode === "login" ? "Войдите в личный кабинет" : "Создайте аккаунт — бонус 100₽"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Имя пользователя</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full rounded-lg bg-[#0f0f0f] border border-[#262626] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-[#0f0f0f] border border-[#262626] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white mt-2"
            >
              {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
