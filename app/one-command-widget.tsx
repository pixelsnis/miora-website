import { Check } from "griddy-icons";

const outputLines = [
  {
    key: "project-name",
    content: (
      <>
        Project name <span aria-hidden="true">{">"}</span> VirtuGood 6500
      </>
    ),
  },
  {
    key: "link-directory",
    content: (
      <>
        Link this directory? <span aria-hidden="true">{">"}</span> Yes
      </>
    ),
  },
  {
    key: "vault-linked",
    content: (
      <>
        <Check size={10} className="size-2.5 shrink-0" aria-hidden="true" />
        Vault linked
      </>
    ),
  },
  {
    key: "ready",
    content: "Ready.",
  },
] as const;

export function OneCommandWidget() {
  return (
    <div className="w-max whitespace-nowrap rounded-2xl bg-background px-[16pt] py-[12pt] shadow-[0_24px_24px_rgba(0,0,0,.25),0_55px_33px_rgba(0,0,0,.15),0_98px_39px_rgba(0,0,0,.04)]">
      <p className="flex items-baseline gap-1.5 font-mono text-[12pt] font-semibold leading-normal text-ink">
        <span aria-hidden="true">❯</span>
        <span>miora init</span>
      </p>
      <div className="mt-2 flex flex-col gap-px font-mono text-[10pt] leading-normal text-text-secondary">
        {outputLines.map((line) => (
          <p
            key={line.key}
            className={
              line.key === "vault-linked"
                ? "flex items-center gap-1.5"
                : undefined
            }
          >
            {line.content}
          </p>
        ))}
      </div>
    </div>
  );
}
