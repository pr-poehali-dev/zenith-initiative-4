import Icon from "@/components/ui/icon"

const products = [
  {
    id: "virtual-card",
    title: "Virtual Card Issuance",
    description: "Instantly issue Visa/Mastercard virtual cards for your customers worldwide.",
    badge: "Popular",
    price: "from $0.10 / card",
    icon: "CreditCard",
  },
  {
    id: "physical-card",
    title: "Physical Card Program",
    description: "Full-cycle physical card production with custom branding and delivery.",
    badge: "Enterprise",
    price: "from $2.50 / card",
    icon: "Wallet",
  },
  {
    id: "account-provisioning",
    title: "Account Provisioning",
    description: "Open IBANs and multi-currency accounts in seconds via API.",
    badge: "API",
    price: "from $1.00 / account",
    icon: "Building2",
  },
  {
    id: "bulk-issuance",
    title: "Bulk Issuance",
    description: "Issue thousands of cards or accounts in one batch operation.",
    badge: "Scale",
    price: "Volume pricing",
    icon: "Layers",
  },
  {
    id: "prepaid",
    title: "Prepaid Solutions",
    description: "Gift cards, payroll cards, and expense cards — all in one platform.",
    badge: "Flexible",
    price: "from $0.05 / card",
    icon: "Gift",
  },
  {
    id: "white-label",
    title: "White-Label Platform",
    description: "Launch your own card issuing product under your brand in days.",
    badge: "Custom",
    price: "Contact us",
    icon: "Star",
  },
]

const badgeColors: Record<string, string> = {
  Popular: "bg-violet-500/20 text-violet-400",
  Enterprise: "bg-blue-500/20 text-blue-400",
  API: "bg-green-500/20 text-green-400",
  Scale: "bg-amber-500/20 text-amber-400",
  Flexible: "bg-pink-500/20 text-pink-400",
  Custom: "bg-teal-500/20 text-teal-400",
}

export function CatalogSection() {
  return (
    <section id="catalog" className="px-4 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Product Catalog</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Everything you need to build a modern payment product — from a single virtual card to a full white-label platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-[#141414] border border-[#262626] p-6 flex flex-col hover:border-violet-500/40 transition-colors group"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#2a2a2a]">
                  <Icon name={product.icon} size={18} className="text-gray-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeColors[product.badge]}`}>
                  {product.badge}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mb-2">{product.title}</h3>
              <p className="text-sm text-gray-400 flex-1 mb-4">{product.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                <span className="text-sm font-medium text-violet-400">{product.price}</span>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  Details <Icon name="ArrowUpRight" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
