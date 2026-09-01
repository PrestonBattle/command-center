import { ClientRow } from "@/global/types/supabase/types"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import { ClientsPage } from "./clients-page"

type ClientsPageGuardProps = {
  clientsPromise: Promise<ClientRow[]>
}

export function ClientsPageGuard({
  clientsPromise,
}:ClientsPageGuardProps) {
  return (
    //chore: add error boundery - suspense- fallback
    <ClientsPage clientsPromise={clientsPromise}/>
  )
}