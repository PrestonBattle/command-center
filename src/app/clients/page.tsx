import { Container, Stack, Title } from "@mantine/core";
import { getClients } from "./server/actions";

export default async function ClientsPage() {

  //get clients
  const clientsPromise = await getClients();
  
  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={1}>Clients</Title>
      </Stack>
    </Container>
  )
}