import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary";
};

export function Button({ variant = "default", className, ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-body-sm font-semibold transition duration-300 ease-premium focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default"
          ? "bg-primary text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:ring-primary-200"
          : "border border-border bg-background-raised text-content-secondary shadow-inset hover:-translate-y-0.5 hover:border-border-strong hover:bg-background-subtle hover:text-content focus-visible:ring-primary-100",
        className
      )}
      {...props}
    />
  );
}
