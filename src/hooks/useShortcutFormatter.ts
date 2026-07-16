import { useEffect, useRef, useState } from "react";

export type OS = "windows" | "mac" | "linux";

export interface UseShortcutFormatterReturn {
  formatKeys: (keys?: string[]) => string;
  getShortcutByCommand: (command: string) => string[];
  addShortcutListener: (command: string, listener: (e: KeyboardEvent) => void) => void;
  removeShortcutListener: (command: string, listener: (e: KeyboardEvent) => void) => void;
}

interface ShortcutDefinition {
  command: string;
  shortcut: string[];
}

const globalKeyboardShortcuts: ShortcutDefinition[] = [
  { command: "focus_search", shortcut: ["ctrl", "k"] },
  { command: "escape_button_action", shortcut: ["escape"] },
];

const keyMap: Record<OS, Record<string, string>> = {
  windows: {
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    meta: "Win",
    escape: "Esc",
    enter: "Enter",
    k: "K",
  },
  mac: {
    ctrl: "Ctrl",
    alt: "⌥",
    shift: "⇧",
    meta: "⌘",
    escape: "Esc",
    enter: "Enter",
    k: "K",
  },
  linux: {
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    meta: "Meta",
    escape: "Esc",
    enter: "Enter",
    k: "K",
  },
};

const detectOS = (): OS => {
  if (typeof navigator === "undefined") {
    return "windows";
  }

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("mac")) return "mac";
  if (userAgent.includes("win")) return "windows";

  return "linux";
};

const matchShortcut = (event: KeyboardEvent, shortcut: string[], os: OS): boolean => {
  const normalizedShortcut = shortcut.map((key) => key.toLowerCase());

  const hasModifier = normalizedShortcut.includes("ctrl")
    ? event.ctrlKey
    : normalizedShortcut.includes("meta")
      ? event.metaKey
      : normalizedShortcut.includes("alt")
        ? event.altKey
        : true;

  if (!hasModifier) return false;

  const primaryKey = normalizedShortcut.find((key) => !["ctrl", "meta", "alt", "shift"].includes(key));

  if (!primaryKey) return normalizedShortcut.every((key) => {
    if (key === "ctrl") return event.ctrlKey;
    if (key === "meta") return event.metaKey;
    if (key === "alt") return event.altKey;
    if (key === "shift") return event.shiftKey;
    return false;
  });

  const matchesPrimaryKey = event.key.toLowerCase() === primaryKey;
  const shiftRequired = normalizedShortcut.includes("shift");
  const shiftMatches = shiftRequired ? event.shiftKey : true;

  return matchesPrimaryKey && shiftMatches;
};

const useShortcutFormatter = (): UseShortcutFormatterReturn => {
  const [os, setOS] = useState<OS>("windows");
  const listenersRef = useRef<Map<string, Set<(e: KeyboardEvent) => void>>>(new Map());

  useEffect(() => {
    setOS(detectOS());
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of globalKeyboardShortcuts) {
        if (matchShortcut(event, shortcut.shortcut, os)) {
          const listeners = listenersRef.current.get(shortcut.command);
          if (listeners) {
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
  }, [os]);

  const formatKeys = (keys: string[] = []): string => {
    return keys
      .map((key) => keyMap[os][key.toLowerCase()] || key.toUpperCase())
      .join(" + ");
  };

  const getShortcutByCommand = (command: string): string[] => {
    const found = globalKeyboardShortcuts.find((shortcut) => shortcut.command === command);
    return found ? found.shortcut : [""];
  };

  const addShortcutListener = (command: string, listener: (e: KeyboardEvent) => void) => {
    if (!listenersRef.current.has(command)) {
      listenersRef.current.set(command, new Set());
    }

    listenersRef.current.get(command)!.add(listener);
  };

  const removeShortcutListener = (command: string, listener: (e: KeyboardEvent) => void) => {
    if (listenersRef.current.has(command)) {
      listenersRef.current.get(command)!.delete(listener);
    }
  };

  return {
    formatKeys,
    getShortcutByCommand,
    addShortcutListener,
    removeShortcutListener,
  };
};

export default useShortcutFormatter;
