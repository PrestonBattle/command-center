import { NotFoundPanel } from "@/global/components/not-found-panel";

/** Shown when a signed-in page calls notFound(), e.g. a deleted client. Keeps the navbar. */
export default function AppNotFound() {
  return <NotFoundPanel />;
}
