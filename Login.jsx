import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('seller@example.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authAPI.login(email, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'linear-gradient(135deg,#fafafa 0%,#f0f0f0 100%)'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 48, width: '100%', maxWidth: 420,
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, margin: '0 auto 20px' }}>A</div>
        <h1 style={{ textAlign: 'center', fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Welcome to Aravi AI</h1>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>AI studio for professional fashion catalogue</p>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#555' }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#555' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 13, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in to studio'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: 'var(--muted)', fontSize: 13 }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
          or
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
        </div>

        <button style={{ width: '100%', padding: 13, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Create account</Link>
        </p>
      </div>
    </div>
  )
}
