import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function SEO({ 
  title, 
  description, 
  image = '/og-default.jpg',
  url = window.location.href,
  type = 'website'
}: SEOProps) {
  const siteName = 'Acessorauto Veículos';
  const fullTitle = `${title} | ${siteName}`;
  
  // Garantir que a imagem seja uma URL absoluta
  const getAbsoluteImageUrl = (imageUrl: string): string => {
    // Se já for uma URL absoluta (http:// ou https://), retorna como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Se for um caminho relativo, converte para URL absoluta
    const origin = window.location.origin;
    return `${origin}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  };
  
  const absoluteImageUrl = getAbsoluteImageUrl(image);

  return (
    <Helmet>
      {/* Meta Tags Básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* WhatsApp (usa Open Graph) */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
    </Helmet>
  );
}
