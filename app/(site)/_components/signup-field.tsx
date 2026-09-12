import type { ChangeEvent, ReactNode } from "react";
import { cn } from "cn";

type SignupFieldProps = {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  inputClassName?: string;
  children: ReactNode;
};

export function SignupField({
  id,
  value,
  onChange,
  disabled = false,
  inputClassName,
  children,
}: SignupFieldProps) {
  return (
    <div className="flex w-full border border-line-subtle focus-within:border-line has-[input:focus]:border-line">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        name="email"
        type="email"
        value={value}
        onChange={onChange}
        maxLength={200}
        disabled={disabled}
        placeholder="winger@greendale.edu"
        autoComplete="email"
        className={cn(
          "min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed",
          inputClassName,
        )}
      />
      {children}
    </div>
  );
}
