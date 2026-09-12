import { LegalLine, PlateWordmark, SocialLinks, Statement } from "./shared";

export function VariantFlush() {
  return (
    <footer className="border-t border-line bg-background text-ink">
      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <PlateWordmark className="-ml-1" />
      </div>
      <div className="mt-4 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_auto_auto]">
        <div className="border-b border-line px-4 py-6 sm:border-b-0 sm:px-8 lg:border-r lg:px-[72px] lg:py-7">
          <Statement />
        </div>
        <div className="flex items-end border-b border-line px-4 py-6 sm:border-b-0 sm:border-l sm:px-8 lg:px-10">
          <SocialLinks variant="icons" />
        </div>
        <div className="flex items-end px-4 py-6 sm:col-span-2 sm:border-t sm:px-8 lg:col-span-1 lg:border-l lg:border-t-0 lg:px-10">
          <LegalLine />
        </div>
      </div>
    </footer>
  );
}
