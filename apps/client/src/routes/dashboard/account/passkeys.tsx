import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/store/user"

import { Button } from "@/components/ui/button"
import { createCredential, deleteCredential, getCredentials } from "@/api/client";
import type { passkeyData } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";

export const Route = createFileRoute('/dashboard/account/passkeys')({
  beforeLoad: async () => {
    const { id, passkeys } = useUserStore.getState()

    // figure out api client caching
    if (!passkeys?.length) {
      const { data, err } = await getCredentials(id)
      if (err) {
        console.log(err)
      } else {
        useUserStore.setState({ passkeys: data })
      }
    }
  },
  component: () => {
    const { passkeys } = useUserStore()

    return <>{
      passkeys?.length ?
        <PasskeysTable
          passkeys={passkeys}
        /> :
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
