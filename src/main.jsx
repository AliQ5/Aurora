import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { LocaleProvider } from './context/LocaleContext.jsx'
import { EventStoreProvider } from './context/EventStore.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <EventStoreProvider>
        <LocaleProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </LocaleProvider>
      </EventStoreProvider>
    </SettingsProvider>
  </StrictMode>,
)
