import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/store/user"

import type { sessionData } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteSession, getSessions } from "@/api/client";
import { useState } from "react";
import { DeleteAlert } from './-utils'

export const Route = createFileRoute('/dashboard/account/sessions')({
  beforeLoad: async () => {
    const { id, sessions } = useUserStore.getState()

    // move cache logic to client
    if (!sessions?.length) {
      const { data, err } = await getSessions(id)
      if (err) {
        console.log(err)
      } else {
        useUserStore.setState({ sessions: data })
      }
    }
  },
  component: () => {
    const { sessions } = useUserStore()

    return <>{
      sessions?.length ?
        <SessionsTable
          sessions={sessions}
        /> :
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
          fn={deleteSession}
          message='This may log you out.'
          open={alertOpen}
          setOpen={setAlertOpen}
        />
      </TableCell>
    </TableRow>
  </>
}
