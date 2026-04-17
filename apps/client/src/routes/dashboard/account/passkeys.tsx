import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button"
import { createCredential, deleteCredential, getCredentials, getEmails } from "@/api/client";
import type { emailData, passkeyData } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { asQuery, mutate } from "@/utils/query";

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
  const queryClient = useQueryClient()
  const username = queryClient.getQueryData(['username'])
  const userId = queryClient.getQueryData(['id'])
  const { data: emails } = useQuery({
    queryKey: ['emails'],
    queryFn: () => asQuery(getEmails, userId),
  })

  const email = emails ? emails
    .filter((email: emailData) => email.isPrimary)
    .map((email: emailData) => email.email)
    .pop() :
    undefined

  return <>
    <Table>
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
              <Trash2Icon onClick={() => mutateCredentialsDelete(passkeyId)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Button onClick={() => mutateCredentialsCreate({ userId, username, email })}>Add</Button>
  </>
}

const mutateCredentialsDelete = (passkeyId: string) => mutate({
  queryFn: deleteCredential,
  params: passkeyId,
  queryKey: ['credentials'],
  handler: (old: passkeyData[]) =>
    old.filter(passkey => passkey.id !== passkeyId)
})

const mutateCredentialsCreate = ({ userId, username, email }) => mutate({
  queryFn: createCredential,
  params: { userId, username, email },
  queryKey: ['credentials'],
  onSuccess: (data: passkeyData) => (old: passkeyData[]) =>
    [data, ...old]
})

