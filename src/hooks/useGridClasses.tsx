import { useMemo } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

type GridRuleSet = {
  "col-span"?: Partial<Record<DeviceType, string>>;
};

const useGridClasses = (
  windowSize: { width: number; height: number },
  gridRules: Record<string, GridRuleSet>
) => {
  const deviceType: DeviceType = useMemo(() => {
    if (windowSize.width <= 640) return "mobile"; // For mobile (width <= 640px)
    if (windowSize.width <= 1024) return "tablet"; // For tablet (width <= 1024px)
    return "desktop"; // For desktop (width > 1024px)
  }, [windowSize.width]);

  const gridClasses: Record<string, string> = useMemo(() => {
    const classes: Record<string, string> = {};

    const resolveSpan = (spanRules: GridRuleSet["col-span"]) => {
      const fallbackByDevice: Record<DeviceType, DeviceType[]> = {
        mobile: ["mobile", "tablet", "desktop"],
        tablet: ["tablet", "desktop", "mobile"],
        desktop: ["desktop", "tablet", "mobile"],
      };

      const orderedDevices = fallbackByDevice[deviceType];

      for (const device of orderedDevices) {
        const candidate = spanRules?.[device];

        if (candidate) {
          return candidate;
        }
      }

      return "12";
    };

    for (const element in gridRules) {
      const classRules = gridRules[element];
      const colSpan = resolveSpan(classRules["col-span"]);
      classes[element] = `col-span-${deviceType}-${colSpan}`;
    }

    return classes;
  }, [deviceType, gridRules]);

  return { gridClasses, deviceType };
};

export default useGridClasses;
