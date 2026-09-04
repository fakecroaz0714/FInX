import { BasicMapExample } from "@/components/BasicMapExample";
import { LeafletMapExample } from "@/components/LeafletMapExample";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function MapDemoPage() {
  return (
    <div className="p-8 pb-20 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Map Demos</h1>
        <p className="text-slate-500 mt-1">Interactive maps powered by MapLibre GL and Leaflet (OpenStreetMap)</p>
      </header>

      {/* Leaflet Example */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Leaflet (react-leaflet)
            </CardTitle>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
              OpenStreetMap
            </span>
          </div>
          <CardDescription className="text-slate-500 text-sm">
            Rendered using <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;LeafletMapExample center={[18.5204, 73.8567]} zoom={13} /&gt;</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <LeafletMapExample />
        </CardContent>
      </Card>

      {/* MapLibre Example */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              MapLibre GL
            </CardTitle>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
              Vector Basemap
            </span>
          </div>
          <CardDescription className="text-slate-500 text-sm">
            Rendered using <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;Map center={[-74.006, 40.7128]} zoom={12} /&gt;</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <BasicMapExample />
        </CardContent>
      </Card>
    </div>
  );
}
