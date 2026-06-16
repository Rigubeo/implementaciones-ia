type TelegramIconProps = {
  className?: string;
};

export function TelegramIcon({ className }: TelegramIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.9 4.3c.2-1-.7-1.7-1.6-1.3L2.9 9.7c-1 .4-1 1.8.1 2.1l4.4 1.4 1.7 5.5c.3.9 1.4 1.1 2 .4l2.5-2.6 4.7 3.5c.8.6 1.9.1 2.1-.9L21.9 4.3ZM8.2 12.3l8.7-5.4c.4-.2.8.2.5.5l-7.2 6.8-.3 3.2-1.2-4.1-.5-1Z"
      />
    </svg>
  );
}
