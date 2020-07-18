import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: windowPixelWidth, innerHeight: windowPixelHeight } = window;
  return {
    windowPixelHeight, 
    windowPixelWidth
  };
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}