# ssovee-os-web-ui

Reusable React UI components for building shared desktop-style web experiences.

## Overview

This package provides a shared set of React UI components for SSOVEE applications. It includes themed UI primitives, hooks, and desktop-style window wrappers for app-like layouts.

## Features

- Ready-to-use React UI components
- Packaged theme stylesheet for shared visual tokens
- TypeScript support for the main public components
- Window components for desktop-style app shells
- Plugin playground support for local plugin testing

## Install

```bash
npm install ssovee-os-web-ui
```

If your app does not already include React, install it as well:

```bash
npm install react react-dom
```

## CSS import

Import the package stylesheet once in your app entry file or global stylesheet:

```ts
import "ssovee-os-web-ui/theme.css";
```

If your setup prefers CSS imports, this also works:

```css
@import "ssovee-os-web-ui/theme.css";
```

## Basic usage

```tsx
import { Button, Input, Card } from "ssovee-os-web-ui";

export function Example() {
  return (
    <Card>
      <Input placeholder="Search" />
      <Button variant="primary">Save</Button>
    </Card>
  );
}
```

## JSON editor

`JsonEditor` is a controlled Monaco editor configured for JSON by default:

```tsx
import { useState } from "react";
import { JsonEditor } from "ssovee-os-web-ui";

export function SettingsEditor() {
  const [value, setValue] = useState('{"enabled":true}');

  return (
    <JsonEditor
      value={value}
      onChange={setValue}
      theme="light"
      height="320px"
      options={{ minimap: { enabled: false } }}
    />
  );
}
```

Use `theme="vs-dark"` for a dark editor. The component also accepts Monaco `language`, `height`, and `options` props.

## Window components

### Simple window

```tsx
import { WindowWithoutSideMenu, Typography } from "ssovee-os-web-ui";

const app = {
  name: "Notes",
  slug: "notes",
  isActive: true,
  isMinimize: false,
  windowSize: {
    windowSize: { width: 420, height: 320 },
    isAppWindowResizing: false,
  },
};

export function NotesWindow() {
  return (
    <WindowWithoutSideMenu app={app} defaultSize={ { width: 420, height: 320 } }>
      <Typography variant="h6">Notes</Typography>
    </WindowWithoutSideMenu>
  );
}
```

### Window with sidebar menu

```tsx
import { WindowWithSideMenu, Typography, Button } from "ssovee-os-web-ui";

const app = {
  name: "Settings",
  slug: "settings",
  isActive: true,
  isMinimize: false,
  windowSize: {
    windowSize: { width: 720, height: 500 },
    isAppWindowResizing: false,
  },
};

export function SettingsWindow() {
  return (
    <WindowWithSideMenu
      app={app}
      defaultSize={ { width: 720, height: 500 } }
      actionButtons={ { title: "Save", onClick: () => console.log("Saved") } }
      menu={ {
        title: "Navigation",
        items: [
          { title: "Profile", icon: "👤", onClick: () => console.log("Profile"), isActive: true },
          { title: "Security", icon: "🔒", onClick: () => console.log("Security") },
        ],
      } }
    >
      <Typography variant="h6">Settings</Typography>
      <Button variant="primary">Update</Button>
    </WindowWithSideMenu>
  );
}
```

## Skeleton loader

```tsx
import { Skeleton } from "ssovee-os-web-ui";

export function LoadingState() {
  return (
    <div style={ { display: "grid", gap: 12 } }>
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="avatar" className="h-12 w-12" />
      <Skeleton variant="image" className="h-40" />
      <Skeleton variant="card" lines={4} />
    </div>
  );
}
```

## Plugin playground

```tsx
import { PluginPlayground, Typography, Button } from "ssovee-os-web-ui";

const pluginMetadata = {
  title: "Plugin Preview",
  defaultWidth: 720,
  defaultHeight: 520,
  windowVariant: "with-side-menu",
};

export function PluginPreview() {
  return (
    <PluginPlayground
      metadata={pluginMetadata}
      onClose={() => console.log("Playground closed")}
      onMinimize={(isMinimized) => console.log("Minimized:", isMinimized)}
    >
      <div>
        <Typography variant="h6">Plugin Content</Typography>
        <Button variant="primary">Run</Button>
      </div>
    </PluginPlayground>
  );
}
```

## Hooks

Hooks are also available through the SDK-style entrypoint:

```tsx
import { useGridClasses, useDeviceSupport, useSound } from "ssovee-os-web-ui/sdk";
```

## Public exports

The package exports these components and types for external use:

- `Button`
- `Input`
- `TextArea`
- `JsonEditor`
- `Select`
- `SelectOption`
- `Checkbox`
- `Toggle`
- `Dropdown`
- `DropdownOption`
- `Loading`
- `Skeleton`
- `Toast`
- `Alert`
- `Modal`
- `Card`
- `Badge`
- `Avatar`
- `Divider`
- `Tooltip`
- `SearchInput`
- `FileUpload`
- `Progress`
- `Pagination`
- `Radio`
- `Accordion`
- `Tabs`
- `Typography`
- `ImageWithPlaceholder`
- `PluginPlayground`
- `WindowWithSideMenu`
- `WindowWithoutSideMenu`
- `Table` and its subcomponents
- `useGridClasses`
- `useShortcutFormatter`
- `useDeviceSupport`
- `useSound`

The hooks are available from the package entrypoint and from the SDK subpath.

## License

MIT
