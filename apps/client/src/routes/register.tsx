import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";
import { useState } from "react";
import { register } from "../api/client";
import type { RegisterUser } from "../types";

export const Route = createFileRoute('/register')({
  component: Register
})

function Register() {
  const navigate = Route.useNavigate()
  const { setJwt } = useAuthStore()
  const { setId, setUsername } = useUserStore()

  const [inputUsername, setInputUsername] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [error, setError] = useState('')

  const handleClick = async (inputtedUser: RegisterUser) => {
    const { data, error } = await register(inputtedUser)

    if (error) {
      setError(error.message)
    } else {
      const { userId, username, jwt } = data

      setJwt(jwt)
      setId(userId)
      setUsername(username)
      navigate({ to: '/dashboard' })
    }
  }


  return <div className="p-2">
    <h3>Please enter a username and email</h3>
    {error ? <p>{error}</p> : null}
    <input
      type="text"
      placeholder="username"
      onBlur={(e) => setInputUsername(e.target.value)}
    />
    <input
      type="text"
      placeholder="email"
      onBlur={(e) => setInputEmail(e.target.value)}
    />

    <button onClick={() => handleClick({ username: inputUsername, email: inputEmail })}>
      Submit
    </button>
  </div>
}

