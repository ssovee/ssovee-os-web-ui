import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppInterface } from "@/types/appsList";
import type {
  PluginAPI,
  PluginComponentProps,
  PluginManifest,
} from "@/types/plugins";

type ToastType = "success" | "error" | "info";

interface MockUser {
  id: string;
  name: string;
  email: string;
}

type WindowVariant = "with-side-menu" | "without-side-menu";

interface PlaygroundMenuItem {
  title: string;
  icon?: string;
  isActive?: boolean;
}

interface PlaygroundMenu {
  title: string;
  items: PlaygroundMenuItem[];
}

interface PlaygroundActionButton {
  title: string;
}

interface PluginPlaygroundMetadata extends Partial<PluginManifest> {
  title?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  windowVariant?: WindowVariant;
  menu?: PlaygroundMenu;
  actionButton?: PlaygroundActionButton;
  backgroundImage?: string;
}

interface PluginPlaygroundProps {
  children:
    | React.ReactNode
    | ((props: PluginComponentProps) => React.ReactNode);
  metadata: PluginPlaygroundMetadata;
  backgroundImage?: string;
  onClose?: () => void;
  onMinimize?: (isMinimized: boolean) => void;
}

const DEFAULT_BACKGROUND = "/wallpaper/Wallpaper3.webp";
const DEFAULT_MOCK_USER: MockUser = {
  id: "dev-user",
  name: "Plugin Developer",
  email: "dev@local.test",
};
const DEFAULT_TOKEN = "playground-dev-token";

function renderPluginChild(
  child: React.ReactNode | ((props: PluginComponentProps) => React.ReactNode),
  app: AppInterface,
  api: PluginAPI,
  reloadKey: number,
): React.ReactNode {
  if (!child) return null;

  if (typeof child === "function") {
    const renderFn = child as (props: PluginComponentProps) => React.ReactNode;
    return renderFn({ app, api });
  }

  return Children.map(child as React.ReactNode, (node, index) => {
    if (!isValidElement(node)) {
      return node;
    }

    return cloneElement(
      node as React.ReactElement<Partial<PluginComponentProps>>,
      {
        key: `${reloadKey}-${index}`,
        app,
        api,
      },
    );
  });
}

function getDefaultSize(metadata: PluginPlaygroundMetadata) {
  const manifestWindowSize = metadata.windowSize?.windowSize;
  const minWidth = metadata.minWidth ?? 520;
  const minHeight = metadata.minHeight ?? 360;

  return {
    width: Math.max(
      manifestWindowSize?.width ?? metadata.defaultWidth ?? 960,
      minWidth,
    ),
    height: Math.max(
      manifestWindowSize?.height ?? metadata.defaultHeight ?? 680,
      minHeight,
    ),
  };
}

export default function PluginPlayground({
  children,
  metadata,
  backgroundImage,
  onClose,
  onMinimize,
}: Readonly<PluginPlaygroundProps>) {
  const [mockUser] = useState<MockUser>(DEFAULT_MOCK_USER);
  const [mockToken] = useState(DEFAULT_TOKEN);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = window.localStorage.getItem("plugin-playground-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;
    setIsNightMode(shouldUseDark);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.toggle("dark", isNightMode);
    window.localStorage.setItem(
      "plugin-playground-theme",
      isNightMode ? "dark" : "light",
    );
  }, [isNightMode]);

  const title = metadata.title ?? metadata.name ?? "Plugin Playground";
  const slug = metadata.slug ?? "local-plugin";
  const defaultSize = useMemo(() => getDefaultSize(metadata), [metadata]);
  const canvasBackground =
    backgroundImage ?? metadata.backgroundImage ?? DEFAULT_BACKGROUND;
  const isWindowResizable =
    metadata.windowSize?.isAppWindowResizing ?? metadata.isResizing ?? true;

  const minimizeWindow = useCallback(() => {
    setIsActive(false);
    setIsMinimized(true);
    setIsClosed(false);
    onMinimize?.(true);
  }, [onMinimize]);

  const closeWindow = useCallback(() => {
    setIsActive(false);
    setIsClosed(true);
    setIsMinimized(false);
    onClose?.();
  }, [onClose]);

  const restoreWindow = useCallback(() => {
    setIsActive(true);
    setIsClosed(false);
    setIsMinimized(false);
    onMinimize?.(false);
  }, [onMinimize]);

  const mockApi: PluginAPI = useMemo(
    () => ({
      showToast: (message: string, type: ToastType) => {
        console.info(`[playground:${type}] ${message}`);
      },
      openApp: (app: AppInterface) => {
        console.info(`[playground:openApp] ${app.slug}`);
      },
      getUser: async () => {
        return mockUser;
      },
      getToken: async () => {
        return mockToken;
      },
    }),
    [mockToken, mockUser],
  );

  const appProps: AppInterface = useMemo(
    () => ({
      name: title,
      slug,
      icon: metadata.icon,
      isActive,
      isMinimize: isMinimized,
      componentKey: "plugin-playground",
      windowSize: {
        windowSize: defaultSize,
        isAppWindowResizing: isWindowResizable,
      },
      metadata: {
        title,
        description: metadata.description,
        ogImage: metadata.icon,
        keywords: metadata.keywords?.join(", "),
        author: metadata.author,
        siteName: "Plugin Playground",
      },
      callback: (value) => {
        if (value === "MINIMIZE_APP") {
          minimizeWindow();
          return;
        }

        if (value === "CLOSE_APP") {
          closeWindow();
          return;
        }

        if (value === "CLICKED") {
          setIsActive(true);
        }
      },
    }),
    [
      closeWindow,
      defaultSize,
      isActive,
      isMinimized,
      metadata.author,
      metadata.description,
      metadata.icon,
      metadata.keywords,
      minimizeWindow,
      isWindowResizable,
      slug,
      title,
    ],
  );

  const injectedPlugin = renderPluginChild(
    children,
    appProps,
    mockApi,
    Number(isClosed),
  );

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat text-white transition-colors duration-200 dark:text-slate-100"
      style={{ backgroundImage: `url(${canvasBackground})` }}
    >
      <button
        aria-pressed={isNightMode}
        className="absolute left-4 top-4 z-40 rounded-full border border-white/30 bg-white/75 px-3 py-2 text-xs font-medium text-slate-900 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-200 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-slate-950/40"
        onClick={() => setIsNightMode((prev) => !prev)}
        type="button"
      >
        {isNightMode ? "☀️ Light Mood" : "🌙 Night Mood"}
      </button>

      {!isClosed ? injectedPlugin : null}

      {isClosed || isMinimized ? (
        <button
          className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/30 bg-black/55 px-4 py-2 text-xs text-white backdrop-blur-md transition-colors duration-200 dark:border-white/20 dark:bg-slate-950/70 dark:text-slate-100"
          onClick={restoreWindow}
          type="button"
        >
          {isClosed ? `Reopen ${title}` : `Restore ${title}`}
        </button>
      ) : null}
    </div>
  );
}
