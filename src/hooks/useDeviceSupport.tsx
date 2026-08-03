import { useEffect, useState } from "react";

// Helper function to detect device type and orientation
export const useDeviceSupport = () => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    function checkSupport() {
      // Get user agent and screen info
      const ua =
        typeof window !== "undefined" ? window.navigator.userAgent : "";
      const width = typeof window !== "undefined" ? window.innerWidth : 1920;
      const height = typeof window !== "undefined" ? window.innerHeight : 1080;
      const isTouch =
        typeof window !== "undefined" ? "ontouchstart" in window : false;

      // Mobile detection (iOS/Android phones)
      const isMobile = /Mobi|Android|iPhone|iPod/.test(ua) && width <= 767;

      // Tablet detection (portrait/landscape)
      const isTablet =
        (/iPad|Tablet|Android/.test(ua) && !/Mobile/.test(ua)) ||
        (isTouch && width >= 600 && width <= 1024);
      // Tablet portrait: width < height, width <= 1024, height > width
      const isTabletPortrait = isTablet && width < height;
      // Tablet landscape: width > height, width <= 1366, width >= 1024
      const isTabletLandscape =
        isTablet && width > height && width >= 1024 && width <= 1366;

      // Laptop: width >= 1024 (landscape), not touch or not tablet
      const isLaptop =
        width >= 1024 && !isMobile && (!isTablet || isTabletLandscape);

      // Support logic:
      // - Mobile: Not supported
      // - Tablet portrait: Not supported
      // - Tablet landscape: Supported
      // - Laptop: Supported

      if (isMobile) {
        setIsSupported(false);
      } else if (isTabletPortrait) {
        setIsSupported(false);
      } else if (isTabletLandscape) {
        setIsSupported(true);
      } else if (isLaptop) {
        setIsSupported(true);
      } else {
        // Default: allow desktop
        setIsSupported(true);
      }
    }

    checkSupport();
    window.addEventListener("resize", checkSupport);
    return () => window.removeEventListener("resize", checkSupport);
  }, []);

  return isSupported;
};
