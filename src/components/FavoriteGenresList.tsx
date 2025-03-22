import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { fetchMovieGenres, Genre } from '@/lib/tmdb';
import { getFavoriteGenresDetails } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Film, AlertCircle } from 'lucide-react';

interface FavoriteGenresListProps {
  userId?: string;
}

export function FavoriteGenresList({ userId }: FavoriteGenresListProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavoriteGenres = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Cargar todos los géneros disponibles
        const genresData = await fetchMovieGenres();
        
        // Obtener los detalles de los géneros favoritos
        const { genres: favoriteGenres, error: genresError } = await getFavoriteGenresDetails(userId, genresData.genres);
        
        if (genresError) {
          setError('Error al cargar géneros favoritos');
          console.error(genresError);
          return;
        }
        
        setGenres(favoriteGenres);
      } catch (err) {
        setError('Error inesperado al cargar géneros favoritos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavoriteGenres();
  }, [userId]);

  if (!userId) {
    return null;
  }

  return (
    <Card className="w-full mb-6 shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center">
          <Film className="mr-2 h-5 w-5 text-blue-600" />
          Tus Géneros Favoritos
        </CardTitle>
        <CardDescription>
          Estos son los géneros que has seleccionado como favoritos
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-8 w-20 bg-muted rounded-full animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        ) : genres.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            No has seleccionado ningún género favorito aún. Usa la sección de abajo para añadir tus géneros favoritos.
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-3"
          >
            {genres.map((genre, index) => (
              <motion.span
                key={genre.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.05 }
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 rounded-full text-sm font-medium shadow-sm flex items-center"
              >
                {genre.name}
              </motion.span>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}