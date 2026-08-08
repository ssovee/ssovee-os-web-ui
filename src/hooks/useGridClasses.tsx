import { useMemo } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";
type DeviceAlias = DeviceType | "sm" | "md" | "lg";

type GridRuleSet = {
  "col-span"?: Partial<Record<DeviceAlias, string | number>>;
  colSpan?: Partial<Record<DeviceAlias, string | number>>;
  span?: Partial<Record<DeviceAlias, string | number>>;
  [key: string]: unknown;
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

    const resolveSpan = (classRules: GridRuleSet) => {
      const directRules = classRules["col-span"] ?? classRules.colSpan ?? classRules.span;
      const normalizedRules = directRules ?? classRules;

      const fallbackByDevice: Record<DeviceType, DeviceType[]> = {
        mobile: ["mobile", "tablet", "desktop"],
        tablet: ["tablet", "desktop", "mobile"],
        desktop: ["desktop", "tablet", "mobile"],
      };

      const aliasByDevice: Record<DeviceType, DeviceAlias[]> = {
        mobile: ["mobile", "sm"],
        tablet: ["tablet", "md"],
        desktop: ["desktop", "lg"],
      };

      const orderedDevices = fallbackByDevice[deviceType];

      for (const device of orderedDevices) {
        const aliases = aliasByDevice[device];

        for (const alias of aliases) {
          const candidate = normalizedRules?.[alias as keyof typeof normalizedRules];

          if (typeof candidate === "number") {
            return String(candidate);
          }

          if (typeof candidate === "string" && candidate.trim() !== "") {
            return candidate;
          }
        }
      }

      return "12";
    };

    for (const element in gridRules) {
      const classRules = gridRules[element];
      const colSpan = resolveSpan(classRules);
      classes[element] = `col-span-${deviceType}-${colSpan}`;
    }

    return classes;
  }, [deviceType, gridRules]);

  return { gridClasses, deviceType };
};

export default useGridClasses;
