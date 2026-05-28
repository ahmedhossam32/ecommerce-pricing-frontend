import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      closeButton={true}
      pauseOnHover={true}
      draggable={true}
      toastStyle={{
        background: '#1C1F2E',
        color: '#FAF8F5',
        borderLeft: '3px solid #C9A96E',
        borderRadius: '12px',
        fontSize: '13px',
      }}
      progressStyle={{ background: '#C9A96E' }}
    />
  </StrictMode>,
)
