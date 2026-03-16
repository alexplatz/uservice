import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";
import { login } from "../api/client";

export const Route = createFileRoute('/login')({
  component: Login
})

function Login() {
  const { redirect } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { setJwt } = useAuthStore()
  const { setId, setUsername } = useUserStore()
  const [error, setError] = useState('')

  const handleClick = async () => {
    const { data, error } = await login()

    if (error) {
      setError(error.message)
    } else {
      const { userId, username, jwt } = data

      setJwt(jwt)
      setUsername(username)
      setId(userId)
      navigate({ to: redirect })
    }
  }

  return <div className="p-2">
    <h3>Please login</h3>
    {error ? <p>{error}</p> : null}
    <button onClick={handleClick}>
      Login
    </button>
    <p>Haven't joined yet? <Link to='/register'>Sign up!</Link></p>
  </div>
}

