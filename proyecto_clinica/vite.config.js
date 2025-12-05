import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Desactivado temporalmente porque en algunas rutas con espacios el plugin provoca
// errores de transform en el dev server. Si lo necesitas, puedes volver a activar
// importando y habilitando `vueDevTools()` aquí.
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(), // desactivado temporalmente
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
