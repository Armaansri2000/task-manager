const USERS_KEY = 'tm_users'
const NEXT_ID_KEY = 'tm_nextUserId'

const read = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
const write = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr))

export async function listUsers(){
  return read()
}

export async function createUser(payload){
  const next = parseInt(localStorage.getItem(NEXT_ID_KEY) || '4', 10)
  const user = { id: next, ...payload }
  const all = read()
  all.push(user)
  write(all)
  localStorage.setItem(NEXT_ID_KEY, String(next+1))
  return user
}
