import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Esto le permite a Vite leer variables que comiencen con FIREBASE_ (o el prefijo que prefieras)
  envPrefix: ['VITE_', 'FIREBASE_'], 
});