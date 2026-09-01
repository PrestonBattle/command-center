
import { Container, Stack, Title } from "@mantine/core";
import { getClients } from "./server/actions";
import { ClientsPageGuard } from "./components/page-client/clients-page-guard";
import { ClientRow } from "@/global/types/supabase/types";

export default async function ClientsPage() {

  //get clients
  const clientsPromise = getClients();
  
  
  
  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={1}>Clients</Title>
        <ClientsPageGuard clientsPromise={clientsPromise}/>
      </Stack>
    </Container>
  )
}