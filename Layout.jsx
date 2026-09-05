import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Image, LayoutTemplate, Settings, LogOut, Zap, User } from 'lucide-react'

export default function Layout({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/catalogue', icon: Image, label: 'My Catalogue' },
    { to: '/templates', icon: LayoutTemplate, label: 'Templates' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: '#fff', borderRight: '1px solid var(--border)',
        height: '100vh', position: 'fixed', display: 'flex', flexDirection: 'column',
        padding: '20px 16px', zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 20px', marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>A</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Aravi AI</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 0.5 }}>FASHION STUDIO</div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, padding: '12px 12px 8px' }}>Studio</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 8, fontSize: 14, color: isActive ? '#fff' : '#555',
            background: isActive ? 'var(--primary)' : 'transparent', textDecoration: 'none',
            marginBottom: 2, transition: 'all 0.15s'
          })}>
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f0f0f0', borderRadius: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Credits</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{user?.credits || 0}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 600 }}>
              {user?.avatar || <User size={16} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user?.plan || 'Free'} Plan</div>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 260, padding: '24px 32px', maxWidth: 1400 }}>
        <Outlet />
      </main>
    </div>
  )
}
