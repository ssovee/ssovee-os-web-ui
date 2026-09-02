/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppInterface } from "@/types/appsList";

export interface PluginSetting {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "select" | "color";
  defaultValue?: unknown;
  options?: { label: string; value: unknown }[];
  description?: string;
}

export interface PluginWindowSize {
  windowSize: { width: number; height: number };
  isAppWindowResizing: boolean;
}

export interface PluginManifest {
  name: string;
  slug: string;
  version: string;
  author: string;
  description: string;
  keywords?: string[];
  icon?: string;
  entryPoint: string;
  permissions: string[];
  settings: PluginSetting[];
  category?: string;
  windowSize?: PluginWindowSize;
  repository?: string;
  minWidth?: number;
  minHeight?: number;
  isResizing?: boolean;
}

export interface PluginAPI {
  showToast: (message: string, type: "success" | "error" | "info") => void;
  openApp: (app: AppInterface) => void;
  getUser: () => Promise<any>;
  getToken: () => Promise<string>;
  isDarkTheme?: boolean;
}

export interface PluginComponentProps {
  api?: PluginAPI;
  app: AppInterface;
}
