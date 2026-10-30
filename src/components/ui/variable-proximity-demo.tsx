"use client";

import * as React from "react";
import { VariableProximity } from "@/components/ui/variable-proximity";

/** The demo brings its own 000h canvas, so it looks right on any host page (the component package sets nothing global). */
function DemoSurface({ children }: { children: import("react").ReactNode }) {
  return <div className="grid min-h-screen w-full place-items-center bg-[var(--v-canvas)] p-4 font-[family-name:var(--font-text)] text-[length:var(--fs-body)] leading-[var(--lh-body)] text-[var(--v-text)]">{children}</div>;
}

export default function VariableProximityDemo() {
  const [paused, setPaused] = React.useState(false);
  return (
    <DemoSurface>
      <div className="mx-auto grid w-full max-w-3xl gap-4 p-8">
        <VariableProximity text="Closer feels different" variant="weight" paused={paused} />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className="rounded-full border border-[var(--v-border)] bg-[var(--v-paper)] px-4 py-2 text-sm font-medium text-[var(--v-text)] transition-colors hover:bg-[var(--v-beige)]"
          >
            {paused ? "Resume motion" : "Pause motion"}
          </button>
          <span className="text-sm text-[var(--v-text-2)]">Move across the letters to change their weight.</span>
        </div>
      </div>
    </DemoSurface>
  );
}
