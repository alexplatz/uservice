import { magicLinkLogin } from "@/api/client";
import { createFileRoute } from "@tanstack/react-router";

type IndexSearch = {
  token?: string
}

const Index = () =>
  <div className="p-2">
    <h3>Welcome to the Main page!</h3>
  </div>

export const Route = createFileRoute('/')({
  component: Index,
  // convert to zod in the future
  validateSearch: (search: Record<string, unknown>): IndexSearch => ({
    token: search?.token as string
  }),
  beforeLoad: ({ search: { token } }) => {
    if (token) { magicLinkLogin(token) }
  }
})

