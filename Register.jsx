import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api'

export default function Register({ setUser }) {
  const [name, setName] = useState('Rahul Sharma')
  const [email, setEmail] = useState('rahul@example.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authAPI.register(name, email, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
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
        <h1 style={{ textAlign: 'center', fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Create your account</h1>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>Start generating professional photos</p>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 13, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
