import { useEffect, useState } from "react";
import { fetchMovieGenres, Genre } from "@/lib/tmdb";

interface GenreFilterProps {
  onSelectGenre: (genreId: number | null) => void;
  selectedGenreId: number | null;
}

export function GenreFilter({ onSelectGenre, selectedGenreId }: GenreFilterProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMovieGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error loading genres:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse min-w-20"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 w-full">
      <button
        onClick={() => onSelectGenre(null)}
        className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
          selectedGenreId === null
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80"
        }`}
      >
        Todos
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
            selectedGenreId === genre.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}