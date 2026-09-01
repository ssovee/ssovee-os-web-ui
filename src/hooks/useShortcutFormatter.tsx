import { useState, useEffect, useRef } from "react";
import { UAParser } from "ua-parser-js";

type OS = "mac" | "windows" | "linux";

type KeyMap = {
  [key in OS]: {
    [key: string]: string;
  };
};

type Shortcut = {
  command: string;
  shortcut: string[];
  usage: string;
};

const keyMap: KeyMap = {
  mac: {
    ctrl: "⌘",
    alt: "⌥",
    shift: "⇧",
    enter: "⏎",
    backspace: "⌫",
    arrowup: "↑",
    arrowdown: "↓",
  },
  windows: {
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    enter: "Enter",
    backspace: "Backspace",
    arrowup: "↑",
    arrowdown: "↓",
  },
  linux: {
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    enter: "Enter",
    backspace: "Backspace",
    arrowup: "↑",
    arrowdown: "↓",
  },
};

const detectOS = (): OS => {
  const parser = new UAParser();
  const osName = parser.getOS().name?.toLowerCase() || "";

  if (osName.includes("mac")) return "mac";
  if (osName.includes("windows")) return "windows";
  if (osName.includes("linux")) return "linux";
  return "windows"; // fallback
};

type UseShortcutFormatterReturn = {
  formatKeys: (keys: string[]) => string;
  getShortcutByCommand: (command: string) => string[];
  addShortcutListener: (
    command: string,
    listener: (e: KeyboardEvent) => void,
  ) => void;
  removeShortcutListener: (
    command: string,
    listener: (e: KeyboardEvent) => void,
  ) => void;
};

const normalizeKey = (key: string) => key.toLowerCase();

const matchShortcut = (event: KeyboardEvent, shortcut: string[], os: OS) => {
  // Normalize keys for comparison
  const keySet = new Set(shortcut.map(normalizeKey));
  // Map event to normalized keys
  const pressed: string[] = [];
  if (os === "mac") {
    if (event.metaKey) pressed.push("ctrl");
  } else {
    if (event.ctrlKey) pressed.push("ctrl");
  }
  if (event.altKey) pressed.push("alt");
  if (event.shiftKey) pressed.push("shift");
  // The main key
  if (event.key && !["Control", "Meta", "Alt", "Shift"].includes(event.key)) {
    pressed.push(normalizeKey(event.key));
  }
  // Compare sets
  if (pressed.length !== shortcut.length) return false;
  return pressed.every((k) => keySet.has(k));
};

const useShortcutFormatter = ({
  globalKeyboardShortcuts = [],
}: {
  globalKeyboardShortcuts?: Shortcut[];
}): UseShortcutFormatterReturn => {
  const [os, setOS] = useState<OS>("windows");
  const listenersRef = useRef<Map<string, Set<(e: KeyboardEvent) => void>>>(
    new Map(),
  );

  useEffect(() => {
    setOS(detectOS());
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of globalKeyboardShortcuts) {
        if (matchShortcut(event, shortcut.shortcut, os)) {
          const listeners = listenersRef.current.get(shortcut.command);
          if (listeners) {
            event.preventDefault(); // Prevent browser defaults for matched shortcuts
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
    const found = globalKeyboardShortcuts.find((s) => s.command === command);
    return found ? found.shortcut : [""];
  };

  const addShortcutListener = (
    command: string,
    listener: (e: KeyboardEvent) => void,
  ) => {
    if (!listenersRef.current.has(command)) {
      listenersRef.current.set(command, new Set());
    }
    listenersRef.current.get(command)!.add(listener);
  };

  const removeShortcutListener = (
    command: string,
    listener: (e: KeyboardEvent) => void,
  ) => {
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
