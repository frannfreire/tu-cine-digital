import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '../lib/supabase';
import { FavoriteGenresSection } from '../components/FavoriteGenresSection';
import { FavoriteGenresList } from '../components/FavoriteGenresList';
import { getFavoriteMovies } from '../lib/supabase';
import { fetchMovieGenres, Genre } from '../lib/tmdb';
import { CheckCircle, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
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
    <div className="container mx-auto py-10 flex flex-col gap-8 min-h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="w-full shadow-lg border-primary/20 sticky top-4">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Tu Perfil
              </CardTitle>
              <CardDescription>
                Administra tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Nombre completo
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full p-2 border rounded-md bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">El correo electrónico no se puede cambiar</p>
                </div>
                {updateError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {updateError}
                  </div>
                )}
                {updateSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Perfil actualizado correctamente
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Actualizando...
                    </span>
                  ) : 'Actualizar perfil'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <FavoriteGenresList userId={user?.id} />
          <FavoriteGenresSection userId={user?.id} />
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20 mt-8">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Tus Películas Favoritas
          </CardTitle>
          <CardDescription>
            Películas que has marcado como favoritas
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingFavorites ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                    {favorite.movie_data?.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${favorite.movie_data.poster_path}`}
                        alt={favorite.movie_data.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Sin imagen</span>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{favorite.movie_data?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {favorite.movie_data?.release_date?.substring(0, 4)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-muted-foreground mb-4">No tienes películas favoritas</p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => navigate('/')}
              >
                Explorar películas
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}