import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { loadUser } from "@/lib/userStore"
import Icon from "@/components/ui/icon"

export function Header() {
  const navigate = useNavigate()
  const user = loadUser()

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <FastIssuanceLogo />
        <span className="text-lg font-semibold text-white">
          Fast Issuance<sup className="text-xs">™</sup>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#catalog" className="text-sm text-gray-300 hover:text-white transition-colors">
          Products
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
          Solutions <ChevronDown className="h-4 w-4" />
        </a>
        <a href="#reviews" className="text-sm text-gray-300 hover:text-white transition-colors">
          Reviews
        </a>
        <a href="#shop" className="text-sm text-gray-300 hover:text-white transition-colors">
          Pricing
        </a>
        <button
          onClick={() => navigate("/store")}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Game Store
        </button>
      </nav>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-full bg-[#1a1a1a] border border-[#262626] px-3 py-1.5 cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <Icon name="Wallet" size={13} className="text-violet-400" />
              <span className="text-sm font-medium text-white">{user.balance.toFixed(2)}₽</span>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm px-4"
            >
              Кабинет
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="rounded-full border-violet-500 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 bg-transparent"
          >
            Войти
          </Button>
        )}
      </div>
    </header>
  )
}

function FastIssuanceLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="#8B5CF6" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="#8B5CF6" opacity="0.6" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="#8B5CF6" opacity="0.4" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="#8B5CF6" opacity="0.2" />
    </svg>
  )
}
