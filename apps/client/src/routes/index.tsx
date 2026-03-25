import { magicLinkLogin } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

type IndexSearch = {
  token?: string
}

const Index = () => {
  const [error, setError] = useState('')

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
        const { userId, username, jwt } = data

        useAuthStore.setState({ jwt })
        useUserStore.setState({ username, id: userId })

        throw redirect({
          to: '/dashboard'
        })
      }
    }
  }
})

