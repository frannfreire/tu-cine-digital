import { Helmet, HelmetProvider } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  keywords?: string;
  children?: React.ReactNode;
};

export function SEO({
  title = 'Tu Cine Digital - Descubre el fascinante mundo del cine',
  description = 'Explora las mejores películas, guarda tus favoritas y recibe recomendaciones personalizadas en Tu Cine Digital, tu portal al mundo del cine.',
  canonical = 'https://tucine.digital',
  image = 'https://tucine.digital/og-image.jpg',
  type = 'website',
  keywords = 'películas, cine, películas online, recomendaciones de películas, estrenos de cine',
  children,
}: SEOProps) {
  const siteTitle = title.includes('Tu Cine Digital') ? title : `${title} | Tu Cine Digital`;
  
  return (
    <Helmet>
      {/* Metadatos básicos */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Tu Cine Digital" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Otros metadatos */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Tu Cine Digital" />
      
      {children}
    </Helmet>
  );
}

export function SEOProvider({ children }: { children: React.ReactNode }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}