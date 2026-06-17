import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <circle cx="16" cy="16" r="15" fill="#25D366" />
      <path fill="#fff" d="M22.8 18.9c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.5-.5-2.8-1.7-1-1-1.7-2.1-1.9-2.5-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.2 0-.5 0-.7-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.3.4-1.3 1.2-1.3 3s1.3 3.5 1.5 3.7c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.7-.4Z" />
      <path fill="#fff" d="M16 4.6A11.3 11.3 0 0 0 6.4 22l-1 4.9 5-1.3A11.3 11.3 0 1 0 16 4.6Zm0 20.2c-1.8 0-3.5-.5-5-1.5l-.4-.2-3 .8.6-3-.2-.4a8.9 8.9 0 1 1 8 4.3Z" />
    </svg>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <circle cx="16" cy="16" r="15" fill="#229ED9" />
      <path fill="#fff" d="M23.8 9.2 21.4 22c-.2 1-.8 1.2-1.6.8l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.4-.3-.1-.5-.5-.2l-10.1 6.4-4.3-1.4c-.9-.3-.9-.9.2-1.3l16.9-6.5c.8-.3 1.5.2 1.2 1.1Z" />
    </svg>
  );
}

export function GmailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <path fill="#fff" d="M6 8h20v16H6z" />
      <path fill="#EA4335" d="M6 8h4l6 5 6-5h4v3.7l-10 7.7-10-7.7V8Z" />
      <path fill="#FBBC04" d="M6 11.7 10 15v9H6V11.7Z" />
      <path fill="#34A853" d="M22 15v9h4V11.7L22 15Z" />
      <path fill="#4285F4" d="M10 24v-9l6 4.4L22 15v9H10Z" opacity=".14" />
      <path fill="#C5221F" d="M6 8v3.7l4 3.1V8H6Zm20 0h-4v6.8l4-3.1V8Z" />
    </svg>
  );
}

export function GoogleCalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <path fill="#fff" d="M7 5h18a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path fill="#4285F4" d="M7 5h18a2 2 0 0 1 2 2v5H5V7a2 2 0 0 1 2-2Z" />
      <path fill="#34A853" d="M5 12h5v15H7a2 2 0 0 1-2-2V12Z" />
      <path fill="#FBBC04" d="M22 12h5v13a2 2 0 0 1-2 2h-3V12Z" />
      <path fill="#EA4335" d="M10 5h12v7H10z" />
      <text x="10.5" y="23" fill="#1A73E8" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="800">31</text>
    </svg>
  );
}

export function GoogleDocsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <path fill="#4285F4" d="M8 3h11l5 5v21H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path fill="#AECBFA" d="M19 3v5h5l-5-5Z" />
      <path fill="#fff" d="M11 14h10v2H11zm0 4h10v2H11zm0 4h7v2h-7z" />
    </svg>
  );
}

export function GoogleSheetsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-6 w-6", className)}>
      <path fill="#0F9D58" d="M8 3h11l5 5v21H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path fill="#87D9A5" d="M19 3v5h5l-5-5Z" />
      <path fill="#fff" d="M11 14h10v10H11V14Zm2 2v2h2v-2h-2Zm4 0v2h2v-2h-2Zm-4 4v2h2v-2h-2Zm4 0v2h2v-2h-2Z" />
    </svg>
  );
}

export const integrationIcons = {
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  calendar: GoogleCalendarIcon,
  docs: GoogleDocsIcon,
  sheets: GoogleSheetsIcon,
  gmail: GmailIcon
};
