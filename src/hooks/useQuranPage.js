import { useState, useEffect } from 'react';
import { QURAN_CONFIG } from '../config/quran-config';

const PAGE_CACHE = new Map();

export const useQuranPage = (pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageUrl, setPageUrl] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if page is in cache
        if (PAGE_CACHE.has(pageNumber)) {
          setPageUrl(PAGE_CACHE.get(pageNumber));
          setLoading(false);
          return;
        }

        // Get the page path
        const path = QURAN_CONFIG.getPagePath(pageNumber);
        
        // In a real app, you might want to preload the image here
        const img = new Image();
        img.src = path;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Add to cache
        PAGE_CACHE.set(pageNumber, path);
        setPageUrl(path);
      } catch (err) {
        setError('Failed to load page');
        console.error('Error loading page:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [pageNumber]);

  return { loading, error, pageUrl };
};
