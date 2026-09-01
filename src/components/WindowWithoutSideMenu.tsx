import React, {
  useReducer,
  useEffect,
  useRef,
  isValidElement,
  ReactElement,
} from "react";
import Typography from "./Typography";
import useShortcutFormatter from "../hooks/useShortcutFormatter";
import { AppInterface } from "@/types/appsList";
import { globalKeyboardShortcuts } from "@/utils/constants";

export interface WindowSizeProps {
  windowSize: { width: number; height: number };
  isAppWindowResizing: boolean;
}

interface WindowWithoutSideMenuProps {
  app: AppInterface;
  children?: React.ReactNode;
  defaultSize?: { width: number; height: number };
  isResizable?: boolean;
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
  | { type: "SYNC_MINIMIZE_STATE"; payload: boolean };

const initialState: State = {
  position: { x: 0, y: 40 },
  isDragging: false,
  startPosition: { x: 0, y: 40 },
  isMinimized: false,
  isMaximized: false,
  windowSize: { width: 300, height: 300 },
  resizeStart: null,
  defaultSize: { width: 300, height: 300 },
  preMaximizeState: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_DRAG":
      return { ...state, isDragging: true, startPosition: action.payload };
    case "DRAG":
      return { ...state, position: action.payload };
    case "STOP_DRAG":
      return { ...state, isDragging: false };
    case "START_RESIZE":
      return {
        ...state,
        resizeStart: action.payload,
      };
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
          position: state.preMaximizeState?.position || { x: 0, y: 40 },
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
          width: window.innerWidth,
          height: window.innerHeight,
        },
        position: state.position,
      };
    default:
      return state;
  }
};

