import "./style.css";

type GlassProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Skips backdrop-filter blur — uses solid colors instead for better performance. */
  performant?: boolean;
  /** Additional class names applied to the background (border) layer. */
  backgroundClassName?: string;
};

/**
 * Frosted-glass card with layered blur and a translucent border.
 *
 * Border radius is controlled entirely through Tailwind classes on `className`.
 * Inner layers use `border-radius: inherit`, and the CSS is wrapped in
 * `@layer components` so utility classes always win.
 *
 * @example
 * ```tsx
 * // Uniform radius
 * <Glass className="rounded-2xl p-6">content</Glass>
 *
 * // Per-corner radius
 * <Glass className="rounded-tl-sm rounded-br-[2rem] p-6">content</Glass>
 *
 * // No blur (cheaper on low-end devices / long lists)
 * <Glass performant className="rounded-xl p-6">content</Glass>
 * ```
 */
export default function Glass({
  children,
  className = "",
  performant = false,
  backgroundClassName = "",
  ...rest
}: GlassProps) {
  return (
    <div
      className={`glass ${performant ? "glass--performant" : ""} ${className}`}
      {...rest}
    >
      {children}
      <div className={`glass__background ${backgroundClassName}`} />
      <div className="glass__foreground" />
    </div>
  );
}