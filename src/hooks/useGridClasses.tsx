import { useMemo } from "react";

const useGridClasses = (
  windowSize: { width: number; height: number },
  gridRules: Record<string, Record<string, Record<string, string>>>
) => {
  const deviceType: "mobile" | "tablet" | "desktop" = useMemo(() => {
    if (windowSize.width <= 640) return "mobile"; // For mobile (width <= 640px)
    if (windowSize.width <= 1024) return "tablet"; // For tablet (width <= 1024px)
    return "desktop"; // For desktop (width > 1024px)
  }, [windowSize]);

  const gridClasses: Record<string, string> = useMemo(() => {
    const classes: Record<string, string> = {};
    for (const element in gridRules) {
      const classRules = gridRules[element];
      // Check for device-specific class (col-span-{deviceType}-{col-span})
      const colSpan = classRules["col-span"][deviceType];
      classes[element] = `col-span-${deviceType}-${colSpan}`;
    }
    return classes;
  }, [deviceType, gridRules]);

  return { gridClasses, deviceType };
};

export default useGridClasses;
