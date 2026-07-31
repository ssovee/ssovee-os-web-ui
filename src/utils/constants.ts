export type Shortcut = {
  command: string;
  shortcut: string[];
  usage: string;
};

export const globalKeyboardShortcuts: Shortcut[] = [
  {
    command: "toggle_theme",
    shortcut: ["Ctrl", "Shift", "M"],
    usage: "Toggle between light and dark theme",
  },
  {
    command: "app_switcher",
    shortcut: ["Ctrl", "Shift", "S"],
    usage: "Switch between open apps",
  },
  {
    command: "exit_app",
    shortcut: ["Ctrl", "E"],
    usage: "Exit or quit the application",
  },
  {
    command: "maximize_app",
    shortcut: ["Ctrl", "ArrowUp"],
    usage: "Maximize the application window",
  },
  {
    command: "minimize_app",
    shortcut: ["Ctrl", "ArrowDown"],
    usage: "Minimize the application window",
  },
  {
    command: "global_search",
    shortcut: ["Ctrl", "Shift", "K"],
    usage: "Open global search",
  },
  {
    command: "toggle_search_mode",
    shortcut: ["Ctrl", "Shift", "L"],
    usage: "Enable AI and Voice command (start/stop voice input in search)",
  },
  {
    command: "toggle_control_center",
    shortcut: ["Ctrl", "Shift", "O"],
    usage: "Toggle control center panel or drawer",
  },
  {
    command: "arrow_up",
    shortcut: ["ArrowUp"],
    usage: "Navigate up in lists, menus and options",
  },
  {
    command: "arrow_down",
    shortcut: ["ArrowDown"],
    usage: "Navigate down in lists, menus and options",
  },
  {
    command: "escape_button_action",
    shortcut: ["Escape"],
    usage: "Close or go back from any open alert, popup, search, or control center",
  },
  {
    command: "enter_button_action",
    shortcut: ["Enter"],
    usage: "Select or confirm the currently focused item",
  },
  {
    command: "toggle_filters",
    shortcut: ["Ctrl", "Shift", "U"],
    usage: "To open or close filters of any current active app",
  },
  {
    command: "focus_search",
    shortcut: ["Ctrl", "k"],
    usage: "Focus on current app search",
  },
  {
    command: "toggle_all_apps",
    shortcut: ["Ctrl", "Shift", "A"],
    usage: "Toggle showing all available apps and plugins",
  },
];