import { Movie, getImageUrl, posterSizes } from "@/lib/tmdb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const releaseDate = movie.release_date 
    ? format(new Date(movie.release_date), "d 'de' MMMM, yyyy", { locale: es })
    : "Fecha desconocida";
    
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