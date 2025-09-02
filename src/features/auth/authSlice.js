import { createSlice } from '@reduxjs/toolkit'

const USERS_KEY = 'tm_users'
const NEXT_ID_KEY = 'tm_nextUserId'
const CURRENT_KEY = 'tm_currentUser'

function seedUsers() {
  if (!localStorage.getItem(USERS_KEY)) {
    const base = [
      { id:1, name:'Admin',   email:'admin@example.com',   password:'admin123',   role:'admin' },
      { id:2, name:'Manager', email:'manager@example.com', password:'manager123', role:'manager' },
      { id:3, name:'Member',  email:'member@example.com',  password:'member123',  role:'member' },
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(base))
    localStorage.setItem(NEXT_ID_KEY, '4')
  }
}

seedUsers()

const initialState = {
  user: JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      const u = users.find(x => x.email === email && x.password === password)
      if (u) {
        state.user = { id: u.id, name: u.name, email: u.email, role: u.role }
        localStorage.setItem(CURRENT_KEY, JSON.stringify(state.user))
      } else {
        // keep state.user as is
      }
    },
    logout: (state) => {
      state.user = null
      localStorage.removeItem(CURRENT_KEY)
    }
  }
})

export const { login, logout } = authSlice.actions

export const selectUser = (state) => state.auth.user

export default authSlice.reducer
