import { magicLinkLogin } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import type { emailData } from "@/types";
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
    token: search?.token as string
  }),
  beforeLoad: async ({ search: { token } }) => {
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
        console.log(data)

        useAuthStore.setState({ jwt })
        useUserStore.setState({
          username,
          id: userId,
          emails: updateVerifiedCache(useUserStore.getState().emails, email)
        })

        throw redirect({
          to: '/dashboard'
        })
      }
    }
  }
})

const updateVerifiedCache = (emails: emailData[], verifiedEmail: undefined | emailData) =>
  verifiedEmail ? [
    ...emails.filter(email => email.email !== verifiedEmail.email),
    verifiedEmail
  ] : emails
