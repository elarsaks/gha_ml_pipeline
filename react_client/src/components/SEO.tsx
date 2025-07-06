import { useEffect } from "react";
import { SEO_CONFIG } from "../constants";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = SEO_CONFIG.title,
  description = SEO_CONFIG.description,
  image = SEO_CONFIG.image,
  url = SEO_CONFIG.url,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDescription) ogDescription.setAttribute("content", description);
    if (ogImage) ogImage.setAttribute("content", image);
    if (ogUrl) ogUrl.setAttribute("content", url);

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    const twitterImage = document.querySelector('meta[name="twitter:image"]');

    if (twitterTitle) twitterTitle.setAttribute("content", title);
    if (twitterDescription)
      twitterDescription.setAttribute("content", description);
    if (twitterImage) twitterImage.setAttribute("content", image);
  }, [title, description, image, url]);

  return null; // This component doesn't render anything
};
