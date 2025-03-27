import { useEffect, useState } from 'react';

const useIsMobile = (breakpoint = 480) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!isFullscreen) {
        setIsMobile(window.innerWidth <= breakpoint);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement != null);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    console.log("isMobile " + (window.innerWidth * 0.8).toString())

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [breakpoint, isFullscreen]);

  return isMobile;
};

export default useIsMobile;
