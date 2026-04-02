import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createMagicLink, login } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { asQuery, queryClient } from "@/utils/query";

export const Route = createFileRoute('/login')({
  component: Login
})

function Login() {
  const { redirect } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  const passkeyLogin = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ['login'],
      queryFn: () => asQuery(login)
    })

    queryClient.setQueryData(['jwt'], data.jwt)
    queryClient.setQueryData(['id'], data.userId)
    queryClient.setQueryData(['username'], data.username)

    navigate({ to: redirect })
  }

  const emailLogin = async (email: string) => {
    const { error } = await createMagicLink(email)

    if (error) {
      setError(error.message)
    }
  }

  return <div className="p-2">
    <h3>Please login</h3>
    {error ? <p>{error}</p> : null}
    <Button onClick={passkeyLogin}>
      Passkey Login
    </Button>
    <p>or</p>
    <Field>
      <FieldLabel htmlFor='email'>Email</FieldLabel>
      <Input
        id='email'
        type='text'
        placeholder='Enter your email'
        onBlur={(e) => setEmail(e.target.value)}
      />
      <FieldDescription>
        We'll send a link to your email if it exists
      </FieldDescription>
      <Button onClick={() => emailLogin(email)}>
        Email Login
      </Button>
    </Field>
    <p>Haven't joined yet? <Link to='/register'>Sign up!</Link></p>
  </div>
}

