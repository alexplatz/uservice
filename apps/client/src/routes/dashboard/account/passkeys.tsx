import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/store/user"

import { Button } from "@/components/ui/button"
import { createCredential, deleteCredential, getCredentials } from "@/api/client";
import type { passkeyData } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { asQuery } from "@/utils/query";

export const Route = createFileRoute('/dashboard/account/passkeys')({
  component: () => {
    const queryClient = useQueryClient()
    const id = queryClient.getQueryData(['id'])

    const { data, isLoading } = useQuery({
      queryKey: ['credentials'],
      queryFn: () => asQuery(getCredentials, id),
    })

    return <>{
      isLoading ? <p>Loading...</p> :
        data?.length ? <PasskeysTable passkeys={data} /> :
          <p>No passkeys.</p>
    }</>
  }
})


const PasskeysTable = ({ passkeys }: { passkeys: passkeyData[] }) => {
  const { id: userId, username, emails } = useUserStore()
  const [email] = emails.filter(email => email.isPrimary).map(email => email.email)

  return <>
    <Table>
      <TableCaption>Your Passkeys</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Public Key</TableHead>
          <TableHead>Algorithm</TableHead>
          <TableHead>Transports</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {passkeys.map(({ id: passkeyId, publicKey, algorithm, transports }: passkeyData) => (
          <TableRow key={passkeyId}>
            <TableCell>{publicKey}</TableCell>
            <TableCell>{algorithm}</TableCell>
            <TableCell>{transports}</TableCell>
            <TableCell className="flex justify-between w-[5rem]">
              <Trash2Icon onClick={() => deleteCredential(passkeyId)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Button onClick={() => createCredential({ userId, username, email })}>Add</Button>
  </>
}
