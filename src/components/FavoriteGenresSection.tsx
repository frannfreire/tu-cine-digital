import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { fetchMovieGenres, Genre } from '@/lib/tmdb';
import { getFavoriteGenres, saveFavoriteGenres } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle, Save } from 'lucide-react';

interface FavoriteGenresSectionProps {
  userId?: string;
}

export function FavoriteGenresSection({ userId }: FavoriteGenresSectionProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cargar géneros y preferencias del usuario
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Cargar todos los géneros disponibles
        const genresData = await fetchMovieGenres();
        setGenres(genresData.genres);
        
        // Cargar géneros favoritos del usuario
        const { genreIds, error } = await getFavoriteGenres(userId);
        if (!error && genreIds) {
          setSelectedGenres(genreIds);
        }
      } catch (error) {
        console.error('Error al cargar géneros:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId]);

  // Manejar selección/deselección de géneros
  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  // Guardar géneros favoritos
  const handleSaveGenres = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      const { error } = await saveFavoriteGenres(userId, selectedGenres);
      if (error) {
        setSaveError(error.message || 'Error al guardar géneros favoritos');
      } else {
        setSaveSuccess(true);
      }
    } catch (error) {
      setSaveError('Error inesperado al guardar géneros favoritos');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Tus Géneros Favoritos
        </CardTitle>
        <CardDescription>
          Selecciona los géneros que más te gustan para recibir recomendaciones personalizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-10 w-24 bg-muted rounded-full animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-8">
              {genres.map((genre) => (
                <motion.button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow ${
                    selectedGenres.includes(genre.id)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-secondary hover:bg-secondary/90"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedGenres.includes(genre.id) && (
                    <CheckCircle className="inline-block w-4 h-4 mr-1" />
                  )}
                  {genre.name}
                </motion.button>
              ))}
            </div>
            
            {saveError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4 shadow-sm"
              >
                {saveError}
              </motion.div>
            )}
            
            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm mb-4 shadow-sm flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Géneros favoritos guardados correctamente
              </motion.div>
            )}
            
            <motion.div
              className="flex justify-center md:justify-start"
              whileHover={{ scale: 1.02 }}
            >
              <Button 
                onClick={handleSaveGenres} 
                disabled={isSaving}
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                size="lg"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar géneros favoritos
                  </span>
                )}
              </Button>
            </motion.div>
          </>
        )}
      </CardContent>
    </Card>
  );
}