import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { userData } from '../utils.ts'

export const Route = createFileRoute('/login')({
  component: Login
})

function Login() {
  const { redirect } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { setJwt, setUser } = useAuthStore()

  const handleClick = () => {
    setJwt('testJwt')
    setUser(userData)
    // how to properly redirect?
    navigate({ to: redirect })
  }

  return <div className="p-2">
    <h3>Please login</h3>
    <button onClick={handleClick}>
      Login
    </button>
  </div>
}

