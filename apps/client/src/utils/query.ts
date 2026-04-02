import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 mins
      refetchOnWindowFocus: false
    }
  }
})

export const asQuery = async (fn, args?) => {
  const { data, error } = await fn(args)

  // probably set global error state
  if (error) { console.log(error) }

  return data
}
