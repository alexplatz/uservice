import type { FunctionComponent } from 'react'

// should be secrets managed in actuality
const BASE_URL = 'http://localhost:8001/'
enum endpoints {
  DATA = 'data'
}

// convert to TaskEither https://dev.to/ksaaskil/using-fp-ts-for-http-requests-and-validation-131c
const get = (endpoint) => async () => await fetch(`${BASE_URL}${endpoint}`).catch(e => e)
const post = (endpoint) => async () => await fetch(`${BASE_URL}${endpoint}`, { method: 'POST' })

export const getAll = get(endpoints.DATA)

export const postData = (clientId, value) => post(`${endpoints.DATA}/${clientId}/${value}`)

export const handleGet = async (res: Response) =>
  res?.ok ? console.log(await res.json()) : console.log({ 'error': res })

// export const handleGet = async (
//   res: Response,
//   Success: FunctionComponent<any>,
//   Failure: FunctionComponent
// ) =>
//   res?.ok ?
//     <Success>{await res.json()}</Success> :
//     <Failure />

