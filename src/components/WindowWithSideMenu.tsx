import Button from "./Button";
import Typography from "./Typography";
import useShortcutFormatter from "../hooks/useShortcutFormatter";
import React, {
  useReducer,
  useEffect,
  useRef,
  isValidElement,
  ReactElement,
  useCallback,
} from "react";
import { AppInterface } from "@/types/appsList";
import { globalKeyboardShortcuts } from "../utils/constants";

const SIDEBAR_WIDTH = 200; // fixed sidebar width
const TOP_BAR_HEIGHT = 37;

export type WindowSizeProps = {
  windowSize: { width: number; height: number };
  isAppWindowResizing: boolean;
};

type ActionButton = {
  title: string;
  onClick: () => void;
};

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
};

interface WindowWithSideMenuProps {
  app: AppInterface;
  children?: React.ReactNode;
  defaultSize?: { width: number; height: number };
  isResizable?: boolean;
  actionButtons?: ActionButton;
  menu?: {
    title: string;
    items: MenuItem[];
  };
}

interface State {
  position: { x: number; y: number };
  isDragging: boolean;
  startPosition: { x: number; y: number };
  isMinimized: boolean;
  isMaximized: boolean;
  windowSize: { width: number; height: number };
  resizeStart: { x: number; y: number } | null;
  defaultSize: { width: number; height: number };
  preMaximizeState: {
    position: { x: number; y: number };
    windowSize: { width: number; height: number };
  } | null;
}

type Action =
  | { type: "START_DRAG"; payload: { x: number; y: number } }
  | { type: "DRAG"; payload: { x: number; y: number } }
  | { type: "STOP_DRAG" }
  | { type: "START_RESIZE"; payload: { x: number; y: number } }
  | { type: "RESIZE"; payload: { width: number; height: number } }
  | { type: "STOP_RESIZE" }
  | { type: "TOGGLE_MINIMIZE"; payload: { width: number; height: number } }
  | { type: "TOGGLE_MAXIMIZE"; payload?: { width: number; height: number } }
  | { type: "SYNC_MINIMIZE_STATE"; payload: boolean }
  | { type: "CLAMP_BOUNDS"; payload: { maxW: number; maxH: number } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_DRAG":
      return { ...state, isDragging: true, startPosition: action.payload };
    case "DRAG":
      return { ...state, position: action.payload };
    case "STOP_DRAG":
      return { ...state, isDragging: false };
    case "START_RESIZE":
      return { ...state, resizeStart: action.payload };
    case "RESIZE":
      return { ...state, windowSize: action.payload };
    case "STOP_RESIZE":
      return { ...state, resizeStart: null };
    case "TOGGLE_MINIMIZE":
      return {
        ...state,
        isMinimized: !state.isMinimized,
        windowSize: {
          width: action.payload.width,
          height: state.isMinimized ? action.payload.height : 33,
        },
      };
    case "SYNC_MINIMIZE_STATE":
      return {
        ...state,
        isMinimized: action.payload,
        windowSize: action.payload
          ? { width: state.windowSize.width, height: 33 }
          : { width: state.windowSize.width, height: state.defaultSize.height },
      };
    case "TOGGLE_MAXIMIZE":
      if (state.isMaximized) {
        return {
          ...state,
          isMaximized: false,
          windowSize: state.preMaximizeState?.windowSize || state.defaultSize,
          position: state.preMaximizeState?.position || { x: 0, y: TOP_BAR_HEIGHT },
          preMaximizeState: null,
        };
      }
      return {
        ...state,
        isMaximized: true,
        preMaximizeState: {
          position: state.position,
          windowSize: state.windowSize,
        },
        windowSize: action.payload || {
          width: typeof window !== "undefined" ? window.innerWidth : 600,
          height: typeof window !== "undefined" ? window.innerHeight - TOP_BAR_HEIGHT : 300,
        },
        position: { x: 0, y: TOP_BAR_HEIGHT },
      };
    case "CLAMP_BOUNDS": {
      const clampedWidth = Math.min(state.windowSize.width, action.payload.maxW);
      const clampedHeight = Math.min(state.windowSize.height, action.payload.maxH);
      const clampedX = Math.max(
        0,
        Math.min(state.position.x, action.payload.maxW - clampedWidth)
      );
      const clampedY = Math.max(
        TOP_BAR_HEIGHT,
        Math.min(state.position.y, action.payload.maxH - clampedHeight)
      );

      return {
        ...state,
        windowSize: state.isMaximized
          ? { width: action.payload.maxW, height: action.payload.maxH }
          : { width: clampedWidth, height: clampedHeight },
        position: state.isMaximized ? { x: 0, y: TOP_BAR_HEIGHT } : { x: clampedX, y: clampedY },
      };
    }
    default:
      return state;
  }
};

