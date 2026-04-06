import { magicLinkLogin } from "@/api/client";
import type { emailData } from "@/types";
import { getOauthAccessToken } from "@/utils/dashboard";
import { queryClient } from "@/utils/query";
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
        const {
          userId,
          username,
          jwt,
          email
        }: {
          userId: string,
          username: string,
          jwt: string,
          email: undefined | emailData
        } = data

        queryClient.setQueryData(['jwt'], jwt)
        queryClient.setQueryData(['username'], username)
        queryClient.setQueryData(['id'], userId)
        queryClient.setQueryData(['emails'], email)

        throw redirect({
          to: '/dashboard'
        })
      }
    }
    if (oauthAccessToken) {
      const googleOauthUrlEmail = "https://www.googleapis.com/oauth2/v2/userinfo"
      const res = await fetch(googleOauthUrlEmail, {
        headers: {
          Authorization: `Bearer ${oauthAccessToken}`,
          Accept: "application/json"
        }
      })
      const user = res.status === 200 ?
        await res.json().then(json => ({
          email: json.email,
          username: json.name
        })) :
        undefined
      console.log(user)
    }
  }
})
