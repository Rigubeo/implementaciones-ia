import { CalendarDays, Mail, Table2, UserRoundCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <circle cx="16" cy="16" r="15" fill="#25D366" />
      <path
        fill="#fff"
        d="M22.8 18.9c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.5-.5-2.8-1.7-1-1-1.7-2.1-1.9-2.5-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.2 0-.5 0-.7-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.3.4-1.3 1.2-1.3 3s1.3 3.5 1.5 3.7c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.7-.4Z"
      />
      <path
        fill="#fff"
        d="M16 4.6A11.3 11.3 0 0 0 6.4 22l-1 4.9 5-1.3A11.3 11.3 0 1 0 16 4.6Zm0 20.2c-1.8 0-3.5-.5-5-1.5l-.4-.2-3 .8.6-3-.2-.4a8.9 8.9 0 1 1 8 4.3Z"
      />
    </svg>
  );
}

export function N8nIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 72 32" aria-hidden="true" className={cn("h-6 w-14", className)}>
      <rect width="72" height="32" rx="8" fill="#ff6d5a" />
      <path stroke="#fff" strokeLinecap="round" strokeWidth="3" d="M18 16h11m14 0h11" />
      <circle cx="14" cy="16" r="5" fill="#fff" />
      <circle cx="34" cy="16" r="5" fill="#fff" />
      <circle cx="58" cy="16" r="5" fill="#fff" />
      <text x="27" y="21" fill="#222" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800">
        n8n
      </text>
    </svg>
  );
}

export function GoogleCalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <path fill="#1a73e8" d="M6 5h20a2 2 0 0 1 2 2v6H4V7a2 2 0 0 1 2-2Z" />
      <path fill="#34a853" d="M4 13h6v14H6a2 2 0 0 1-2-2V13Z" />
      <path fill="#fbbc04" d="M22 13h6v12a2 2 0 0 1-2 2h-4V13Z" />
      <path fill="#fff" d="M10 13h12v14H10z" />
      <path fill="#ea4335" d="M10 5h12v8H10z" />
      <text x="11" y="23" fill="#1a73e8" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="800">
        31
      </text>
    </svg>
  );
}

export const integrationIcons = {
  whatsapp: WhatsAppIcon,
  n8n: N8nIcon,
  calendar: GoogleCalendarIcon,
  sheets: Table2,
  crm: UserRoundCheck,
  mail: Mail,
  schedule: CalendarDays
};

