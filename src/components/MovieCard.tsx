import { Movie, getImageUrl, posterSizes } from "../lib/tmdb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addFavoriteMovie, removeFavoriteMovie } from "../lib/supabase";
import { useEffect } from "react";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number, isFavorite: boolean) => void;
}

export function MovieCard({ movie, onClick, isFavorite: propIsFavorite, onToggleFavorite }: MovieCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(propIsFavorite || false);
  const [isLoading, setIsLoading] = useState(false);
  
  const releaseDate = movie.release_date 
    ? format(new Date(movie.release_date), "d 'de' MMMM, yyyy", { locale: es })
    : "Fecha desconocida";
    
  // Verificar si la película está en favoritos al cargar el componente
  useEffect(() => {
    setIsFavorite(propIsFavorite || false);
  }, [propIsFavorite]);
  
  // Función para manejar el toggle de favoritos
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se propague al onClick del Card
    
    if (!user) return; // No hacer nada si no hay usuario autenticado
    
    setIsLoading(true);
    try {
      if (isFavorite) {
        // Eliminar de favoritos
        const { error } = await removeFavoriteMovie(user.id, movie.id);
        if (error) {
          console.error('Error al eliminar de favoritos:', error);
          return;
        }
      } else {
        // Añadir a favoritos
        const { error } = await addFavoriteMovie(user.id, movie.id, movie);
        if (error) {
          console.error('Error al añadir a favoritos:', error);
          return;
        }
      }
      
      // Actualizar estado local
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      
      // Notificar al componente padre si existe la función
      if (onToggleFavorite) {
        onToggleFavorite(movie.id, newFavoriteState);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };
    
  return (
    <Card 
      className="w-full max-w-xs overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img 
          src={getImageUrl(movie.poster_path, posterSizes.medium)} 
          alt={movie.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-movie.jpg";
          }}
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
        
        {user && (
          <button 
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`absolute top-2 left-2 p-2 rounded-full ${isFavorite ? 'bg-primary text-white' : 'bg-black/70 text-white'} transition-colors`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{movie.title}</CardTitle>
        <CardDescription>{releaseDate}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm line-clamp-2">{movie.overview || "Sin descripción disponible."}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}>
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}