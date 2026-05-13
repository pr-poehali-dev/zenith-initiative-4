import { Building2, ArrowUpRight, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const issuances = [
  { name: "Alex Morgan", info: "alex@novapay.io", code: "ISS-1042", image: "/professional-man-portrait.png" },
  { name: "Sarah Chen", info: "+1 (415) 555-0198", code: "ISS-1078", image: "/professional-woman-portrait.png" },
  { name: "Elena Russo", info: "e.russo@clearfin.com", code: "ISS-1091", initials: "ER", color: "bg-teal-600" },
  { name: "David Kim", info: "+44 20 7946 0321", code: "ISS-1103", initials: "DK", color: "bg-amber-600" },
]

export function LinkAccountsCard() {
  return (
    <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6 flex flex-col">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#2a2a2a]">
        <Building2 className="h-5 w-5 text-gray-400" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-white">Link All Accounts</h3>
      <p className="mb-4 text-sm text-gray-400">Connect banks, wallets, and cards — see every balance and issued instrument in one place</p>

      <a href="#" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
        Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
      </a>

      <div className="mt-auto space-y-2 rounded-xl bg-[#1a1a1a] border border-[#262626] p-3">
        {issuances.map((item, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg bg-[#0f0f0f] px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                {item.image ? (
                  <AvatarImage src={item.image || "/placeholder.svg"} alt={item.name} />
                ) : null}
                <AvatarFallback className={`${item.color || "bg-gray-600"} text-white text-xs`}>
                  {item.initials ||
                    item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-gray-500">{item.info}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{item.code}</span>
          </div>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-center text-gray-500 hover:text-white hover:bg-[#1f1f1f] mt-2"
        >
          <Plus className="mr-2 h-4 w-4" /> New Issuance
        </Button>
      </div>
    </div>
  )
}