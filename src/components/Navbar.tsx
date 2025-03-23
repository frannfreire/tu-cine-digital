import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import logo from '../assets/logo.png';

export function Navbar() {
  const { user, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-card shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Tu Cine Digital" className="h-10 w-auto" />
        </Link>
        
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-24 h-9 bg-muted animate-pulse rounded-md"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link to="/perfil">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  {user.user_metadata?.full_name || 'Perfil'}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/registro">
                <Button variant="default" size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}