import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Expone el servidor en la red local (equivalente a '0.0.0.0')
    port: 5173, // Puerto por defecto
    open: true, // Abre el navegador automáticamente
  },
})
