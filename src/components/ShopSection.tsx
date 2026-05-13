import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for early-stage fintechs and MVPs.",
    highlight: false,
    features: [
      "Up to 1,000 virtual cards/mo",
      "Basic API access",
      "Email support",
      "Dashboard access",
      "Webhook notifications",
    ],
    cta: "Get Started",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$199",
    period: "/month",
    description: "For scaling teams with higher issuance volumes.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Up to 20,000 virtual cards/mo",
      "Full API access",
      "Priority support",
      "Role-based access control",
      "Bulk issuance",
      "Multi-currency accounts",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "White-label solutions and dedicated infrastructure.",
    highlight: false,
    features: [
      "Unlimited issuance",
      "White-label platform",
      "Dedicated account manager",
      "SLA guarantees",
      "Custom integrations",
      "On-premise option",
    ],
    cta: "Contact Sales",
  },
]

export function ShopSection() {
  return (
    <section id="shop" className="px-4 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Plans & Pricing</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose the plan that fits your scale. Upgrade or downgrade anytime — no lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col border transition-colors ${
                plan.highlight
                  ? "bg-violet-600/10 border-violet-500/50 relative"
                  : "bg-[#141414] border-[#262626]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 mb-1">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Icon name="Check" size={14} className="text-violet-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full ${
                  plan.highlight
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-[#252525] text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
