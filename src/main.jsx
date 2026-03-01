import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { OAUTH_CONFIG } from './config/constants'
import './index.css'
import App from './App.jsx'

const googleClientId = OAUTH_CONFIG.GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <App className="container mx-auto p-4" />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
