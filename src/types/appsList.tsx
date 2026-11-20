export interface AppMetadata {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string;
  author?: string;
  siteName?: string;
}

export interface AppInterface {
  name: string;
  slug: string;
  icon?: string;
  componentKey?: string;
  isActive: boolean;
  isMinimize: boolean;
  windowSize: {
    windowSize: { width: number; height: number };
    isAppWindowResizing?: boolean;
  };
  splitBounds?: {
    left: string;
    top: string;
    width: string;
    height: string;
  } | null;
  onWindowDrag?: (event: {
    type: "move" | "drop" | "restore";
    clientX: number;
    clientY: number;
  }) => void;
  metadata?: Partial<AppMetadata>;
  callback?: (value: "CLOSE_APP" | "CLICKED" | "MINIMIZE_APP") => void;
}
