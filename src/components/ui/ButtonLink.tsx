import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  const classes = {
    primary:
      "bg-ocean text-white shadow-glow hover:bg-[#006ce0]",
    secondary:
      "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/16",
    ghost:
      "border border-line bg-white text-ink hover:border-ocean hover:text-ocean"
  };

  return (
    <a
      href={href}
      className={cn(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition",
        classes[variant],
        className
      )}
    >
      {children}
      <ArrowRight size={17} strokeWidth={2.4} />
    </a>
  );
}
