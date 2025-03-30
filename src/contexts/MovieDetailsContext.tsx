import { createContext, useContext, useState } from 'react';
import { MovieDetails as MovieDetailsType, fetchMovieDetails } from '@/lib/tmdb';

type MovieDetailsContextType = {
  selectedMovie: MovieDetailsType | null;
  isLoading: boolean;
  handleMovieSelect: (movieId: number) => Promise<void>;
  handleCloseModal: () => void;
};

const MovieDetailsContext = createContext<MovieDetailsContextType | undefined>(undefined);

export function MovieDetailsProvider({ children }: { children: React.ReactNode }) {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const value = {
    selectedMovie,
    isLoading,
    handleMovieSelect,
    handleCloseModal,
  };

  return <MovieDetailsContext.Provider value={value}>{children}</MovieDetailsContext.Provider>;
}

export function useMovieDetails() {
  const context = useContext(MovieDetailsContext);
  if (context === undefined) {
    throw new Error('useMovieDetails must be used within a MovieDetailsProvider');
  }
  return context;
}