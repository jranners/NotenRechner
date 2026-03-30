import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StoreProvider } from './StoreContext.jsx'
import { AppConfigProvider } from './contexts/AppConfigContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppConfigProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </AppConfigProvider>
  </StrictMode>,
)
