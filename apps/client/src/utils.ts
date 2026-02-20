export const userData = {
  name: "me",
  settings: { isAwesome: true },
  locations: [
    "Tucson, Arizona",
    "Hoh Chi Min, Vietnam",
    "Bangkok, Thailand"
  ]
}

const login = () => ({
  // create cookie 
})

const logout = () => ({
  // delete cookie
})

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))
export const getUser = () => sleep(1000).then(() => (userData))



