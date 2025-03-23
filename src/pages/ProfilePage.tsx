import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '../lib/supabase';
import { FavoriteGenresSection } from '../components/FavoriteGenresSection';
import { FavoriteGenresList } from '../components/FavoriteGenresList';
import { getFavoriteMovies, removeFavoriteMovie } from '../lib/supabase';
import { User, Film, Heart, Settings, LogOut, Clock, Trash2 } from 'lucide-react';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageUrl, posterSizes } from '@/lib/tmdb';

export function ProfilePage() {
  const { user, isLoading, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [activeSection, setActiveSection] = useState('perfil');
  const navigate = useNavigate();

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      loadFavorites();
    }
  }, [user]);

  // Cargar películas favoritas
  const loadFavorites = async () => {
    if (!user) return;
    
    setIsLoadingFavorites(true);
    try {
      const { data, error } = await getFavoriteMovies(user.id);
      if (error) {
        console.error('Error al cargar favoritos:', error);
      } else {
        setFavorites(data || []);
      }
    } catch (err) {
      console.error('Error inesperado al cargar favoritos:', err);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // Actualizar perfil de usuario
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) {
        setUpdateError(error.message || 'Error al actualizar el perfil');
      } else {
        setUpdateSuccess(true);
      }
    } catch (err) {
      setUpdateError('Error inesperado al actualizar el perfil');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded-md w-3/4"></div>
          <div className="h-64 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-[calc(100vh-4rem)]">
      {/* Encabezado del Dashboard */}
      <div className="mb-10 max-w-3xl mx-auto lg:mx-0">
        <SparklesText 
          text="Tu Dashboard de Cine" 
          className="text-4xl md:text-5xl mb-4 text-center lg:text-left font-bold"
          colors={{ first: "#3b82f6", second: "#8b5cf6" }}
        />
        <p className="text-muted-foreground text-center lg:text-left text-lg">Bienvenido de nuevo, <span className="font-medium text-foreground">{fullName || 'Cinéfilo'}</span>. Gestiona tu perfil y descubre tus estadísticas.</p>
      </div>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar - Perfil y Navegación */}
        <div className="lg:col-span-3">
          <div className="space-y-6 sticky top-6">
            {/* Tarjeta de Perfil */}
            <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="px-6 pb-6 pt-0 relative">
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold">{fullName || 'Usuario'}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{email}</p>
                </div>
              </div>
              <CardFooter className="border-t bg-muted/50 flex justify-between py-4 px-6">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <Settings size={16} className="mr-2" /> Ajustes
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-destructive transition-colors duration-200"
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                >
                  <LogOut size={16} className="mr-2" /> Salir
                </Button>
              </CardFooter>
            </Card>

            {/* Menú de Navegación */}
            <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg font-bold text-gray-800">Navegación</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-0.5 p-0">
                <Button 
                  variant="ghost" 
                  className={`justify-start pl-6 py-5 rounded-none border-l-2 ${activeSection === 'perfil' ? 'border-primary bg-blue-50/50 text-primary font-medium' : 'border-transparent hover:border-primary/70 hover:bg-blue-50/30'} transition-all duration-200`}
                  onClick={() => setActiveSection('perfil')}
                >
                  <User size={18} className="mr-3" /> Perfil
                </Button>
                <Button 
                  variant="ghost" 
                  className={`justify-start pl-6 py-5 rounded-none border-l-2 ${activeSection === 'favoritos' ? 'border-primary bg-blue-50/50 text-primary font-medium' : 'border-transparent hover:border-primary/70 hover:bg-blue-50/30'} transition-all duration-200`}
                  onClick={() => setActiveSection('favoritos')}
                >
                  <Heart size={18} className="mr-3" /> Favoritos
                </Button>
                <Button 
                  variant="ghost" 
                  className={`justify-start pl-6 py-5 rounded-none border-l-2 ${activeSection === 'recomendaciones' ? 'border-primary bg-blue-50/50 text-primary font-medium' : 'border-transparent hover:border-primary/70 hover:bg-blue-50/30'} transition-all duration-200`}
                  onClick={() => setActiveSection('recomendaciones')}
                >
                  <Film size={18} className="mr-3" /> Recomendaciones
                </Button>
                <Button 
                  variant="ghost" 
                  className={`justify-start pl-6 py-5 rounded-none border-l-2 ${activeSection === 'historial' ? 'border-primary bg-blue-50/50 text-primary font-medium' : 'border-transparent hover:border-primary/70 hover:bg-blue-50/30'} transition-all duration-200`}
                  onClick={() => setActiveSection('historial')}
                >
                  <Clock size={18} className="mr-3" /> Historial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="lg:col-span-9">
          {/* Sección de perfil */}
          {activeSection === 'perfil' && (
            <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg font-bold text-gray-800">Tu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  
                  {updateError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                      {updateError}
                    </div>
                  )}
                  
                  {updateSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Perfil actualizado correctamente
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                  >
                    {isUpdating ? 'Actualizando...' : 'Actualizar perfil'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          
          {/* Sección de favoritos */}
          {activeSection === 'favoritos' && (
            <div className="space-y-6">
              <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="text-lg font-bold text-gray-800">Tus Favoritos</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoadingFavorites ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-muted rounded-md w-3/4"></div>
                      <div className="h-64 bg-muted rounded-md"></div>
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No tienes películas favoritas aún.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/')}
                      >
                        Explorar películas
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {favorites.map((movie) => (
                        <div 
                          key={movie.movie_id} 
                          className="group relative cursor-pointer hover:opacity-90 transition-all duration-300"
                        >
                          <div 
                            className="rounded-lg shadow-md w-full aspect-[2/3] overflow-hidden"
                            onClick={() => navigate(`/?movieId=${movie.movie_id}`)}
                          >
                            <img 
                              src={movie.movie_data?.poster_path ? getImageUrl(movie.movie_data.poster_path, posterSizes.medium) : '/placeholder-movie.jpg'} 
                              alt={movie.movie_data?.title} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-movie.jpg";
                              }}
                            />
                          </div>
                          <h3 className="mt-2 font-medium text-sm line-clamp-1">{movie.movie_data?.title}</h3>
                          
                          {/* Botón para eliminar de favoritos */}
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!user) return;
                              
                              try {
                                const { error } = await removeFavoriteMovie(user.id, movie.movie_id);
                                if (error) {
                                  console.error('Error al eliminar de favoritos:', error);
                                  return;
                                }
                                // Actualizar la lista de favoritos
                                setFavorites(favorites.filter(fav => fav.movie_id !== movie.movie_id));
                              } catch (err) {
                                console.error('Error inesperado al eliminar favorito:', err);
                              }
                            }}
                            className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                            aria-label="Eliminar de favoritos"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <FavoriteGenresList userId={user?.id} />
              <FavoriteGenresSection userId={user?.id} />
            </div>
          )}
          
          {/* Sección de recomendaciones */}
          {activeSection === 'recomendaciones' && (
            <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg font-bold text-gray-800">Tus Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Basado en tus géneros favoritos, te recomendamos estas películas.</p>
              </CardContent>
            </Card>
          )}
          
          {/* Sección de historial */}
          {activeSection === 'historial' && (
            <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg font-bold text-gray-800">Tu Historial</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Aquí podrás ver tu historial de películas vistas.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}