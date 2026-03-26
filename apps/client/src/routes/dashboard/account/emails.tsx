import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "../../../store/user"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item"
import { getEmails, verifyEmail } from "../../../api/client";
import type { emailData } from "@/types";

export const Route = createFileRoute('/dashboard/account/emails')({
  beforeLoad: async () => {
    const { id, emails } = useUserStore.getState()

    if (!emails?.length) {
      const { data, err } = await getEmails(id)
      if (err) {
        console.log(err)
      } else {
        useUserStore.setState({ emails: data })
      }
    }
  },
  component: () => {
    const { emails } = useUserStore()

    return <>{
      emails?.length ?
        <EmailsList
          title="emails"
          emails={emails}
        /> :
        <p>No emails... 🤔</p>
    }</>
  }
})

const EmailsList = ({ title, emails }: { title: string, emails: emailData[] }) =>
  <div>
    <h2>{title}</h2>
    <ul>
      {emails.map(({ id, email, isPrimary, verified }: emailData) =>
        <EmailsListItem id={id} email={email} isPrimary={isPrimary} verified={verified} />
      )}
    </ul>
  </div>

const EmailsListItem = ({ id, email, isPrimary, verified }: emailData) =>
  <li key={id}>
    <Item>
      <ItemContent>
        <ItemTitle>{email}</ItemTitle>
      </ItemContent>
      <ItemContent>{
        isPrimary ?
          null :
          <Button onClick={() => console.log('TODO')}>Make Primary</Button>
      }</ItemContent>
      {!verified ?
        <ItemActions>
          <Button onClick={async () => await verifyEmail(email)}>Verify</Button>
        </ItemActions> :
        <p>✅Verified</p>
      }
    </Item>
  </li>
