import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { PartnersSection } from "@/components/PartnersSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { CatalogSection } from "@/components/CatalogSection"
import { ReviewsSection } from "@/components/ReviewsSection"
import { ShopSection } from "@/components/ShopSection"
import Icon from "@/components/ui/icon"

const socials = [
  { label: "Telegram", icon: "Send", href: "https://t.me/svkwo1" },
  { label: "VKontakte", icon: "Users", href: "#" },
]

const paymentMethods = [
  { label: "СБП", icon: "Zap" },
  { label: "Сбер", icon: "Building2" },
  { label: "TON", icon: "Diamond" },
  { label: "USDT", icon: "CircleDollarSign" },
]

export default function Index() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <HeroSection />
      <PartnersSection />
      <FeaturesSection />
      <CatalogSection />
      <ReviewsSection />
      <ShopSection />

      <footer className="border-t border-[#1a1a1a] px-4 md:px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <p className="text-sm text-gray-500 order-3 md:order-1">
            © 2025 Fast Issuance™. All rights reserved.
          </p>

          <div className="flex items-center gap-3 order-2">
            <span className="text-xs text-gray-600 mr-1">We accept:</span>
            {paymentMethods.map((method) => (
              <div
                key={method.label}
                className="flex items-center gap-1.5 rounded-lg bg-[#141414] border border-[#262626] px-3 py-1.5"
              >
                <Icon name={method.icon} size={13} className="text-violet-400" />
                <span className="text-xs text-gray-300 font-medium">{method.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 order-1 md:order-3">
            <span className="text-xs text-gray-600">Follow us:</span>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex items-center gap-1.5 rounded-lg bg-[#141414] border border-[#262626] px-3 py-1.5 hover:border-violet-500/50 transition-colors"
              >
                <Icon name={s.icon} size={13} className="text-violet-400" />
                <span className="text-xs text-gray-300 font-medium">{s.label}</span>
              </a>
            ))}
          </div>

        </div>
      </footer>
    </main>
  )
}