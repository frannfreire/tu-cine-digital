import { Movie } from "@/lib/tmdb";
import { MovieCard } from "@/components/MovieCard";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
  isLoading?: boolean;
}

export function MovieGrid({ movies, onMovieClick, isLoading = false }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-full max-w-xs">
            <div className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg w-full"></div>
              <div className="mt-4 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No se encontraron películas</h3>
        <p className="text-muted-foreground">Intenta con otra búsqueda o categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onClick={() => onMovieClick && onMovieClick(movie)}
        />
      ))}
    </div>
  );
}