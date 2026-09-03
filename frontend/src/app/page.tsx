import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import DashboardChart from "@/components/DashboardChart";

export default function Dashboard() {
  return (
    <div className="p-8 pb-20">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 mt-1">Real-time CSR impact and escrow status.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
          New CSR Proposal
        </button>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Active Petitions", value: "24", label: "From communities" },
          { title: "NGOs Validated", value: "8", label: "Ready for funding" },
          { title: "CSR Funds Escrowed", value: "₹1.2M", label: "Across 12 projects" },
          { title: "Milestones Cleared", value: "42", label: "Funds released" },
        ].map((stat, i) => (
          <Card key={i} className="border border-slate-200 shadow-sm leading-normal">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-slate-500 mb-1">{stat.title}</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Projects */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Active Escrow Projects</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { name: "Clean Water Initiative - Pune", ngo: "Jal Seva NGO", status: "Escrow Active", amount: "₹50,000", progress: 40 },
                  { name: "Solar Panel Installation - Rural Tech", ngo: "Green Earth Foundation", status: "Milestone Review", amount: "₹120,000", progress: 75 },
                  { name: "School Rebuilding Project - Bihar", ngo: "EduCare Org", status: "Evaluating NGO", amount: "₹85,000", progress: 10 },
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <span>{item.ngo}</span>
                        <span>•</span>
                        <Badge variant={item.status === 'Escrow Active' ? 'success' : item.status === 'Milestone Review' ? 'warning' : 'neutral'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right w-48">
                      <div className="font-semibold text-slate-900">{item.amount}</div>
                      <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Section */}
          <Card className="border border-slate-200 shadow-sm mt-8">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">CSR Fund Velocity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <DashboardChart />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Alerts */}
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Action Required
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Milestone Review: Solar Project</p>
                  <p className="text-xs text-slate-500 mt-1">NGO submitted photo evidence for Stage 2. Awaiting admin approval to release 25% funds.</p>
                  <button className="text-indigo-600 text-xs font-semibold mt-2 flex items-center gap-1 hover:underline">
                    Review Evidence <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">NGO Validated: 'Care For All'</p>
                  <p className="text-xs text-slate-500 mt-1">Background check clear. Ready to be matched with active CSR budgets.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
