import { createFileRoute } from "@tanstack/react-router";

import type { sessionData } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteSession, getSessions } from "@/api/client";
import { useState } from "react";
import { DeleteAlert } from './-utils'
import { asQuery, mutate } from "@/utils/query";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute('/dashboard/account/sessions')({
  component: () => {
    const queryClient = useQueryClient()
    const id = queryClient.getQueryData(['id'])

    const { data, isLoading } = useQuery({
      queryKey: ['sessions'],
      queryFn: () => asQuery(getSessions, id),
    })

    return <>{
      isLoading ? <p>Loading...</p> :
        data?.length ? <SessionsTable sessions={data} /> :
          <p>No sessions... 🤔</p>
    }</>
  }
})

const SessionsTable = ({ sessions }: { sessions: sessionData[] }) =>
  <>
    <Table>
      <TableCaption>Your Sessions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Family ID</TableHead>
          <TableHead>Last Used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{
        sessions.map(({ familyId, lastUsed }: sessionData) =>
          <SessionRow familyId={familyId} lastUsed={lastUsed} />)
      }</TableBody>
    </Table>
  </>

const SessionRow = ({ familyId, lastUsed }: { familyId: string, lastUsed: string }) => {
  const [alertOpen, setAlertOpen] = useState(false)
  return <>
    <TableRow key={familyId}>
      <TableCell>{familyId}</TableCell>
      <TableCell>{lastUsed}</TableCell>
      <TableCell>
        <DeleteAlert
          target={familyId}
          fn={mutateSessions}
          message='This may log you out.'
          open={alertOpen}
          setOpen={setAlertOpen}
        />
      </TableCell>
    </TableRow>
  </>
}

const mutateSessions = (familyId: string) => mutate({
  queryFn: deleteSession,
  params: familyId,
  queryKey: ['sessions'],
  handler: (old: sessionData[]) => old.filter(sesh => sesh.familyId !== familyId)
})

