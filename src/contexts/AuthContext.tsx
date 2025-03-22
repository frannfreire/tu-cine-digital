import { createContext, useContext, useEffect, useState } from 'react';
import { User, getCurrentUser, signIn, signOut, signUp } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la aplicación
    async function loadUser() {
      setIsLoading(true);
      try {
        const { user, error } = await getCurrentUser();
        if (error) {
          console.error('Error al cargar el usuario:', error);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  // Función para iniciar sesión
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (!error && data.user) {
        setUser(data.user as User);
      }
      return { error };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrarse
  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await signUp(email, password, fullName);
      if (!error && data.user) {
        setUser(data.user as User);
      }
      return { error };
    } catch (error) {
      console.error('Error al registrarse:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (!error) {
        setUser(null);
      }
      return { error };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}