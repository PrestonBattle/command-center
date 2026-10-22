import { IconPlus } from "@tabler/icons-react";
import { ButtonLink } from "@/global/components/button-link";

/** The page's main action, in the header and again in the empty state. */
export function AddClientButton() {
  return (
    <ButtonLink href="/clients/new" leftSection={<IconPlus size={18} aria-hidden />}>
      Add client
    </ButtonLink>
  );
}
