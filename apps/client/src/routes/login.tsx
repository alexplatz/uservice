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
    redirect ?
      navigate({ to: redirect }) :
      navigate({ to: '/dashboard/account' })
  }

  const emailLogin = async (email: string) => {
    const { error } = await createMagicLink(email)

    if (error) {
      setError(error.message)
    }
  }

  const googleOauthLogin = () => {
    const googleOauthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    // Function to generate the OAuth URL and redirect the user
    const state = crypto.randomUUID(); // Generate a CSRF token
    localStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID!,
      redirect_uri: import.meta.env.VITE_CLIENT_URL!,
      access_type: "offline",
      response_type: "code",
      state: state,
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
    })

    const googleOauthConsentUrl = `${googleOauthUrl}?${params.toString()}`;
    window.location.href = googleOauthConsentUrl;
  }

  return <>
    <div className="flex flex-col justify-center m-auto h-screen">
      {error ? <p>{error}</p> : null}
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
      <Button onClick={passkeyLogin}>
        Passkey Login
      </Button>
      <Button onClick={googleOauthLogin}>Google Login</Button>
      <p>Haven't joined yet? <Link to='/register'>Sign up!</Link></p>
    </div>
  </>
}

