import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { useCounterStore } from "../store/count";
import { getAll, handleGet } from "../api/client";

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ location }) => {
    const { jwt, refreshToken } = useAuthStore.getState()

    if (!(jwt || refreshToken)) {
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
    const { user } = useAuthStore()

    const handleClick = () => increment(counter)

    return <>
      <h1>{user?.name}</h1>
      <InfoCard title="locations" elements={user?.locations} />
      <button onClick={handleClick}>{counter}</button>
      <div
        onClick={async () => handleGet(await getAll())}
      >
        click me for data (broken while drizzle borked)
      </div>
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