const WindowWithSideMenu: React.FC<WindowWithSideMenuProps> = ({
  app,
  children,
  defaultSize = { width: 600, height: 300 },
  isResizable = true,
  actionButtons,
  menu,
}) => {
  const {
    formatKeys,
    addShortcutListener,
    removeShortcutListener,
    getShortcutByCommand,
  } = useShortcutFormatter({ globalKeyboardShortcuts });

  // Dynamically calculate baseline initial size bounded by active viewport
  const getInitialDimensions = useCallback(() => {
    const rawSize = app.windowSize.windowSize ?? defaultSize;
    if (typeof window === "undefined") return rawSize;

    return {
      width: Math.min(rawSize.width, window.innerWidth),
      height: Math.min(rawSize.height, window.innerHeight - TOP_BAR_HEIGHT),
    };
  }, [app.windowSize.windowSize, defaultSize]);

  const initialDimensions = getInitialDimensions();

  const [state, dispatch] = useReducer(reducer, {
    position: { x: 0, y: TOP_BAR_HEIGHT },
    isDragging: false,
    startPosition: { x: 0, y: TOP_BAR_HEIGHT },
    isMinimized: false,
    isMaximized: false,
    windowSize: initialDimensions,
    resizeStart: null,
    defaultSize: initialDimensions,
    preMaximizeState: null,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  // Re-clamp window bounds dynamically when the browser/screen resizes
  useEffect(() => {
    const handleViewportResize = () => {
      dispatch({
        type: "CLAMP_BOUNDS",
        payload: {
          maxW: window.innerWidth,
          maxH: window.innerHeight - TOP_BAR_HEIGHT,
        },
      });
    };

    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, []);

  // Sync local minimize state from the app model passed from the parent
  useEffect(() => {
    if (app.isMinimize !== state.isMinimized) {
      dispatch({ type: "SYNC_MINIMIZE_STATE", payload: app.isMinimize });
    }
  }, [app.isMinimize, state.isMinimized]);

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (state.isMaximized) return;
    dispatch({
      type: "START_DRAG",
      payload: {
        x: e.clientX - state.position.x,
        y: e.clientY - state.position.y,
      },
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (state.isDragging) {
        const newX = e.clientX - state.startPosition.x;
        const newY = e.clientY - state.startPosition.y;

        const boundedX = Math.max(
          0,
          Math.min(newX, window.innerWidth - state.windowSize.width)
        );
        const boundedY = Math.max(
          TOP_BAR_HEIGHT,
          Math.min(newY, window.innerHeight - state.windowSize.height)
        );

        dispatch({ type: "DRAG", payload: { x: boundedX, y: boundedY } });
      }

      if (
        state.resizeStart &&
        isResizable &&
        app.windowSize.isAppWindowResizing
      ) {
        const effectiveMinWidth = Math.min(
          Math.max(defaultSize.width, state.defaultSize.width),
          window.innerWidth
        );
        const effectiveMinHeight = Math.min(
          Math.max(defaultSize.height, state.defaultSize.height),
          window.innerHeight - TOP_BAR_HEIGHT
        );

        let newWidth =
          state.windowSize.width + (e.clientX - state.resizeStart.x);
        let newHeight =
          state.windowSize.height + (e.clientY - state.resizeStart.y);

        newWidth = Math.max(effectiveMinWidth, newWidth);
        newHeight = Math.max(effectiveMinHeight, newHeight);

        const maxWidth = window.innerWidth - state.position.x;
        const maxHeight = window.innerHeight - state.position.y;
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        dispatch({
          type: "RESIZE",
          payload: {
            width: newWidth,
            height: newHeight,
          },
        });
      }
    },
    [
      state.isDragging,
      state.resizeStart,
      state.startPosition,
      state.windowSize,
      state.position,
      state.defaultSize,
      defaultSize.width,
      defaultSize.height,
      isResizable,
      app.windowSize.isAppWindowResizing,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (state.isDragging) dispatch({ type: "STOP_DRAG" });
    if (state.resizeStart) dispatch({ type: "STOP_RESIZE" });
  }, [state.isDragging, state.resizeStart]);

  const handleResizeStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isResizable || !app.windowSize.isAppWindowResizing) return;
    e.stopPropagation();
    document.body.style.userSelect = "none";
    dispatch({ type: "START_RESIZE", payload: { x: e.clientX, y: e.clientY } });
  };

  useEffect(() => {
    if (state.isDragging || state.resizeStart) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [state.isDragging, state.resizeStart, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const currentRef = windowRef.current;
    const handleActive = () => {
      if (app?.callback) {
        app.callback("CLICKED");
      }
    };

    if (currentRef) {
      currentRef.addEventListener("click", handleActive);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("click", handleActive);
      }
    };
  }, [app?.slug, app]);

  useEffect(() => {
    const handleExitApp = () => {
      if (app?.callback) {
        app.callback("CLOSE_APP");
      }
    };
    addShortcutListener("exit_app", handleExitApp);
    return () => {
      removeShortcutListener("exit_app", handleExitApp);
    };
  }, [app?.slug, app.isActive, app, addShortcutListener, removeShortcutListener]);

  useEffect(() => {
    const handleMinimize = () => {
      if (app?.slug && app.isActive) {
        dispatch({
          type: "TOGGLE_MINIMIZE",
          payload: state.windowSize,
        });
        if (app?.callback) {
          app.callback("MINIMIZE_APP");
        }
      }
    };
    addShortcutListener("minimize_app", handleMinimize);
    return () => {
      removeShortcutListener("minimize_app", handleMinimize);
    };
  }, [app?.slug, app.isActive, state.isMinimized, state.windowSize, app, addShortcutListener, removeShortcutListener]);

  useEffect(() => {
    const handleMaximize = () => {
      if (app?.slug && app.isActive) {
        dispatch({
          type: "TOGGLE_MAXIMIZE",
          payload: {
            width: window.innerWidth,
            height: window.innerHeight - TOP_BAR_HEIGHT,
          },
        });
      }
    };
    addShortcutListener("maximize_app", handleMaximize);
    return () => {
      removeShortcutListener("maximize_app", handleMaximize);
    };
  }, [app?.slug, app.isActive, addShortcutListener, removeShortcutListener]);

  if (state.isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="flex rounded-[10px] overflow-hidden window-drop-shadow"
      style={{
        width: state.isMaximized ? "100vw" : `${state.windowSize.width}px`,
        height: state.isMaximized
          ? `calc(100vh - ${TOP_BAR_HEIGHT}px)`
          : `${state.windowSize.height}px`,
        transform: state.isMaximized
          ? undefined
          : `translate(${state.position.x}px, ${state.position.y - TOP_BAR_HEIGHT}px)`,
        position: "absolute",
        minWidth: state.isMaximized
          ? "100vw"
          : `min(${state.defaultSize.width}px, 100vw)`,
        minHeight: state.isMaximized
          ? `calc(100vh - ${TOP_BAR_HEIGHT}px)`
          : `min(${state.defaultSize.height}px, 100vh)`,
        zIndex: state.isDragging ? 3 : app?.isActive ? 2 : 1,
      }}
    >
      {/* Sidebar - fixed width */}
      <div
        className="bg-primary flex flex-col shrink-0 overflow-y-auto"
        style={{
          width: `${SIDEBAR_WIDTH}px`,
          minWidth: `${SIDEBAR_WIDTH}px`,
          maxWidth: `${SIDEBAR_WIDTH}px`,
        }}
      >
        <div
          className="flex items-center gap-[8px] pl-[20px] pt-[20px] select-none"
          onMouseDown={handleMouseDown}
          style={{ cursor: state.isMaximized ? "default" : "move" }}
        >
          <button
            className="w-[12px] h-[12px] bg-[#FF6157] rounded-full"
            onClick={() => {
              if (app?.callback) {
                app.callback("CLOSE_APP");
              }
            }}
            title={`Close ${formatKeys(getShortcutByCommand("exit_app"))}`}
            style={{ outline: "none", border: "none" }}
            tabIndex={-1}
          />

          <button
            className="w-[12px] h-[12px] bg-[#FFC12F] rounded-full"
            onClick={() => {
              dispatch({
                type: "TOGGLE_MINIMIZE",
                payload: state.windowSize,
              });
              if (app?.callback) {
                app.callback("MINIMIZE_APP");
              }
            }}
            title={
              state.isMinimized
                ? "Restore"
                : `Minimize ${formatKeys(getShortcutByCommand("minimize_app"))}`
            }
            style={{ outline: "none", border: "none" }}
            tabIndex={-1}
          />
          {isResizable && app.windowSize.isAppWindowResizing && (
            <button
              className="w-[12px] h-[12px] bg-[#2ACB42] rounded-full"
              onClick={() => {
                dispatch({
                  type: "TOGGLE_MAXIMIZE",
                  payload: {
                    width: window.innerWidth,
                    height: window.innerHeight - TOP_BAR_HEIGHT,
                  },
                });
              }}
              title={
                state.isMaximized
                  ? "Restore"
                  : `Maximize ${formatKeys(
                      getShortcutByCommand("maximize_app")
                    )}`
              }
              style={{ outline: "none", border: "none" }}
              tabIndex={-1}
            />
          )}
        </div>

        {/* Create / Action Button */}
        {actionButtons !== undefined && (
          <div className="px-[12px] mt-[18px]">
            <Button
              variant="outline"
              fullWidth
              onClick={actionButtons.onClick}
              className="!bg-surface-3"
            >
              + {actionButtons.title}
            </Button>
          </div>
        )}

        {/* Menu */}
        {menu && (
          <div className="mt-[15px] flex flex-col text-[13px]">
            {menu.items.map((item, index) => (
              <button
                className={`${
                  item.isActive
                    ? "bg-brand-color text-white"
                    : "text-neutral-500"
                } px-[10px] mx-2 flex items-center gap-[8px] rounded-[6px] h-[30px] cursor-pointer transition-all duration-200`}
                onClick={item.onClick}
                key={index}
              >
                {item.icon}
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Pane */}
      <div
        className="flex-1 bg-secondary flex flex-col min-w-0 h-full overflow-hidden"
        style={{
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        {/* Top Bar - draggable */}
        <div
          className="h-[50px] py-2 flex flex-col border-b border-b-surface-1 border-b-[0.5px] justify-center text-[13px] px-[12px] select-none shrink-0"
          onMouseDown={handleMouseDown}
          style={{
            cursor: state.isMaximized ? "default" : "move",
          }}
        >
          <Typography variant="p" className="font-medium text-neutral-500 truncate">
            {app?.name}
          </Typography>
          <Typography variant="p" className="text-neutral-400 text-[11px] truncate">
            {menu?.items.find((item) => item.isActive)?.title}
          </Typography>
        </div>

        {/* Content Viewport */}
        {!state.isMinimized && (
          <div className="flex-1 w-full overflow-y-auto min-h-0">
            {isValidElement(children) && typeof children.type !== "string"
              ? React.cloneElement(children as ReactElement<WindowSizeProps>, {
                  windowSize: state.windowSize,
                  isAppWindowResizing: state.resizeStart !== null,
                })
              : children}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {isResizable && !state.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-10"
          style={{
            borderBottomRightRadius: "10px",
          }}
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default WindowWithSideMenu;