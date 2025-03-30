import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageSEO } from "@/components/PageSEO";
import { Footer } from "@/components/Footer";

export function TermsConditionsPage() {
  const navigate = useNavigate();
  const lastUpdated = "30/03/2025";
  const companyLocation = "Montevideo, Uruguay";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white flex flex-col">
      <PageSEO 
        path="/terminos-condiciones" 
        title="Términos y Condiciones - Tu Cine Digital"
        description="Términos y condiciones de uso de Tu Cine Digital. Información legal sobre el uso del servicio."
      />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Button 
          variant="outline" 
          className="mb-6 flex items-center gap-2 bg-black/30 text-white hover:bg-black/50 border-none"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent inline-block">Términos y Condiciones</h1>
          <p className="text-gray-400 mb-8">Última actualización: {lastUpdated}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">1. Aceptación de los Términos</h2>
              <p className="text-gray-300 mb-3">
                Al acceder y utilizar Tu Cine Digital, usted acepta estar legalmente vinculado por estos Términos y Condiciones. 
                Si no está de acuerdo con alguno de estos términos, no debe utilizar este servicio.
              </p>
              <p className="text-gray-300">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor 
                inmediatamente después de su publicación en el sitio. El uso continuado de Tu Cine Digital después de 
                dichos cambios constituirá su aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">2. Descripción del Servicio</h2>
              <p className="text-gray-300 mb-3">
                Tu Cine Digital es una plataforma que proporciona información sobre películas, incluyendo detalles, 
                calificaciones, reseñas y recomendaciones. Nuestro servicio utiliza datos de terceros, como The Movie 
                Database (TMDB), para proporcionar esta información.
              </p>
              <p className="text-gray-300">
                No alojamos ni distribuimos contenido audiovisual protegido por derechos de autor. Cualquier enlace a 
                servicios de streaming es proporcionado únicamente con fines informativos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">3. Cuentas de Usuario</h2>
              <p className="text-gray-300 mb-3">
                Algunas funciones de Tu Cine Digital pueden requerir el registro de una cuenta. Usted es responsable de 
                mantener la confidencialidad de su información de cuenta y contraseña, así como de restringir el acceso a 
                su computadora o dispositivo.
              </p>
              <p className="text-gray-300">
                Usted acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta. Si sospecha de un uso 
                no autorizado de su cuenta, debe notificarnos inmediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">4. Propiedad Intelectual</h2>
              <p className="text-gray-300 mb-3">
                Todo el contenido incluido en Tu Cine Digital, como texto, gráficos, logotipos, imágenes, clips de audio, 
                descargas digitales y compilaciones de datos, es propiedad de Tu Cine Digital o de sus proveedores de 
                contenido y está protegido por las leyes de propiedad intelectual.
              </p>
              <p className="text-gray-300">
                Las imágenes de películas, pósters, trailers y otra información relacionada con películas son proporcionados 
                por The Movie Database (TMDB) y están sujetos a sus propios términos de uso y políticas de derechos de autor.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">5. Privacidad</h2>
              <p className="text-gray-300 mb-3">
                Nuestra Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal. 
                Al utilizar Tu Cine Digital, usted acepta nuestras prácticas de privacidad como se describe en nuestra 
                Política de Privacidad.
              </p>
              <p className="text-gray-300">
                Sus datos personales están protegidos y almacenados de forma segura mediante la plataforma Supabase, 
                que implementa medidas de seguridad avanzadas para garantizar la integridad y confidencialidad de su información. 
                Cumplimos con todas las regulaciones de protección de datos aplicables en Uruguay.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">6. Limitación de Responsabilidad</h2>
              <p className="text-gray-300 mb-3">
                Tu Cine Digital se proporciona "tal cual" y "según disponibilidad", sin garantías de ningún tipo, ya sean 
                expresas o implícitas. No garantizamos que el servicio sea ininterrumpido, oportuno, seguro o libre de errores.
              </p>
              <p className="text-gray-300">
                En ningún caso Tu Cine Digital, sus directores, empleados o agentes serán responsables por cualquier daño 
                directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar el servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">7. Ley Aplicable</h2>
              <p className="text-gray-300">
                Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de Uruguay, sin tener en 
                cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa que surja en relación con estos 
                términos estará sujeta a la jurisdicción exclusiva de los tribunales de Montevideo, Uruguay.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-400">8. Contacto</h2>
              <p className="text-gray-300 mb-3">
                Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en: 
                <a href="mailto:contact.frann@gmail.com" className="text-blue-400 hover:underline">contact.frann@gmail.com</a>
              </p>
              <p className="text-gray-300">
                Tu Cine Digital está ubicado en {companyLocation}.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}