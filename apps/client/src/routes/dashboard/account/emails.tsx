import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/store/user"

import { Button } from "@/components/ui/button"
import { createEmail, deleteEmail, getEmails, verifyEmail } from "@/api/client";
import type { emailData } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { asQuery } from "@/utils/query";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute('/dashboard/account/emails')({
  component: () => {
    const queryClient = useQueryClient()
    const id = queryClient.getQueryData(['id'])

    const { data, isLoading } = useQuery({
      queryKey: ['emails'],
      queryFn: () => asQuery(getEmails, id),
    })

    return <>{
      isLoading ? <p>Loading...</p> :
        data?.length ? <EmailsTable emails={data} /> :
          <p>No emails... 🤔</p>
    }</>
  }
})

const EmailsTable = ({ emails }: { emails: emailData[] }) => {
  const { id } = useUserStore()
  const [newEmail, setNewEmail] = useState('')

  return <>
    <Table>
      <TableCaption>Your emails</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Primary</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emails.map(({ id, email, isPrimary, verified }: emailData) => (
          <TableRow key={id}>
            <TableCell>{email}</TableCell>
            <TableCell>{
              !verified ?
                <Button
                  onClick={async () => await verifyEmail(email)}>
                  Verify
                </Button> :
                <p>✅</p>
            }</TableCell>
            <TableCell>{
              isPrimary ?
                <p>✅</p> :
                <Button
                  onClick={() => console.log('TODO')}>
                  Make Primary
                </Button>
            }</TableCell>
            <TableCell className="flex justify-between w-[5rem]">
              <SquarePenIcon onClick={() => console.log('edit')} />
              <Trash2Icon onClick={() => deleteEmail(id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Field>
      <FieldLabel htmlFor='email'>New Email</FieldLabel>
      <Input
        id='email'
        type='text'
        placeholder='me@example.com'
        onBlur={(e) => setNewEmail(e.target.value)}
      />
    </Field>
    <Button onClick={() => createEmail(id, newEmail)}>Add</Button>
  </>
}
