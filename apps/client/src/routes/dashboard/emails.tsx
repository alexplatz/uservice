import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../../store/auth";

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item"

export const Route = createFileRoute('/dashboard/emails')({
  component: () => {
    const { user } = useAuthStore()
    console.log('in new component')


    return <>
      <EmailsList
        title="emails"
        emails={[{
          emailId: 1,
          email: user.email,
          verified: false
        }]}
      />
    </>
  }
})

const EmailsList = ({ title, emails }) =>
  <div>
    <h2>{title}</h2>
    <ul>
      {emails.map(({ emailId, email, verified }) =>
        <EmailsListItem emailId={emailId} email={email} verified={verified} />
      )}
    </ul>
  </div>

const EmailsListItem = ({ emailId, email, verified }) =>
  <li key={emailId}>
    <Item>
      <ItemContent>
        <ItemTitle>{email}</ItemTitle>
      </ItemContent>
      {verified ?
        <ItemActions>
          <Button onClick={() => console.log('hit')}>Verify</Button>
        </ItemActions> :
        <p>✅Verified</p>
      }
    </Item>
  </li>
