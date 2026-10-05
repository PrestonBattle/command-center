'use client';

import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface BackButtonProps {
  text?: string;
  href?: string;
  fallbackHref?: string;
  className?: string;
}

export function BackButton({ text = 'Go back', href, fallbackHref = '/', className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  if (href) {
    return (
      <Link href={href}>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          size="sm"
          className={`${className ?? ""} mb-4`.trim()}
        >
          {text}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant="subtle"
      leftSection={<IconArrowLeft size={16} />}
      size="sm"
      onClick={handleBack}
      className={`${className ?? ""} mb-4`.trim()}
    >
      {text}
    </Button>
  );
}




