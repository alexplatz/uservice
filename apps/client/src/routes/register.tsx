import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { register } from "../api/client";
import type { RegisterUser } from "../types";
import { asQuery, queryClient } from "@/utils/query";
import { hydrateClientState } from "@/utils/dashboard";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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


  return <>
    <div className="flex flex-col justify-center m-auto h-screen w-[16rem]">
      <h3 className="text-2xl italic mb-2">Register</h3>
      <Field className="mb-1">
        <FieldLabel htmlFor='username'>Username</FieldLabel>
        <Input
          id='username'
          type='text'
          placeholder='ShermanHurt'
          onBlur={(e) => setInputUsername(e.target.value)}
        />
      </Field>
      <Field className="mb-1">
        <FieldLabel htmlFor='email'>Email</FieldLabel>
        <Input
          id='email'
          type='text'
          placeholder='sherman@hurt.party'
          onBlur={(e) => setInputEmail(e.target.value)}
        />
      </Field>
      <Button onClick={() => handleClick({ username: inputUsername, email: inputEmail })}>
        Submit
      </Button>
    </div>
  </>
}

