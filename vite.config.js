import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  // The app has read REACT_APP_* since CRA. Keeping the prefix means start.sh,
  // CI and the deploy's env vars don't all have to be renamed at once.
  envPrefix: 'REACT_APP_',
  server: {
    port: Number(process.env.PORT) || 3000
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true
  }
})
