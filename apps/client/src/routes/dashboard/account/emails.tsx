import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button"
import { createEmail, deleteEmail, getEmails, verifyEmail } from "@/api/client";
import type { emailData } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { asQuery, mutate, queryClient } from "@/utils/query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLogger } from "@logtape/logtape";

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

const logger = getLogger(["template-client", "dashboard-utils"])

const EmailsTable = ({ emails }: { emails: emailData[] }) => {
  const userId = queryClient.getQueryData(['id'])
  const [newEmail, setNewEmail] = useState('')

  return <>
    <Table>
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
                  onClick={() => logger.info`TODO`}>
                  Make Primary
                </Button>
            }</TableCell>
            <TableCell className="flex justify-between w-[5rem]">
              <SquarePenIcon onClick={() => logger.info`edit`} />
              <Trash2Icon onClick={() => mutateEmailsDelete(id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <div className="flex justify-between max-w-100">
      <Field className="max-w-85">
        <Input
          id='email'
          type='text'
          placeholder='me@example.com'
          onBlur={(e) => setNewEmail(e.target.value)}
        />
        <FieldLabel htmlFor='email'>New Email</FieldLabel>
      </Field>
      <Button onClick={() => mutateEmailsCreate({ userId, email: newEmail })}>Add</Button>
    </div>
  </>
}

const mutateEmailsDelete = (emailId: string) => mutate({
  queryFn: deleteEmail,
  params: emailId,
  queryKey: ['emails'],
  handler: (old: emailData[]) =>
    old.filter(email => email.id !== emailId)
})

const mutateEmailsCreate = ({ userId, email }) => mutate({
  queryFn: createEmail,
  params: { userId, email },
  queryKey: ['emails'],
  onSuccess: (data: emailData) => (old: emailData[]) =>
    [data, ...old]
})
