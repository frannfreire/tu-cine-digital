// Utilidades para manejar proveedores de streaming

// Mapeo de IDs de proveedores de TMDB a sus URLs base
interface ProviderUrlMap {
  [providerId: number]: string;
}

// URLs base para proveedores populares
export const providerBaseUrls: ProviderUrlMap = {
  // Netflix
  8: "https://www.netflix.com/search?q=",
  // Amazon Prime Video
  9: "https://www.primevideo.com/search/ref=atv_sr_sug_10?phrase=",
  // Disney+
  337: "https://www.disneyplus.com/search?q=",
  // HBO Max / Max
  384: "https://play.max.com/search?q=",
  // Apple TV+
  350: "https://tv.apple.com/search?term=",
  // Movistar+
  149: "https://ver.movistarplus.es/busqueda/?texto=",
  // Filmin
  63: "https://www.filmin.es/buscar/",
  // Rakuten TV
  35: "https://rakuten.tv/es/search?content=movie&search=",
  // Google Play Movies
  3: "https://play.google.com/store/search?q=",
  // YouTube Premium
  188: "https://www.youtube.com/results?search_query=",
  // Crunchyroll
  283: "https://www.crunchyroll.com/search?q=",
  // Paramount+
  531: "https://www.paramountplus.com/search/?q=",
  // SkyShowtime
  1773: "https://www.skyshowtime.com/search?term=",
  // Atresplayer
  2357: "https://www.atresplayer.com/buscador/?text=",
  // RTVE Play
  541: "https://www.rtve.es/play/buscar/?q="
};

/**
 * Genera una URL directa para un proveedor de streaming específico
 * @param providerId ID del proveedor en TMDB
 * @param providerName Nombre del proveedor
 * @param movieTitle Título de la película para búsqueda
 * @param tmdbFallbackUrl URL de fallback de TMDB
 * @returns URL directa al proveedor o URL de fallback
 */
export function getDirectProviderUrl(
  providerId: number,
  providerName: string,
  movieTitle: string,
  tmdbFallbackUrl: string
): string {
  // Si tenemos una URL base para este proveedor, construimos la URL de búsqueda
  if (providerBaseUrls[providerId]) {
    return `${providerBaseUrls[providerId]}${encodeURIComponent(movieTitle)}`;
  }
  
  // Intentamos construir una URL basada en el nombre del proveedor
  const normalizedName = providerName.toLowerCase().replace(/\s+/g, '');
  
  // Algunos proveedores adicionales que podrían no estar en el mapeo por ID
  switch (normalizedName) {
    case 'netflix':
      return `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`;
    case 'amazonprimevideo':
    case 'primevideo':
      return `https://www.primevideo.com/search/ref=atv_sr_sug_10?phrase=${encodeURIComponent(movieTitle)}`;
    case 'disneyplus':
    case 'disney+':
      return `https://www.disneyplus.com/search?q=${encodeURIComponent(movieTitle)}`;
    case 'hbomax':
    case 'max':
      return `https://play.max.com/search?q=${encodeURIComponent(movieTitle)}`;
    case 'appletv+':
    case 'appletv':
      return `https://tv.apple.com/search?term=${encodeURIComponent(movieTitle)}`;
    default:
      // Si no podemos construir una URL directa, usamos la URL de TMDB como fallback
      return tmdbFallbackUrl;
  }
}