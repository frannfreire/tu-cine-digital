import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Movie, fetchPopularMovies, fetchTrendingMovies } from '@/lib/tmdb';
import { MovieGrid } from '@/components/MovieGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export function AllMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const movieType = searchParams.get('type') || 'popular';

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        let result;
        if (movieType === 'popular') {
          result = await fetchPopularMovies(currentPage);
        } else {
          // Para tendencias, asumimos que es 'trending'
          result = await fetchTrendingMovies('week');
        }
        setMovies(result.results);
        setTotalPages(result.total_pages);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [movieType, currentPage]);

  const handleMovieSelect = (movieId: number) => {
    // Navegar a la página principal con el ID de la película seleccionada
    navigate(`/?movieId=${movieId}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing page
      window.scrollTo(0, 0);
    }
  };

  return (
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
          <CardTitle className="text-3xl text-white">
            {movieType === 'popular' ? 'Todas las películas populares' : 'Todas las tendencias'}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {movieType === 'popular' 
              ? 'Explora las películas más populares del momento' 
              : 'Descubre las películas que son tendencia esta semana'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MovieGrid 
            movies={movies} 
            isLoading={isLoading} 
            onMovieClick={(movie) => handleMovieSelect(movie.id)}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-black/30 text-white hover:bg-black/50 border-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                {/* Mostrar páginas anteriores */}
                {currentPage > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="text-white hover:bg-black/30"
                  >
                    1
                  </Button>
                )}
                
                {currentPage > 3 && <span className="text-white">...</span>}
                
                {currentPage > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="text-white hover:bg-black/30"
                  >
                    {currentPage - 1}
                  </Button>
                )}
                
                {/* Página actual */}
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {currentPage}
                </Button>
                
                {/* Mostrar páginas siguientes */}
                {currentPage < totalPages && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="text-white hover:bg-black/30"
                  >
                    {currentPage + 1}
                  </Button>
                )}
                
                {currentPage < totalPages - 2 && <span className="text-white">...</span>}
                
                {currentPage < totalPages - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="text-white hover:bg-black/30"
                  >
                    {totalPages}
                  </Button>
                )}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-black/30 text-white hover:bg-black/50 border-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}