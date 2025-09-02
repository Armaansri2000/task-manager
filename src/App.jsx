import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout as doLogout } from './features/auth/authSlice'
import { selectUser } from './features/auth/authSlice'
import Login from './pages/Login.jsx'
import Tasks from './pages/Tasks.jsx'

function Shell(){
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const logout = () => dispatch(doLogout())
  if(!user) return <Login />
  return (
    <div>
      <header className="header">
        <div className="container hstack" style={{justifyContent:'space-between'}}>
          <div className="hstack" style={{gap:'.75rem'}}>
            <h2 style={{margin:0}}>Task Manager</h2>
            <span className="small">({user.role})</span>
          </div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </header>
      <Tasks />
    </div>
  )
}

export default function App(){
  return (
      <Shell />
  )
}
