import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root')) 

root.render(
  <StrictMode>
    {/* 2) Envolvemos <App/> con <BrowserRouter> para que dentro funcionen Routes/NavLink */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)