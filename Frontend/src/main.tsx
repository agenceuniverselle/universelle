
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PropertiesProvider } from './context/PropertiesContext.tsx'
import { HelmetProvider } from 'react-helmet-async' // ✅ important
import { BiensProvider } from './context/BiensContext';
import { DarkModeProvider } from "@/context/DarkModeContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <HelmetProvider> {/* ✅ OBLIGATOIRE ici */}
        <BiensProvider>

    <PropertiesProvider>
    <DarkModeProvider>
      <App />
      </DarkModeProvider>

    </PropertiesProvider>
    </BiensProvider>

    </HelmetProvider>

  </React.StrictMode>,
)
