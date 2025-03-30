import { useEffect } from "react";
import { MovieList } from "./components/MovieList";
import { useLocation } from "react-router-dom";
import { PageSEO } from "./components/PageSEO";
import { Analytics } from "@vercel/analytics/react"
import { MovieDetailsModal } from "./components/MovieDetailsModal";
import { useMovieDetails } from "./contexts/MovieDetailsContext";
import { Footer } from "./components/Footer";

function App() {
  const location = useLocation();
  const { handleMovieSelect } = useMovieDetails();
  
  // Cargar película desde URL si viene de la página de recomendaciones
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const movieId = searchParams.get('movieId');
    
    if (movieId) {
      handleMovieSelect(parseInt(movieId));
    }
  }, [location.search, handleMovieSelect]);

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <Analytics />
      <PageSEO path="/" />
      <MovieList/>
      <MovieDetailsModal />
      <Footer />
    </div>
  );
}

export default App;
