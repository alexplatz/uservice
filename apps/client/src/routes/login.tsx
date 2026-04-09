import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createMagicLink, login } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { asQuery, queryClient } from "@/utils/query";
import { hydrateClientState } from "@/utils/dashboard";

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

    hydrateClientState({
      jwt: data.jwt,
      username: data.username,
      userId: data.userId
    })
    navigate({ to: redirect })
  }

  const emailLogin = async (email: string) => {
    const { error } = await createMagicLink(email)

    if (error) {
      setError(error.message)
    }
  }


  const googleOauthLogin = () => {
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      window.location.origin
    )}&response_type=token&client_id=${import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID!}&scope=openid%20email%20profile`;

    // use tanstack here?
    window.location.href = targetUrl;
  }

  return <div className="p-2">
    <h3>Please login</h3>
    {error ? <p>{error}</p> : null}
    <Button onClick={passkeyLogin}>
      Passkey Login
    </Button>
    <p>or</p>
    <Button onClick={googleOauthLogin}>Login with Google</Button>
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

