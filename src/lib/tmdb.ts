// TMDB API Configuration

// API Key - Obtenida desde variables de entorno
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Tamaños de imágenes disponibles
export const posterSizes = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original"
};

export const backdropSizes = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original"
};

// Función para construir URLs de imágenes
export const getImageUrl = (path: string, size = posterSizes.medium) => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Tipos para las películas
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

// Interfaces para créditos
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

// Interfaces para videos
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Videos {
  results: Video[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string }[];
  credits?: Credits;
  videos?: Videos;
  vote_count: number; // Add this line
}

// Tipos para géneros
export interface Genre {
  id: number;
  name: string;
}

// Funciones para obtener datos de la API
export async function fetchPopularMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`
  );
  return response.json();
}

export async function fetchTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<{ results: Movie[]; total_pages: number }> {
  const response = await fetch(
    `${BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  return response.json();
}

export async function fetchMoviesByGenre(genreId: number, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&with_genres=${genreId}&page=${page}`
  );
  return response.json();
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos`
  );
  return response.json();
}

export async function fetchSimilarMovies(movieId: number): Promise<{ results: Movie[] }> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  return response.json();
}

export async function fetchMovieGenres(): Promise<{ genres: Genre[] }> {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  return response.json();
}

export async function searchMovies(query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`
  );
  return response.json();
}

// Función para obtener recomendaciones personalizadas basadas en géneros y películas favoritas
export async function getPersonalizedRecommendations(
  favoriteGenres: number[] = [], 
  favoriteMovies: number[] = []
  // Remove mood if not used
): Promise<{ results: Movie[] }> {
  // Si tenemos películas favoritas, obtenemos recomendaciones basadas en ellas
  if (favoriteMovies.length > 0) {
    const randomMovieId = favoriteMovies[Math.floor(Math.random() * favoriteMovies.length)];
    const response = await fetch(
      `${BASE_URL}/movie/${randomMovieId}/recommendations?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    return response.json();
  }
  
  // Si tenemos géneros favoritos, obtenemos películas de esos géneros
  if (favoriteGenres.length > 0) {
    const randomGenreId = favoriteGenres[Math.floor(Math.random() * favoriteGenres.length)];
    return fetchMoviesByGenre(randomGenreId);
  }
  
  // Si no tenemos preferencias, devolvemos películas populares
  return fetchPopularMovies();
}

// Función para manejar errores de la API
export function handleApiError(error: any): string {
  console.error("API Error:", error);
  if (error.status_message) {
    return `Error: ${error.status_message}`;
  }
  return "Ha ocurrido un error al comunicarse con la API de TMDB";
}

// Función para obtener películas por año
export async function fetchMoviesByYear(year: number, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&primary_release_year=${year}&page=${page}`
  );
  return response.json();
}

// Función para obtener películas mejor valoradas
export async function fetchTopRatedMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`
  );
  return response.json();
}