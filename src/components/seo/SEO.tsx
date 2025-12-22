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
  title = 'Atharva Health Solutions - Premium Ayurvedic Products',
  description = 'Discover authentic Ayurvedic products for immunity, digestion, skin care, and overall wellness. 100% natural, GMP certified, and trusted by millions.',
  keywords = 'Ayurvedic products, herbal medicine, natural health, immunity booster, Ayurveda, wellness, organic supplements',
  image = '/og-image.png',
  url = 'https://atharvahealthsolutions.com',
  type = 'website',
}) => {
  const fullTitle = title.includes('Atharva') ? title : `${title} | Atharva Health Solutions`;
  
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
