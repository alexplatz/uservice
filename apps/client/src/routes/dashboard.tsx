import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { useCounterStore } from "../store/count";
import { refresh } from "../api/client";
import { isAuthed } from "../utils/dashboard";

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const { jwt } = useAuthStore.getState()

    if (!(await isAuthed(jwt))) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        }
      })
    }
  },
  component: () => {
    const { counter, increment } = useCounterStore()
    const { user, jwt } = useAuthStore()

    const handleClick = () => increment(counter)

    return <>
      <h1>{user.username}</h1>
      <InfoCard title="emails" elements={[user.email]} />
      <button onClick={handleClick}>{counter}</button>
      <button onClick={async () => console.log(await refresh(jwt))}>refresh</button>
    </>
  }
})

const InfoCard = ({ title, elements }) =>
  <div>
    <h2>{title}</h2>
    <ul>
      {elements.map(x => <li key={x}>{x}</li>)}
    </ul>
  </div>
