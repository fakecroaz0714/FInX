import { BasicMapExample } from "@/components/BasicMapExample";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function MapDemoPage() {
  return (
    <div className="p-8 pb-20 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Map Demo</h1>
        <p className="text-slate-500 mt-1">Interactive map powered by MapLibre GL and mapcn</p>
      </header>

      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg">Basic Map Example</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Rendered using <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">Map center={[-74.006, 40.7128]} zoom={12}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <BasicMapExample />
        </CardContent>
      </Card>
    </div>
  );
}
