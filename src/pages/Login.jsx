import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    dispatch(login({ email, password }))
    const ok = JSON.parse(localStorage.getItem('tm_currentUser') ? 'true' : 'false')
    if (!ok) setError('Wrong credentials. Use the demo credentials shown below.')
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="card-head"><h2>Login</h2></div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="vstack gap-3">
            <div className="vstack">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="vstack">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
            <button className="btn primary" type="submit">Login</button>
          </form>

          <div className="card" style={{ marginTop: '1rem', padding: '.75rem' }}>
            <strong>Use demo credentials</strong>
            <div>Admin — <code>admin@example.com</code> / <code>admin123</code></div>
            <div>Manager — <code>manager@example.com</code> / <code>manager123</code></div>
            <div>Member — <code>member@example.com</code> / <code>member123</code></div>
          </div>
        </div>
      </div>
    </div>
  )
}
