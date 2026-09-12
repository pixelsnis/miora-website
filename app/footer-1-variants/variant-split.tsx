import { LegalLine, PlateWordmark, SocialLinks, Statement } from "./shared";

export function VariantSplit() {
  return (
    <footer className="border-t border-line bg-background text-ink">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex items-end border-b border-line px-4 py-8 sm:px-8 md:border-b-0 md:border-r lg:px-[72px] lg:pr-10">
          <Statement />
        </div>
        <div className="flex flex-col justify-end gap-3 border-b border-line px-4 py-8 sm:px-8 md:px-10 lg:px-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            Elsewhere
          </p>
          <SocialLinks variant="stack" />
        </div>
      </div>
      <div className="px-4 py-3 sm:px-8 lg:px-[72px]">
        <PlateWordmark />
      </div>
      <div className="border-t border-line px-4 py-4 sm:px-8 lg:px-[72px]">
        <LegalLine />
      </div>
    </footer>
  );
}
