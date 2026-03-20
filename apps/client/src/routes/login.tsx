import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";
import { createMagicLink, login, verifyEmail } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

export const Route = createFileRoute('/login')({
  component: Login
})

function Login() {
  const { redirect } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { setJwt } = useAuthStore()
  const { setId, setUsername } = useUserStore()
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  const passkeyLogin = async () => {
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

