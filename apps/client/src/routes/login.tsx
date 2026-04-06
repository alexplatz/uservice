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

  // create /user/oauth/login
  // create /user/oauth/register
  // if /user/oauth/login fails with no user, /user/oauth/register
  //   retry login
  // add 'auth_provider', 'external_refresh_token', 'external_id' to session
  // on logout, if session has external provider, attempt to oauth logout
  const googleOauthLogin = () => {
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      window.location.origin
    )}&response_type=token&client_id=${import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID!}&scope=openid%20email%20profile`;

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

