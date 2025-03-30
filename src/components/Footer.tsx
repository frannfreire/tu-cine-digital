import { Link } from "react-router-dom";
import { Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 backdrop-blur-md text-white py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección de navegación */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/peliculas?type=popular" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Películas Populares
                </Link>
              </li>
              <li>
                <Link to="/peliculas?type=trending" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Tendencias
                </Link>
              </li>
              <li>
                <Link to="/recomendaciones" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Recomendaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección legal */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terminos-condiciones" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Contacto</h3>
            <div className="flex items-center mb-2">
              <Mail className="h-5 w-5 mr-2 text-gray-400" />
              <span className="text-gray-300">contacto@tucinedigital.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p className="flex items-center justify-center">
            © {currentYear} Tu Cine Digital. Hecho con <Heart className="h-4 w-4 mx-1 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}