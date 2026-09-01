import { useState, useEffect, useRef, useCallback } from "react";
import { UAParser } from "ua-parser-js";

type OS = "mac" | "windows" | "linux";

type KeyMap = {
  [key in OS]: {
    [key: string]: string;
  };
};

export type Shortcut = {
  command: string;
  shortcut: string[];
  usage: string;
};

const keyMap: KeyMap = {
  mac: {
    ctrl: "⌘",
    cmd: "⌘",
    meta: "⌘",
    alt: "⌥",
    option: "⌥",
    shift: "⇧",
    enter: "⏎",
    backspace: "⌫",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
  },
  windows: {
    ctrl: "Ctrl",
    cmd: "Ctrl",
    meta: "Win",
    alt: "Alt",
    option: "Alt",
    shift: "Shift",
    enter: "Enter",
    backspace: "Backspace",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
  },
  linux: {
    ctrl: "Ctrl",
    cmd: "Ctrl",
    meta: "Super",
    alt: "Alt",
    option: "Alt",
    shift: "Shift",
    enter: "Enter",
    backspace: "Backspace",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
  },
};

const detectOS = (): OS => {
  const parser = new UAParser();
  const osName = parser.getOS().name?.toLowerCase() || "";

  if (osName.includes("mac")) return "mac";
  if (osName.includes("windows")) return "windows";
  if (osName.includes("linux")) return "linux";
  return "windows";
};

type UseShortcutFormatterOptions = {
  globalKeyboardShortcuts?: Shortcut[];
};

type UseShortcutFormatterReturn = {
  formatKeys: (keys: string[]) => string;
  getShortcutByCommand: (command: string) => string[];
  addShortcutListener: (
    command: string,
    listener: (e: KeyboardEvent) => void
  ) => void;
  removeShortcutListener: (
    command: string,
    listener: (e: KeyboardEvent) => void
  ) => void;
};

const normalizeKey = (key: string) => key.toLowerCase();

const matchShortcut = (event: KeyboardEvent, shortcut: string[], os: OS) => {
  const keySet = new Set(shortcut.map(normalizeKey));
  const pressed: string[] = [];

  if (os === "mac") {
    if (event.metaKey) pressed.push("ctrl");
  } else {
    if (event.ctrlKey) pressed.push("ctrl");
  }
  
  if (event.altKey) pressed.push("alt");
  if (event.shiftKey) pressed.push("shift");

  if (event.key && !["Control", "Meta", "Alt", "Shift"].includes(event.key)) {
    pressed.push(normalizeKey(event.key));
  }

  if (pressed.length !== shortcut.length) return false;
  return pressed.every((k) => keySet.has(k));
};

const useShortcutFormatter = ({
  globalKeyboardShortcuts = [],
}: UseShortcutFormatterOptions = {}): UseShortcutFormatterReturn => {
  const [os, setOS] = useState<OS>("windows");
  const listenersRef = useRef<Map<string, Set<(e: KeyboardEvent) => void>>>(
    new Map()
  );

  useEffect(() => {
    setOS(detectOS());
  }, []);

  useEffect(() => {
    if (!globalKeyboardShortcuts.length) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of globalKeyboardShortcuts) {
        if (matchShortcut(event, shortcut.shortcut, os)) {
          const listeners = listenersRef.current.get(shortcut.command);
          if (listeners && listeners.size > 0) {
            event.preventDefault();
            listeners.forEach((cb) => cb(event));
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [os, globalKeyboardShortcuts]);

  const formatKeys = useCallback(
    (keys: string[] = []): string => {
      const separator = os === "mac" ? "" : " + ";
      return keys
        .map((key) => keyMap[os][key.toLowerCase()] || key.toUpperCase())
        .join(separator);
    },
    [os]
  );

  const getShortcutByCommand = useCallback(
    (command: string): string[] => {
      const found = globalKeyboardShortcuts.find((s) => s.command === command);
      return found ? found.shortcut : [];
    },
    [globalKeyboardShortcuts]
  );

  const addShortcutListener = useCallback(
    (command: string, listener: (e: KeyboardEvent) => void) => {
      if (!listenersRef.current.has(command)) {
        listenersRef.current.set(command, new Set());
      }
      listenersRef.current.get(command)!.add(listener);
    },
    []
  );

  const removeShortcutListener = useCallback(
    (command: string, listener: (e: KeyboardEvent) => void) => {
      if (listenersRef.current.has(command)) {
        listenersRef.current.get(command)!.delete(listener);
      }
    },
    []
  );

  return {
    formatKeys,
    getShortcutByCommand,
    addShortcutListener,
    removeShortcutListener,
  };
};

export default useShortcutFormatter;