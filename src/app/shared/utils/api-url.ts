/**
 * Resuelve la URL base del API de manera dinámica e infalible para el Backoffice:
 * - En navegador (cliente): Si el dominio no es localhost (ej. centraldev.queplanhoy.com o producción),
 *   utiliza siempre la ruta relativa '/api' gestionada por el proxy inverso (Caddy).
 *   Esto garantiza que las llamadas apunten a https://centraldev.queplanhoy.com/api/...
 *   y nunca fallen por variables estáticas inlined con localhost.
 * - En desarrollo local (localhost / 127.0.0.1): apunta a NEXT_PUBLIC_API_URL o 'http://localhost:3001/api'.
 * - En SSR (servidor Node): utiliza INTERNAL_API_URL o NEXT_PUBLIC_API_URL con fallback a contenedor.
 */
export function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Si estamos en un dominio real (despliegue dev/staging/producción en VPS con Caddy)
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '/api';
    }

    // Si estamos en desarrollo local en el navegador
    if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('undefined')) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    }

    return 'http://localhost:3001/api';
  }

  // Ejecución en Servidor (SSR)
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL.replace(/\/+$/, '');
  }

  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('undefined')) {
    const configured = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    if (configured.startsWith('http://') || configured.startsWith('https://')) {
      return configured;
    }
  }

  return process.env.NODE_ENV === 'production'
    ? 'http://qph-api-dev:3001/api'
    : 'http://localhost:3001/api';
}
