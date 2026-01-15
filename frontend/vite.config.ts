import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Habilitar polling para detectar cambios en volúmenes Docker (Windows)
      usePolling: true,
      interval: 1000, // Revisar cambios cada segundo
    },
    host: '0.0.0.0', // Permitir acceso desde fuera del contenedor
    port: 5173,
  },
})
