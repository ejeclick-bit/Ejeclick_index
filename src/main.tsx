import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './styles/index.css'
import App from './App.tsx'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
  replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
  replaysOnErrorSampleRate: 1.0,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={({ error }) => (
      <div style={{ padding: '2rem', color: 'red', background: 'black', minHeight: '100vh' }}>
        <h1>Error en la aplicación</h1>
        <pre>{String((error as Error)?.stack || error)}</pre>
      </div>
    )}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
