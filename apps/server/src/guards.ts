import { checkJwts } from "./utils";

export const guardJwts = async ({ status, refresh, access, cookie: { auth }, bearer }) =>
  await checkJwts({ status, refresh, access, auth, bearer })
