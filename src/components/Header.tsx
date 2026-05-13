import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2">
        <FastIssuanceLogo />
        <span className="text-lg font-semibold text-white">
          Fast Issuance<sup className="text-xs">™</sup>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
          Products
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
          Solutions <ChevronDown className="h-4 w-4" />
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
          Resources
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
          Pricing
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
          Contact
        </a>
      </nav>

      <Button
        variant="outline"
        className="rounded-full border-violet-500 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 bg-transparent"
      >
        Request a Demo
      </Button>
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