const WindowWithoutSideMenu: React.FC<WindowWithoutSideMenuProps> = ({
  app,
  children,
  defaultSize = { width: 300, height: 300 },
  isResizable = true,
}) => {
  const {
    formatKeys,
    addShortcutListener,
    removeShortcutListener,
    getShortcutByCommand,
  } = useShortcutFormatter({ globalKeyboardShortcuts });

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    windowSize: app.windowSize.windowSize ?? defaultSize,
    defaultSize: app.windowSize.windowSize ?? defaultSize,
  });

  const windowRef = useRef<HTMLDivElement>(null);

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

  const handleMouseMove = (e: MouseEvent) => {
    if (state.isDragging) {
      const newX = e.clientX - state.startPosition.x;
      const newY = e.clientY - state.startPosition.y;

      const boundedX = Math.max(
        0,
        Math.min(newX, window.innerWidth - state.windowSize.width),
      );
      const boundedY = Math.max(
        0,
        Math.min(newY, window.innerHeight - state.windowSize.height),
      );

      dispatch({ type: "DRAG", payload: { x: boundedX, y: boundedY } });
    }

    if (
      state.resizeStart &&
      isResizable &&
      app.windowSize.isAppWindowResizing
    ) {
      // Calculate new width and height based on mouse movement
      let newWidth =
        state.windowSize.width + (e.clientX - (state.resizeStart?.x ?? 0));
      let newHeight =
        state.windowSize.height + (e.clientY - (state.resizeStart?.y ?? 0));

      // Clamp to minimum size
      newWidth = Math.max(state.defaultSize.width, newWidth);
      newHeight = Math.max(state.defaultSize.height, newHeight);

      // Clamp to viewport
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
  };

  const handleMouseUp = () => {
    if (state.isDragging) dispatch({ type: "STOP_DRAG" });
    if (state.resizeStart) dispatch({ type: "STOP_RESIZE" });
  };

  const handleResizeStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (!isResizable && !app.windowSize.isAppWindowResizing) return;
    e.stopPropagation();
    // Prevent text selection while resizing
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
      // Restore user-select after resizing
      document.body.style.userSelect = "";
    };
  }, [state.isDragging, state.resizeStart]);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.addEventListener("click", () => {
        if (app?.callback) {
          app?.callback("CLICKED");
        }
      });
    }
  }, [app?.slug, windowRef]);

  useEffect(() => {
    const handleExitApp = () => {
      if (app?.callback) {
        app?.callback("CLOSE_APP");
      }
    };
    addShortcutListener("exit_app", handleExitApp);
    return () => {
      removeShortcutListener("exit_app", handleExitApp);
    };
  }, [app?.slug, app.isActive]);

  useEffect(() => {
    const handleMinimize = () => {
      if (app?.slug && app.isActive) {
        dispatch({
          type: "TOGGLE_MINIMIZE",
          payload: state.windowSize,
        });
        if (app?.callback) {
          app?.callback("MINIMIZE_APP");
        }
      }
    };
    addShortcutListener("minimize_app", handleMinimize);
    return () => {
      removeShortcutListener("minimize_app", handleMinimize);
    };
  }, [app?.slug, app.isActive, state.isMinimized, state.windowSize]);

  useEffect(() => {
    const handleMaximize = () => {
      if (app?.slug && app.isActive) {
        dispatch({
          type: "TOGGLE_MAXIMIZE",
          payload: {
            width: window.innerWidth,
            height: window.innerHeight - 37,
          },
        });
      }
    };
    addShortcutListener("maximize_app", handleMaximize);
    return () => {
      removeShortcutListener("maximize_app", handleMaximize);
    };
  }, [app?.slug, app.isActive]);

  if (state.isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="window-drop-shadow  rounded-[10px]"
      style={{
        width: `${state.windowSize.width}px`,
        height: `${state.windowSize.height}px`,
        transform: state.isMaximized
          ? undefined
          : `translate(${state.position.x}px, ${state.position.y - 37}px)`,
        overflow: state.isMinimized ? "hidden" : "auto",
        position: "absolute",
        minWidth: `${state.defaultSize.width}px`,
        minHeight: `${state.defaultSize.height}px`,
        zIndex: state.isDragging ? 3 : app?.isActive ? 2 : 1,
      }}
    >
      <div
        className="mx-auto overflow-hidden h-full w-full"
        style={{
          minWidth: `${state.defaultSize.width}px`,
          minHeight: `${state.defaultSize.height}px`,
          position: "relative",
        }}
      >
        <div
          className="relative flex items-center bg-primary h-[35px] select-none"
          onMouseDown={handleMouseDown}
          style={{ cursor: state.isMaximized ? "default" : "move" }}
        >
          {/* Left Control Buttons */}
          <div className="flex items-center gap-[8px] pl-[10px]">
            <button
              className="w-[12px] h-[12px] bg-[#FF6157] rounded-full"
              onClick={() => {
                if (app?.callback) {
                  app?.callback("CLOSE_APP");
                }
              }}
              title={`Close ${formatKeys(getShortcutByCommand("exit_app"))}`}
              style={{ outline: "none", border: "none" }}
            />
            <button
              className="w-[12px] h-[12px] bg-[#FFC12F] rounded-full"
              onClick={() => {
                dispatch({
                  type: "TOGGLE_MINIMIZE",
                  payload: state.windowSize,
                });
                if (app?.callback) {
                  app?.callback("MINIMIZE_APP");
                }
              }}
              title={
                state.isMinimized
                  ? "Restore"
                  : `Minimize ${formatKeys(
                      getShortcutByCommand("minimize_app"),
                    )}`
              }
              style={{ outline: "none", border: "none" }}
            />
            {isResizable && app.windowSize.isAppWindowResizing && (
              <button
                className="w-[12px] h-[12px] bg-[#2ACB42] rounded-full"
                onClick={() => {
                  // playSound("click");
                  dispatch({
                    type: "TOGGLE_MAXIMIZE",
                    payload: {
                      width: window.innerWidth,
                      height: window.innerHeight - 37,
                    },
                  });
                }}
                title={
                  state.isMaximized
                    ? "Restore"
                    : `Maximize ${formatKeys(
                        getShortcutByCommand("maximize_app"),
                      )}`
                }
                style={{ outline: "none", border: "none" }}
              />
            )}
          </div>

          {/* Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Typography variant="p" className="text-neutral-500 text-[15px]">
              {app.name}
            </Typography>
          </div>
        </div>

        {!state.isMinimized && (
          <div
            className="h-full w-full bg-secondary"
            style={{
              maxHeight: `${state.windowSize.height - 37}px`,
            }}
          >
            {isValidElement(children) && typeof children.type !== "string"
              ? React.cloneElement(children as ReactElement<WindowSizeProps>, {
                  windowSize: state.windowSize,
                  isAppWindowResizing: state.resizeStart !== null,
                })
              : children}
          </div>
        )}

        {/* Resize Handle */}
        {isResizable && !state.isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize"
            style={{
              borderBottomRightRadius: "10px",
            }}
            onMouseDown={handleResizeStart}
          />
        )}
      </div>
    </div>
  );
};

export default WindowWithoutSideMenu;
