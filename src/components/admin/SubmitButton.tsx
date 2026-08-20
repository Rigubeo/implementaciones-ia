"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  variant = "primary"
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-ocean text-white hover:bg-[#006ce0]",
    secondary: "border border-line bg-white text-ink hover:border-ocean hover:text-ocean",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition disabled:cursor-wait disabled:opacity-60 ${styles[variant]}`}
    >
      {pending ? <LoaderCircle size={17} className="animate-spin" /> : null}
      {children}
    </button>
  );
}
