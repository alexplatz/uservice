import { getGoogleOauthUser, loginOauth, magicLinkLogin, registerOauth } from "@/api/client";
import type { emailData } from "@/types";
import { getOauthAccessToken, hydrateClientState } from "@/utils/dashboard";
import { queryClient } from "@/utils/query";
import type { QueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

type IndexSearch = {
  token?: string
}

const Index = () => {
  const [error, _setError] = useState('')

  return (
    <div>
      {error ? <p>{error}</p> : null}
      <div className="p-2">
        <h3>Welcome to the Main page!</h3>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
  // convert to zod in the future
  validateSearch: (search: Record<string, unknown>): IndexSearch => ({
    token: search.token as string,
  }),
  beforeLoad: async ({ search: { token } }) => {
    const oauthAccessToken = getOauthAccessToken()
    if (token) {
      const { data, error } = await magicLinkLogin(token)

      if (error) {
        console.log(error.message)
      } else {
        hydrateClientState({
          jwt: data.jwt,
          username: data.username,
          userId: data.userId
        })
        // queryClient.setQueryData(['emails'], email)

        throw redirect({
          to: '/dashboard'
        })
      }
    }
    // add 'auth_provider', 'external_refresh_token', 'external_id' to session
    // on logout, if session has external provider, attempt to oauth logout
    if (oauthAccessToken) {
      const user = await getGoogleOauthUser(oauthAccessToken)
      console.log(user)

      if (user) {
        const { data } = await loginOauth({
          oauthAccessToken,
          email: user.email
        })

        if (data) {
          hydrateClientState({
            jwt: data.jwt,
            username: data.username,
            userId: data.userId
          })
          console.log(data)

        } else {
          const data = await registerOauth({
            oauthAccessToken,
            email: user.email,
            username: user.username
          })
          hydrateClientState({
            jwt: data.jwt,
            username: data.username,
            userId: data.userId
          })
          console.log(data)
        }
      }
    }
  }
})

