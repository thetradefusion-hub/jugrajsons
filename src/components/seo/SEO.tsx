import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Jugraj Son's Hive - Pure Raw Natural Honey",
  description = "Shop pure raw natural honey online at Jugraj Son's Hive. Discover mono-flora and multi-flora honey sourced directly from trusted apiaries.",
  keywords = 'raw honey, natural honey, pure honey, monofloral honey, multiflora honey, honey store, honey gifts',
  image = '/og-image.png',
  url = 'https://jugrajsonshive.com',
  type = 'website',
}) => {
  const fullTitle = title.includes("Jugraj Son's Hive") ? title : `${title} | Jugraj Son's Hive`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
