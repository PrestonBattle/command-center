import { NotFoundPanel } from "@/global/components/not-found-panel";

/**
 * Any URL that matches no route. Outside the app layout, so there's no
 * navbar; the button goes home, and the auth gate sends signed-out people
 * to login from there.
 */
export default function RootNotFound() {
  return (
    <main className="px-4 py-12">
      <NotFoundPanel href="/" linkLabel="Go home" />
    </main>
  );
}
