import { SEO } from './SEO';

type PageSEOProps = {
  path: string;
};

export function PageSEO({ path }: PageSEOProps) {
  // Configuración SEO específica para cada página
  switch (path) {
    case '/':
      return (
        <SEO 
          title="Tu Cine Digital - Descubre el fascinante mundo del cine"
          description="Explora las mejores películas, guarda tus favoritas y recibe recomendaciones personalizadas en Tu Cine Digital, tu portal al mundo del cine."
          canonical="https://tucine.digital/"
          keywords="películas, cine, películas online, recomendaciones de películas, estrenos de cine"
          type="website"
        />
      );
    case '/peliculas':
      return (
        <SEO 
          title="Catálogo de Películas | Tu Cine Digital"
          description="Explora nuestro extenso catálogo de películas. Encuentra los últimos estrenos, clásicos del cine y películas de todos los géneros."
          canonical="https://tucine.digital/peliculas"
          keywords="catálogo de películas, películas populares, tendencias de cine, estrenos de cine"
          type="website"
        />
      );
    case '/recomendaciones':
      return (
        <SEO 
          title="Recomendaciones Personalizadas | Tu Cine Digital"
          description="Descubre películas recomendadas especialmente para ti basadas en tus gustos y preferencias cinematográficas."
          canonical="https://tucine.digital/recomendaciones"
          keywords="recomendaciones de películas, películas personalizadas, sugerencias de cine"
          type="website"
        />
      );
    case '/login':
      return (
        <SEO 
          title="Iniciar Sesión | Tu Cine Digital"
          description="Accede a tu cuenta para guardar tus películas favoritas y recibir recomendaciones personalizadas."
          canonical="https://tucine.digital/login"
          keywords="iniciar sesión, acceso usuario, cuenta cine"
          type="website"
        />
      );
    case '/registro':
      return (
        <SEO 
          title="Crear Cuenta | Tu Cine Digital"
          description="Regístrate para guardar tus películas favoritas, recibir recomendaciones personalizadas y más."
          canonical="https://tucine.digital/registro"
          keywords="registro, crear cuenta, nueva cuenta cine"
          type="website"
        />
      );
    case '/perfil':
      return (
        <SEO 
          title="Mi Perfil | Tu Cine Digital"
          description="Gestiona tu perfil, revisa tus películas favoritas y actualiza tus preferencias cinematográficas."
          canonical="https://tucine.digital/perfil"
          keywords="perfil usuario, preferencias cine, películas favoritas"
          type="website"
        />
      );
    default:
      return (
        <SEO />
      );
  }
}