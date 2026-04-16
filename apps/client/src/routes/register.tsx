import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { register } from "../api/client";
import type { RegisterUser } from "../types";
import { asQuery, queryClient } from "@/utils/query";
import { hydrateClientState } from "@/utils/dashboard";

export const Route = createFileRoute('/register')({
  component: Register
})

function Register() {
  const navigate = Route.useNavigate()

  const [inputUsername, setInputUsername] = useState('')
  const [inputEmail, setInputEmail] = useState('')

  const handleClick = async (inputtedUser: RegisterUser) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['login'],
      queryFn: () => asQuery(async () => await register(inputtedUser))
    })

    hydrateClientState({
      jwt: data.jwt,
      username: data.username,
      userId: data.userId
    })

    navigate({ to: '/dashboard/account' })
  }


  return <div className="p-2">
    <h3>Please enter a username and email</h3>
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

