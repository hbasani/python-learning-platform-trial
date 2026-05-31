import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary";
};

export function Button({ variant = "default", className, ...props }: Props) {
  return (
    <button
      className={clsx(
        "rounded-xl px-4 py-2 font-semibold transition",
        variant === "default" ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300" : "bg-slate-700 hover:bg-slate-600",
        className
      )}
      {...props}
    />
  );
}

