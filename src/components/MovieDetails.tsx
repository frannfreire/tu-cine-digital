import { MovieDetails as MovieDetailsType, getImageUrl, backdropSizes, posterSizes } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Calendar, Star, ArrowLeft, Heart, DollarSign, BookOpen } from "lucide-react"; // Removed 'Users'

interface MovieDetailsProps {
  movie: MovieDetailsType;
  onBack: () => void;
}

export function MovieDetails({ movie, onBack }: MovieDetailsProps) {
  const releaseDate = movie.release_date 
    ? format(new Date(movie.release_date), "d 'de' MMMM, yyyy", { locale: es })
    : "Fecha desconocida";
    
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-10"></div>
        <img 
          src={getImageUrl(movie.backdrop_path, backdropSizes.large)} 
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-backdrop.jpg";
          }}
        />
        
        {/* Back Button */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={onBack}
          className="absolute top-6 left-6 z-20 bg-black/30 hover:bg-black/50 text-white border-white/20 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex gap-8 items-end">
          {/* Poster */}
          <div className="hidden md:block w-[180px] h-[270px] rounded-xl overflow-hidden shadow-2xl border-4 border-background transform hover:scale-105 transition-transform duration-300">
            <img 
              src={getImageUrl(movie.poster_path, posterSizes.medium)} 
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-movie.jpg";
              }}
            />
          </div>
          
          {/* Title and Basic Info */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.slice(0, 3).map(genre => (
                <span 
                  key={genre.id} 
                  className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-colors"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-gray-200 text-xl mb-4 italic drop-shadow-md">
                "{movie.tagline}"
              </p>
            )}
            
            <div className="flex flex-wrap gap-6 text-gray-100">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{movie.vote_average.toFixed(1)}/10</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-300" />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-300" />
                <span>{releaseDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                <span>{Math.round(movie.popularity)} puntos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 p-8 bg-black rounded-xl shadow-lg">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Sinopsis */}
          <Card className="border border-border/30 bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="bg-primary/10 py-4 px-6 border-b border-border/20">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Sinopsis
              </h2>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed text-base">
                {movie.overview || 'Sin sinopsis disponible'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poster (Mobile) */}
          <div className="md:hidden w-[200px] h-[300px] mx-auto rounded-xl overflow-hidden shadow-xl border-4 border-background">
            <img 
              src={getImageUrl(movie.poster_path, posterSizes.medium)} 
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-movie.jpg";
              }}
            />
          </div>

          {/* Stats Card */}
          <Card className="border border-border/30 bg-card shadow-md">
            <div className="bg-primary/10 py-4 px-6 border-b border-border/20">
              <h2 className="text-xl font-bold">Estadísticas</h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-5">
                {movie.budget > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Presupuesto</p>
                      <p className="font-semibold">{formatMoney(movie.budget)}</p>
                    </div>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recaudación</p>
                      <p className="font-semibold">{formatMoney(movie.revenue)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de estreno</p>
                    <p className="font-semibold">{releaseDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valoración</p>
                    <p className="font-semibold">{movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votos)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Géneros */}
          <Card className="border border-border/30 bg-card shadow-md">
            <div className="bg-primary/10 py-4 px-6 border-b border-border/20">
              <h2 className="text-xl font-bold">Géneros</h2>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map(genre => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1.5 text-sm rounded-md border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información de producción */}
          {movie.production_companies?.length > 0 && (
            <Card className="border border-border/30 bg-card shadow-md">
              <div className="bg-primary/10 py-4 px-6 border-b border-border/20">
                <h2 className="text-xl font-bold">Producción</h2>
              </div>
              <CardContent className="p-6 space-y-4">
                {movie.production_companies.map(company => (
                  <div key={company.id} className="flex items-center gap-2">
                    {company.logo_path && (
                      <img
                        src={getImageUrl(company.logo_path, posterSizes.small)}
                        alt={company.name}
                        className="h-8 w-auto"
                      />
                    )}
                    <span>{company.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}