import { useState, useEffect } from 'react';
import { Movie, getPersonalizedRecommendations } from '@/lib/tmdb';
import { useAuth } from '@/contexts/AuthContext';
import { getFavoriteGenres } from '@/lib/supabase';
import { MovieGrid } from './MovieGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useMovieDetails } from '@/contexts/MovieDetailsContext';

export function RecommendedMovies() {
  const { handleMovieSelect } = useMovieDetails();
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGenres, setHasGenres] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendedMovies = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Obtener géneros favoritos del usuario
        const { genreIds, error } = await getFavoriteGenres(user.id);
        
        if (error) {
          console.error('Error al cargar géneros favoritos:', error);
          return;
        }
        
        setHasGenres(genreIds.length > 0);
        
        if (genreIds.length > 0) {
          // Obtener recomendaciones basadas en géneros favoritos
          const recommendations = await getPersonalizedRecommendations(genreIds);
          setMovies(recommendations.results);
        }
      } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendedMovies();
  }, [user]);

  // Si el usuario no está autenticado o no tiene géneros favoritos, no mostrar nada
  if (!user || (!isLoading && !hasGenres)) {
    return null;
  }

  // Mostrar solo las primeras 5 películas
  const displayedMovies = movies.slice(0, 5);
  
  const handleViewMore = () => {
    navigate('/recomendaciones');
  };

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Recomendado para ti</CardTitle>
        <CardDescription className="text-gray-300">
          Basado en tus géneros favoritos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MovieGrid 
          movies={displayedMovies} 
          isLoading={isLoading} 
          onMovieClick={(movie) => handleMovieSelect(movie.id)}
        />
        
        {movies.length > 5 && (
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleViewMore}
              className="bg-primary hover:bg-primary/90"
            >
              Ver más recomendaciones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}