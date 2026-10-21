"use client";

import { ActionIcon, Button, type ActionIconProps, type ButtonProps } from "@mantine/core";
import Link from "next/link";
import type { ReactNode } from "react";

/*
 * Mantine buttons rendered as Next links. These exist because server
 * components can't pass `component={Link}` themselves: Link is a function,
 * and functions can't be sent from the server to a client component. Here
 * the Link reference stays on the client; callers only pass an href.
 */

type ButtonLinkProps = ButtonProps & { href: string; children: ReactNode };

/** A Mantine Button that navigates. Use instead of `<Button component={Link}>` in server components. */
export function ButtonLink({ href, ...props }: ButtonLinkProps) {
  return <Button component={Link} href={href} {...props} />;
}

type IconLinkProps = ActionIconProps & { href: string; "aria-label": string; children: ReactNode };

/** An icon-only Mantine ActionIcon that navigates. `aria-label` is required: there's no visible text. */
export function IconLink({ href, ...props }: IconLinkProps) {
  return <ActionIcon component={Link} href={href} {...props} />;
}
