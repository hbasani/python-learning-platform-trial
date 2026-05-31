import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary";
};

export function Button({ variant = "default", className, ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "default"
          ? "bg-[#111827] text-white shadow-sm hover:bg-[#1f2937]"
          : "border border-[#e4e7ec] bg-white text-[#344054] hover:bg-[#f8fafc]",
        className
      )}
      {...props}
    />
  );
}
