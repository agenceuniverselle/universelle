
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PropertiesProvider } from './context/PropertiesContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PropertiesProvider>
      <App />
    </PropertiesProvider>
  </React.StrictMode>,
)
