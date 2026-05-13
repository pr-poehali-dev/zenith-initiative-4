import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { loadUser, clearUser, saveUser, UserSession } from "@/lib/userStore"
import { apiGetWallet, apiWithdraw } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { useToast } from "@/hooks/use-toast"

const WITHDRAW_METHODS = ["СБП", "Сбер", "TON", "USDT"]

const TOPUP_METHODS = [
  { id: "sbp", label: "СБП", icon: "Zap", desc: "Перевод по номеру телефона", color: "text-green-400" },
  { id: "ton", label: "TON", icon: "Diamond", desc: "Криптовалюта TON / USDT", color: "text-blue-400" },
]

const TOPUP_AMOUNTS = [50, 100, 200, 500, 1000]

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState<UserSession | null>(null)
  const [balance, setBalance] = useState(0)
  const [purchases, setPurchases] = useState<{ id: number; title: string; price: number; date: string }[]>([])
  const [withdrawals, setWithdrawals] = useState<{ id: number; amount: number; commission: number; received: number; method: string; status: string; date: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"purchases" | "withdrawals">("purchases")

  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("СБП")
  const [withdrawing, setWithdrawing] = useState(false)

  const [topupOpen, setTopupOpen] = useState(false)
  const [topupMethod, setTopupMethod] = useState("sbp")
  const [topupAmount, setTopupAmount] = useState("100")

  useEffect(() => {
    const u = loadUser()
    if (!u) { navigate("/login"); return }
    setUser(u)
    fetchWallet(u.id)
  }, [])

  async function fetchWallet(userId: number) {
    setLoading(true)
    try {
      const data = await apiGetWallet(userId)
      setBalance(data.balance)
      setPurchases(data.purchases)
      setWithdrawals(data.withdrawals)
      const u = loadUser()
      if (u) { saveUser({ ...u, balance: data.balance }) }
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdraw() {
    if (!user) return
    const amt = parseFloat(withdrawAmount)
    if (!amt || amt < 50) {
      toast({ title: "Минимальная сумма — 50₽", variant: "destructive" })
      return
    }
    setWithdrawing(true)
    try {
      const res = await apiWithdraw(user.id, amt, withdrawMethod)
      setBalance(res.new_balance)
      saveUser({ ...user, balance: res.new_balance })
      toast({ title: `Заявка создана! Получите: ${res.received}₽ (комиссия ${res.commission}₽)` })
      setWithdrawAmount("")
      fetchWallet(user.id)
    } catch (e: unknown) {
      toast({ title: e instanceof Error ? e.message : "Ошибка", variant: "destructive" })
    } finally {
      setWithdrawing(false)
    }
  }

  function logout() {
    clearUser()
    navigate("/login")
  }

  const commission = parseFloat(withdrawAmount) ? Math.round(parseFloat(withdrawAmount) * 0.03 * 100) / 100 : 0
  const received = parseFloat(withdrawAmount) ? Math.round((parseFloat(withdrawAmount) - commission) * 100) / 100 : 0

  const SBP_PHONE = "+7 (999) 000-00-00"
  const SBP_BANK = "Сбербанк"
  const TON_WALLET = "UQD...your_ton_wallet"

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={18} />
          </button>
          <span className="font-semibold text-white">Fast Issuance™</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">@{user?.username}</span>
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-white">
            <Icon name="LogOut" size={15} />
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Balance Card */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-900/10 border border-violet-500/30 p-6">
          <p className="text-sm text-gray-400 mb-1">Ваш баланс</p>
          <p className="text-5xl font-bold text-white mb-4">
            {loading ? "..." : `${balance.toFixed(2)}₽`}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/store")}
              className="flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 text-sm font-medium text-white"
            >
              <Icon name="ShoppingCart" size={14} /> Магазин игр
            </button>
            <button
              onClick={() => setTopupOpen(true)}
              className="flex items-center gap-2 rounded-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 transition-colors px-4 py-2 text-sm font-medium text-green-300"
            >
              <Icon name="Plus" size={14} /> Пополнить
            </button>
            <button
              onClick={() => setTab("withdrawals")}
              className="flex items-center gap-2 rounded-full bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors px-4 py-2 text-sm font-medium text-gray-300"
            >
              <Icon name="ArrowDownToLine" size={14} /> Вывод
            </button>
          </div>
        </div>

        {/* Топап модал */}
        {topupOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setTopupOpen(false)}>
            <div className="w-full max-w-sm rounded-2xl bg-[#141414] border border-[#262626] p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Icon name="Plus" size={16} className="text-green-400" /> Пополнение баланса
                </h3>
                <button onClick={() => setTopupOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <Icon name="X" size={18} />
                </button>
              </div>

              {/* Способ */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {TOPUP_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTopupMethod(m.id)}
                    className={`rounded-xl p-3 text-left border transition-colors ${topupMethod === m.id ? "bg-violet-600/20 border-violet-500" : "bg-[#0f0f0f] border-[#262626] hover:border-gray-500"}`}
                  >
                    <Icon name={m.icon} size={18} className={`${m.color} mb-1`} />
                    <p className="text-sm font-semibold text-white">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </button>
                ))}
              </div>

              {/* Сумма */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 mb-2 block">Сумма пополнения (₽)</label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {TOPUP_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setTopupAmount(String(a))}
                      className={`rounded-lg py-1.5 text-xs font-medium transition-colors border ${topupAmount === String(a) ? "bg-violet-600/20 border-violet-500 text-violet-300" : "bg-[#0f0f0f] border-[#262626] text-gray-400 hover:border-gray-500"}`}
                    >
                      {a}₽
                    </button>
                  ))}
                </div>
                <div className="flex items-center rounded-lg bg-[#0f0f0f] border border-[#262626] px-3 py-2.5">
                  <span className="text-gray-500 mr-2 text-sm">₽</span>
                  <input
                    type="number"
                    min="10"
                    placeholder="Своя сумма"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Реквизиты */}
              <div className="rounded-xl bg-[#0f0f0f] border border-[#262626] p-4 mb-4">
                {topupMethod === "sbp" ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 mb-2">Переведите <span className="text-white font-semibold">{topupAmount || "..."}₽</span> по СБП:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Номер телефона</span>
                      <span className="text-sm font-mono font-medium text-white">{SBP_PHONE}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Банк</span>
                      <span className="text-sm font-medium text-white">{SBP_BANK}</span>
                    </div>
                    <p className="text-xs text-amber-400 mt-2 flex items-start gap-1">
                      <Icon name="AlertCircle" size={12} className="mt-0.5 shrink-0" />
                      В комментарии укажите ваш логин: <strong className="ml-1">@{user?.username}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 mb-2">Отправьте <span className="text-white font-semibold">{topupAmount || "..."}₽</span> в TON:</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500 shrink-0">Кошелёк</span>
                      <span className="text-xs font-mono text-blue-300 break-all">{TON_WALLET}</span>
                    </div>
                    <p className="text-xs text-amber-400 mt-2 flex items-start gap-1">
                      <Icon name="AlertCircle" size={12} className="mt-0.5 shrink-0" />
                      В комментарии укажите ваш логин: <strong className="ml-1">@{user?.username}</strong>
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center mb-3">После оплаты баланс будет пополнен вручную в течение 15 минут</p>

              <Button
                onClick={() => { setTopupOpen(false); toast({ title: "Реквизиты скопированы! Ждём ваш платёж." }) }}
                className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white"
              >
                Я оплатил(а)
              </Button>
            </div>
          </div>
        )}

        {/* Withdraw Form */}
        <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6">
          <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <Icon name="ArrowDownToLine" size={16} className="text-violet-400" />
            Вывод средств
          </h3>
          <p className="text-xs text-gray-500 mb-4">Минимум 50₽ · Комиссия 3%</p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Сумма вывода (₽)</label>
              <div className="flex items-center rounded-lg bg-[#0f0f0f] border border-[#262626] px-3 py-2.5">
                <span className="text-gray-500 mr-2 text-sm">₽</span>
                <input
                  type="number"
                  min="50"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
                />
              </div>
              {parseFloat(withdrawAmount) > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Комиссия: <span className="text-red-400">{commission}₽</span> → Получите: <span className="text-green-400">{received}₽</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Способ вывода</label>
              <div className="grid grid-cols-4 gap-2">
                {WITHDRAW_METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setWithdrawMethod(m)}
                    className={`rounded-lg py-2 text-sm font-medium transition-colors border ${
                      withdrawMethod === m
                        ? "bg-violet-600/20 border-violet-500 text-violet-300"
                        : "bg-[#0f0f0f] border-[#262626] text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={withdrawing || !withdrawAmount}
              className="w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white mt-2"
            >
              {withdrawing ? "Обработка..." : "Вывести средства"}
            </Button>
          </div>
        </div>

        {/* History Tabs */}
        <div className="rounded-2xl bg-[#141414] border border-[#262626] overflow-hidden">
          <div className="flex border-b border-[#262626]">
            <button
              onClick={() => setTab("purchases")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "purchases" ? "text-white border-b-2 border-violet-500" : "text-gray-500 hover:text-gray-300"}`}
            >
              Покупки ({purchases.length})
            </button>
            <button
              onClick={() => setTab("withdrawals")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "withdrawals" ? "text-white border-b-2 border-violet-500" : "text-gray-500 hover:text-gray-300"}`}
            >
              Выводы ({withdrawals.length})
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <p className="text-center text-gray-500 text-sm py-4">Загрузка...</p>
            ) : tab === "purchases" ? (
              purchases.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">Покупок пока нет</p>
              ) : (
                <div className="space-y-2">
                  {purchases.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-[#0f0f0f] px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <Icon name="Gamepad2" size={15} className="text-violet-400" />
                        <div>
                          <p className="text-sm text-white font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString("ru-RU")}</p>
                        </div>
                      </div>
                      <span className="text-sm text-red-400 font-medium">−{p.price}₽</span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              withdrawals.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">Выводов пока нет</p>
              ) : (
                <div className="space-y-2">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="flex items-center justify-between rounded-lg bg-[#0f0f0f] px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <Icon name="ArrowDownToLine" size={15} className="text-green-400" />
                        <div>
                          <p className="text-sm text-white font-medium">{w.method} · {w.received}₽</p>
                          <p className="text-xs text-gray-500">Комиссия {w.commission}₽ · {new Date(w.date).toLocaleDateString("ru-RU")}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${w.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-green-500/20 text-green-400"}`}>
                        {w.status === "pending" ? "В обработке" : "Выполнен"}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}