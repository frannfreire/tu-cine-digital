import { useState, useEffect } from "react";
import { MovieDetails } from "./components/MovieDetails";
import { MovieList } from "./components/MovieList";
import { fetchMovieDetails, MovieDetails as MovieDetailsType } from "./lib/tmdb";
import { X } from "lucide-react";
import { Button } from "./components/ui/button";
import { useLocation } from "react-router-dom";
import { PageSEO } from "./components/PageSEO";
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const handleMovieSelect = async (movieId: number) => {
    setIsLoading(true);
    try {
      const movieDetails = await fetchMovieDetails(movieId);
      setSelectedMovie(movieDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar película desde URL si viene de la página de recomendaciones
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const movieId = searchParams.get('movieId');
    
    if (movieId && !selectedMovie) {
      handleMovieSelect(parseInt(movieId));
    }
  }, [location.search]);

  const handleBack = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Analytics />
      <PageSEO path="/" />
      <MovieList onMovieSelect={handleMovieSelect} />
      
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card p-8 rounded-xl shadow-2xl">
            <p className="text-lg">Cargando detalles de la película...</p>
          </div>
        </div>
      )}

      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Fondo desenfocado */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={handleBack}
          />
          
          {/* Botón de cerrar */}
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-none"
            onClick={handleBack}
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Contenido del modal */}
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MovieDetails movie={selectedMovie} onBack={handleBack} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
