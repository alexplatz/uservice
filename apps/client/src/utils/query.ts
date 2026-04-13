import { getLogger } from "@logtape/logtape";
import { QueryClient } from "@tanstack/react-query"

const logger = getLogger(["template-client", "query-utils"]);

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
  if (error) { logger.error`${error}` }

  return data
}

export const mutate = async ({ queryFn, params, queryKey, handler, onSuccess }: Mutate) => {
  const { data, error } = params ?
    await queryFn(params) :
    await queryFn()

  if (error) {
    logger.error`${{
      status: error.status,
      message: error.value.summary
    }}`
  } else {
    queryKey ?
      handler ? queryClient.setQueryData(queryKey, handler) :
        onSuccess ? queryClient.setQueryData(queryKey, onSuccess(data)) :
          null :
      null
  }
}
type Mutate = {
  queryFn: (...params: any) => Promise<{ data: any, error: any }>,
  params?: any,
  queryKey?: (string | number)[]
  handler?: (oldData: any) => void
  onSuccess?: (data: any) => (oldData: any) => void
}

