import { useState, useEffect } from "react";
import { fetchPopularMovies, fetchTrendingMovies, searchMovies, getImageUrl, posterSizes, Movie } from "../lib/tmdb";
import { Search, Star, Film, TrendingUp } from "lucide-react";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { RecommendedMovies } from "@/components/RecommendedMovies";

interface MovieListProps {
  onMovieSelect: (movieId: number) => void;
}

export function MovieList({ onMovieSelect }: MovieListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        let result;
        if (activeTab === "popular") {
          result = await fetchPopularMovies();
        } else {
          result = await fetchTrendingMovies();
        }
        setMovies(result.results);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [activeTab]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setMovies(results.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
          <img 
            src="https://image.tmdb.org/t/p/original/rMvPXy8PUjj1o8o1pzgQbdNCsvj.jpg" 
            alt="Cinema Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Tu Cine Digital
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Descubre el fascinante mundo del cine con nuestra colección de películas
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
          </form>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
        {/* Recommended Movies Section */}
        <RecommendedMovies onMovieSelect={onMovieSelect} />
        
        {/* Tabs */}
        <div className="flex justify-center mb-12 mt-12">
          <div className="inline-flex bg-white/5 backdrop-blur-md rounded-full p-1">
            <button
              onClick={() => setActiveTab("popular")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                activeTab === "popular" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Film className="h-4 w-4" />
              <span>Populares</span>
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                activeTab === "trending" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Tendencias</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <MovieGridSkeleton count={15} />
        ) : movies.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No se encontraron películas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
                onClick={() => onMovieSelect(movie.id)}
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={movie.poster_path ? getImageUrl(movie.poster_path, posterSizes.medium) : "/placeholder-movie.jpg"}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-movie.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center backdrop-blur-sm">
                    <Star className="h-3 w-3 mr-1 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-white line-clamp-2 text-shadow">{movie.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {movie.release_date?.split('-')[0] || 'Sin fecha'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}