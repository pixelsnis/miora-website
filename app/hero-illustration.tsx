"use client";

import Image from "next/image";
import { AiFlow, Folder, GenerateFile } from "griddy-icons";

const rows = [
  { name: "AGENTS.md", kind: "file" },
  { name: "current/", kind: "folder" },
  { name: "engineering/", kind: "folder" },
  { name: "product/", kind: "folder" },
  { name: "versions/", kind: "folder" },
];

const iconClassName = "size-[21px] shrink-0 text-text-muted";

export function HeroIllustration() {
  return (
    <div className="hero-art relative h-[clamp(15rem,38vh,29.6875rem)] min-h-0 w-full shrink select-none overflow-hidden bg-surface-dark" aria-label="Several AI agents coordinate updates to a shared project knowledge folder">
      <div className="absolute -inset-3">
        <Image src="/images/landing/hero.webp" alt="" fill priority draggable={false} sizes="(max-width: 1280px) 100vw, 1136px" className="object-cover" />
      </div>

      <div className="knowledge-card absolute left-1/2 top-1/2 w-[270px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] bg-background pt-0.5 shadow-[0_24px_24px_rgba(0,0,0,.25),0_55px_33px_rgba(0,0,0,.15),0_98px_39px_rgba(0,0,0,.04)]">
        <div className="flex items-center gap-1.5 p-2 font-mono text-sm text-ink">
          <Folder size={21} className={iconClassName} aria-hidden="true" />
          <span>knowledge/</span>
        </div>
        <div className="pl-3.5">
          {rows.map((row) => (
            <div key={row.name} className="relative h-[37px] overflow-hidden">
              <div className="relative z-10 flex h-full items-center gap-1.5 py-2 pl-2 pr-4 font-mono text-sm text-ink">
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  {row.kind === "file" ? (
                    <GenerateFile size={21} className={iconClassName} aria-hidden="true" />
                  ) : (
                    <Folder size={21} className={iconClassName} aria-hidden="true" />
                  )}
                  <span className="truncate">{row.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 border-t border-line-subtle p-2 text-xs text-moss">
          <AiFlow size={12} className="shrink-0 text-moss" aria-hidden="true" />
          <span>Auto</span>
        </div>
      </div>
    </div>
  );
}
