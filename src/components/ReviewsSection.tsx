import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Icon from "@/components/ui/icon"

const reviews = [
  {
    name: "James Whitfield",
    role: "CTO, NovaPay",
    text: "Fast Issuance cut our card provisioning time from days to seconds. The API is incredibly clean and our integration took less than a week.",
    rating: 5,
    image: "/professional-man-portrait.png",
  },
  {
    name: "Sarah Chen",
    role: "Product Lead, ClearFin",
    text: "We issue thousands of virtual cards monthly. The bulk issuance feature alone saved us hundreds of engineering hours.",
    rating: 5,
    image: "/professional-woman-portrait.png",
  },
  {
    name: "Marco Delgado",
    role: "Founder, ZapTransfer",
    text: "White-label setup was painless. We launched our own card product in under two weeks. Truly impressive platform.",
    rating: 5,
    initials: "MD",
    color: "bg-teal-600",
  },
  {
    name: "Lena Voronova",
    role: "CFO, PulseCard",
    text: "Real-time balance visibility and role-based controls gave our finance team the confidence to scale without compliance headaches.",
    rating: 5,
    initials: "LV",
    color: "bg-violet-700",
  },
  {
    name: "Amir Hosseini",
    role: "CEO, AuroraFX",
    text: "Multi-currency account provisioning is a game changer for our cross-border clients. Fast Issuance delivers exactly what it promises.",
    rating: 5,
    initials: "AH",
    color: "bg-amber-700",
  },
  {
    name: "Priya Nair",
    role: "Head of Fintech, Horizon Bank",
    text: "Onboarding was smooth and support was responsive. The prepaid solutions module fits perfectly into our retail banking stack.",
    rating: 5,
    initials: "PN",
    color: "bg-pink-700",
  },
]

export function ReviewsSection() {
  return (
    <section id="reviews" className="px-4 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What Our Clients Say</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Trusted by fintech teams across the globe — here's what they think about Fast Issuance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#141414] border border-[#262626] p-6 flex flex-col"
            >
              <div className="flex mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Icon key={i} name="Star" size={14} className="text-violet-400 fill-violet-400" />
                ))}
              </div>

              <p className="text-sm text-gray-300 flex-1 mb-5 leading-relaxed">"{review.text}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-[#262626]">
                <Avatar className="h-9 w-9">
                  {review.image ? (
                    <AvatarImage src={review.image} alt={review.name} />
                  ) : null}
                  <AvatarFallback className={`${review.color || "bg-gray-600"} text-white text-xs`}>
                    {review.initials ||
                      review.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
