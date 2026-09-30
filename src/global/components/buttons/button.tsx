import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children?: React.ReactNode;
  /** Alternative to children, for callers that pass a plain string. */
  text?: string;
  /** ReactNode, not string — icons are elements. */
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  /** Renders a Link instead of a button. */
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "type" | "onClick" | "className">;

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-purple-800 text-paper hover:bg-purple-700",
  secondary: "bg-paper-dim text-ink border border-purple-800/20 hover:bg-purple-50",
  ghost: "text-ink-muted hover:bg-purple-50 hover:text-ink",
  danger: "bg-negative text-paper hover:bg-negative/90",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

export default function Button({
  children,
  text,
  leftSection,
  rightSection,
  href,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center rounded-lg font-medium",
    "transition-colors active:translate-y-px",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const body = (
    <>
      {loading ? <Spinner /> : leftSection}
      {children ?? text}
      {rightSection}
    </>
  );

  // An anchor can't be disabled — there's no such attribute. Rendering a
  // real button instead keeps it genuinely unclickable rather than
  // looking dim while still navigating.
  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      // Tells assistive tech the control is working, not broken.
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {body}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2Z"
      />
    </svg>
  );
}