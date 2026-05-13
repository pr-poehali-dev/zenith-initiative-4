import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiGetGames, apiBuyGame } from "@/lib/api"
import { loadUser, saveUser, UserSession } from "@/lib/userStore"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { useToast } from "@/hooks/use-toast"

const GENRE_COLORS: Record<string, string> = {
  "Шутер": "bg-red-500/20 text-red-400",
  "RPG": "bg-violet-500/20 text-violet-400",
  "MOBA": "bg-blue-500/20 text-blue-400",
  "Инди": "bg-green-500/20 text-green-400",
  "Выживание": "bg-amber-500/20 text-amber-400",
  "Симулятор": "bg-teal-500/20 text-teal-400",
  "Вечеринка": "bg-pink-500/20 text-pink-400",
  "Хоррор": "bg-orange-500/20 text-orange-400",
  "Рогалик": "bg-cyan-500/20 text-cyan-400",
  "Платформер": "bg-lime-500/20 text-lime-400",
  "Приключения": "bg-emerald-500/20 text-emerald-400",
  "Экшен": "bg-rose-500/20 text-rose-400",
  "Головоломка": "bg-indigo-500/20 text-indigo-400",
  "Песочница": "bg-yellow-500/20 text-yellow-400",
}

type Game = { id: number; title: string; genre: string; price: number; steam_id: string }

export default function Store() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState<UserSession | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState<number | null>(null)
  const [purchased, setPurchased] = useState<Set<number>>(new Set())
  const [search, setSearch] = useState("")
  const [filterGenre, setFilterGenre] = useState("Все")

  useEffect(() => {
    const u = loadUser()
    setUser(u)
    apiGetGames().then(setGames).finally(() => setLoading(false))
  }, [])

  const genres = ["Все", ...Array.from(new Set(games.map((g) => g.genre)))]
  const filtered = games.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase())
    const matchGenre = filterGenre === "Все" || g.genre === filterGenre
    return matchSearch && matchGenre
  })

  async function handleBuy(game: Game) {
    if (!user) { navigate("/login"); return }
    setBuying(game.id)
    try {
      const res = await apiBuyGame(user.id, game.id)
      setPurchased((prev) => new Set([...prev, game.id]))
      const updated = { ...user, balance: res.new_balance }
      saveUser(updated)
      setUser(updated)
      toast({ title: `✓ ${game.title} куплена! Остаток: ${res.new_balance.toFixed(2)}₽` })
    } catch (e: unknown) {
      toast({ title: e instanceof Error ? e.message : "Ошибка", variant: "destructive" })
    } finally {
      setBuying(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] sticky top-0 bg-[#0a0a0a] z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={18} />
          </button>
          <span className="font-semibold text-white">Магазин игр</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full bg-[#1a1a1a] border border-[#262626] px-3 py-1.5">
                <Icon name="Wallet" size={13} className="text-violet-400" />
                <span className="text-sm font-medium text-white">{user.balance.toFixed(2)}₽</span>
              </div>
              <button onClick={() => navigate("/dashboard")} className="text-sm text-gray-400 hover:text-white transition-colors">
                Кабинет
              </button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")} size="sm" className="rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs">
              Войти
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 rounded-lg bg-[#141414] border border-[#262626] px-3 py-2.5">
            <Icon name="Search" size={15} className="text-gray-500" />
            <input
              type="text"
              placeholder="Поиск игры..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setFilterGenre(g)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
                  filterGenre === g
                    ? "bg-violet-600/20 border-violet-500 text-violet-300"
                    : "bg-[#141414] border-[#262626] text-gray-400 hover:border-gray-500"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#141414] border border-[#262626] h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((game) => {
              const isBought = purchased.has(game.id)
              const isLoading = buying === game.id
              const steamThumb = game.steam_id && game.steam_id !== "0"
                ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_id}/header.jpg`
                : null
              return (
                <div
                  key={game.id}
                  className="rounded-xl bg-[#141414] border border-[#262626] overflow-hidden flex flex-col hover:border-violet-500/40 transition-colors group"
                >
                  <div className="h-24 bg-[#1a1a1a] overflow-hidden">
                    {steamThumb ? (
                      <img
                        src={steamThumb}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Gamepad2" size={24} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs font-medium text-white mb-1 line-clamp-2 leading-tight">{game.title}</p>
                    <span className={`inline-block self-start rounded-full px-1.5 py-0.5 text-[10px] font-medium mb-2 ${GENRE_COLORS[game.genre] || "bg-gray-500/20 text-gray-400"}`}>
                      {game.genre}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold text-violet-400">{game.price}₽</span>
                      <button
                        onClick={() => handleBuy(game)}
                        disabled={isBought || isLoading}
                        className={`rounded-lg px-2 py-1 text-[10px] font-medium transition-colors ${
                          isBought
                            ? "bg-green-500/20 text-green-400 cursor-default"
                            : "bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30"
                        }`}
                      >
                        {isLoading ? "..." : isBought ? "Куплено" : "Купить"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
