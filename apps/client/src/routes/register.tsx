import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { useState } from "react";
import { register } from "../api/client";
import type { User } from "../types";

export const Route = createFileRoute('/register')({
  component: Register
})

function Register() {
  const navigate = Route.useNavigate()
  const { setJwt, setUser } = useAuthStore()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const inputtedUser = {
    username,
    email
  }

  const handleClick = async (inputtedUser: User) => {
    const { data, error } = await register(inputtedUser)

    if (error) {
      setError(error.message)
    } else {
      const { email, username, jwt } = data

      setJwt(jwt)
      setUser({ username, email })
      navigate({ to: '/dashboard' })
    }
  }


  return <div className="p-2">
    <h3>Please enter a username and email</h3>
    {error ? <p>{error}</p> : null}
    <input
      type="text"
      placeholder="username"
      onBlur={(e) => setUsername(e.target.value)}
    />
    <input
      type="text"
      placeholder="email"
      onBlur={(e) => setEmail(e.target.value)}
    />

    <button onClick={() => handleClick(inputtedUser)}>
      Submit
    </button>
  </div>
}

