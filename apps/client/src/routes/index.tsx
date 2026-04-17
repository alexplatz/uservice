import { handleGoogleOauth, handleToken, isGoogleOauthRedirect } from "@/utils/dashboard";
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
    if (token) {
      handleToken(token)

      throw redirect({
        to: '/dashboard/account'
      })
    }
    else if (isGoogleOauthRedirect()) {
      handleGoogleOauth()

      throw redirect({
        to: '/dashboard/account'
      })
    } else {
      throw redirect({
        to: '/login'
      })
    }
  }
})

