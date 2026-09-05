import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Catalogue from './pages/Catalogue'
import Templates from './pages/Templates'
import Settings from './pages/Settings'
import Layout from './components/Layout'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Layout user={user} setUser={setUser} /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard user={user} setUser={setUser} />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="templates" element={<Templates />} />
        <Route path="settings" element={<Settings user={user} />} />
      </Route>
    </Routes>
  )
}

export default App
