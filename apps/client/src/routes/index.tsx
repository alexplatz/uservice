import { createFileRoute } from "@tanstack/react-router";

const Index = () =>
  <div className="p-2">
    <h3>Welcome to the Main page!</h3>
  </div>

export const Route = createFileRoute('/')({
  component: Index,
})

