import { useState, useEffect } from 'react';
import { Movie, getPersonalizedRecommendations } from '@/lib/tmdb';
import { useAuth } from '@/contexts/AuthContext';
import { getFavoriteGenres } from '@/lib/supabase';
import { MovieGrid } from '@/components/MovieGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMovieDetails } from '@/contexts/MovieDetailsContext';
import { MovieDetailsModal } from '@/components/MovieDetailsModal';

export function RecommendationsPage() {
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

  // Si el usuario no está autenticado o no tiene géneros favoritos, redirigir a la página principal
  useEffect(() => {
    if (!isLoading && (!user || !hasGenres)) {
      navigate('/');
    }
  }, [isLoading, user, hasGenres, navigate]);

  const { handleMovieSelect } = useMovieDetails();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <MovieDetailsModal />
      <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        className="mb-6 flex items-center gap-2 bg-black/30 text-white hover:bg-black/50 border-none"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Button>

      <Card className="bg-black/30 backdrop-blur-sm border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-white">Todas las recomendaciones para ti</CardTitle>
          <CardDescription className="text-gray-300">
            Películas personalizadas basadas en tus géneros favoritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MovieGrid 
            movies={movies} 
            isLoading={isLoading} 
            onMovieClick={(movie) => handleMovieSelect(movie.id)}
          />
        </CardContent>
      </Card>
    </div>
    </>
  );
}