import { createClient } from '@supabase/supabase-js';
import { Genre } from './tmdb';

// Estas variables de entorno deben ser configuradas en un archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL y Anon Key son requeridas. Por favor, configura las variables de entorno.');
}

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Tipos para la autenticación
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

// Funciones de autenticación
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user as User | null, error };
}

// Funciones para gestionar favoritos
export async function addFavoriteMovie(userId: string, movieId: number, movieData: any) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([
      { user_id: userId, movie_id: movieId, movie_data: movieData }
    ]);
  
  return { data, error };
}

export async function removeFavoriteMovie(userId: string, movieId: number) {
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .match({ user_id: userId, movie_id: movieId });
  
  return { data, error };
}

export async function getFavoriteMovies(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
}

// Funciones para gestionar calificaciones de películas
export async function rateMovie(userId: string, movieId: number, rating: number) {
  const { data, error } = await supabase
    .from('ratings')
    .upsert([
      { user_id: userId, movie_id: movieId, rating }
    ]);
  
  return { data, error };
}

export async function getMovieRating(userId: string, movieId: number) {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .match({ user_id: userId, movie_id: movieId })
    .single();
  
  return { rating: data?.rating, error };
}

// Funciones para gestionar géneros favoritos
export async function saveFavoriteGenres(userId: string, genreIds: number[]) {
  const { data, error } = await supabase
    .from('favorite_genres')
    .upsert(
      { 
        user_id: userId, 
        genre_ids: genreIds,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );
  
  return { data, error };
}

export async function getFavoriteGenres(userId: string) {
  const { data, error } = await supabase
    .from('favorite_genres')
    .select('genre_ids')
    .eq('user_id', userId)
    .single();
  
  return { genreIds: data?.genre_ids || [], error };
}

// Función para obtener los detalles de los géneros favoritos (con nombres)
export async function getFavoriteGenresDetails(userId: string, genresList: Genre[]) {
  const { genreIds, error } = await getFavoriteGenres(userId);
  
  if (error || !genreIds.length) {
    return { genres: [], error };
  }
  
  // Mapear los IDs de géneros a sus detalles completos
  const favoriteGenresDetails = genresList.filter(genre => genreIds.includes(genre.id));
  
  return { genres: favoriteGenresDetails, error: null };
}

// Función para verificar si un género específico es favorito
export async function isGenreFavorite(userId: string, genreId: number) {
  const { genreIds, error } = await getFavoriteGenres(userId);
  
  if (error) {
    return { isFavorite: false, error };
  }
  
  return { isFavorite: genreIds.includes(genreId), error: null };
}