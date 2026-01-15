import TestConnection from './components/TestConnection/TestConnection'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Unikuo Platform HOLAB</h1>
        <p>Plataforma para crear tiendas online</p>
      </header>
      
      <main className="app-main">
        <TestConnection />
      </main>
    </div>
  )
}

export default App
