"use client";

import { Map } from "@/components/ui/map";

export function BasicMapExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[-74.006, 40.7128]} zoom={12} />
    </div>
  );
}
