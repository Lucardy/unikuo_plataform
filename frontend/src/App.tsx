import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import TestConnection from './components/TestConnection/TestConnection'
import './App.css'

function App() {
  const { user, loading, logout } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Cargando...</div>
      </div>
    )
  }

  // Si no está autenticado, mostrar Login o Register
  if (!user) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Unikuo Platform</h1>
          <p>Plataforma para crear tiendas online</p>
        </header>
        
        <main className="app-main">
          {showRegister ? (
            <>
              <Register />
              <div className="auth-switch">
                <p>
                  ¿Ya tienes cuenta?{' '}
                  <button 
                    onClick={() => setShowRegister(false)}
                    className="link-button"
                  >
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <Login />
              <div className="auth-switch">
                <p>
                  ¿No tienes cuenta?{' '}
                  <button 
                    onClick={() => setShowRegister(true)}
                    className="link-button"
                  >
                    Regístrate
                  </button>
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    )
  }

  // Si está autenticado, mostrar el contenido principal
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Unikuo Platform</h1>
            <p>Plataforma para crear tiendas online</p>
          </div>
          <div className="user-info">
            <span>
              {user.first_name} {user.last_name}
            </span>
            <span className="user-email">{user.email}</span>
            {user.roles && user.roles.length > 0 && (
              <span className="user-roles">
                {user.roles.map(r => r.name).join(', ')}
              </span>
            )}
            <button onClick={logout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <TestConnection />
      </main>
    </div>
  )
}

export default App
