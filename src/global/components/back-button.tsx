"use client";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface BackButtonProps {
  text?: string;
  /** Where to go. Without it, goes back in history (or to fallbackHref). */
  href?: string;
  fallbackHref?: string;
  className?: string;
}

/**
 * A "← Back" control. With `href` it renders a real link (Button styled,
 * `component={Link}`), never a button inside a link, which is invalid HTML
 * and announced twice by screen readers.
 */
export function BackButton({ text = "Back", href, fallbackHref = "/", className }: BackButtonProps) {
  const router = useRouter();
  const icon = <IconArrowLeft size={16} aria-hidden />;

  if (href) {
    return (
      <Button component={Link} href={href} variant="subtle" color="dark" leftSection={icon} className={className}>
        {text}
      </Button>
    );
  }

  return (
    <Button
      variant="subtle"
      color="dark"
      leftSection={icon}
      className={className}
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallbackHref))}
    >
      {text}
    </Button>
  );
}
