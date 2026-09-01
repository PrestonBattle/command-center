import { ClientRow } from "@/global/types/supabase/types"

type ClientsPageProps = {
  clientsPromise: Promise<ClientRow[]>
}
export function ClientsPage({
  clientsPromise
}: ClientsPageProps){
  return(
    <p>
      hey
    </p>
  )
}