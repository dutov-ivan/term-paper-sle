import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import RootLayout from "@/RootLayout.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RootLayout>
          <App />
      </RootLayout>
    <Toaster />
  </StrictMode>,
)
