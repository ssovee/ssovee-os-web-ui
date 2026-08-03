# ssovee-os-web-ui

Reusable React UI components for building shared desktop-style web experiences.

## Overview

This package provides a shared set of React UI components for SSOVEE applications. It includes themed UI primitives, hooks, and desktop-style window wrappers for app-like layouts.

## What’s new in v0.1.24

- Added window container components for app-style layouts
- Documented usage examples for both window variants
- Improved package exports for easier consumption

## Features

- Ready-to-use React UI components
- Packaged theme stylesheet for shared visual tokens
- TypeScript support for the main public components
- Window components for desktop-style app shells

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

## Window components

### Simple window

{% raw %}
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
    <WindowWithoutSideMenu app={app} defaultSize={{ width: 420, height: 320 }}>
      <Typography variant="h6">Notes</Typography>
    </WindowWithoutSideMenu>
  );
}
```
{% endraw %}

### Window with sidebar menu

{% raw %}
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
      defaultSize={{ width: 720, height: 500 }}
      actionButtons={{ title: "Save", onClick: () => console.log("Saved") }}
      menu={{
        title: "Navigation",
        items: [
          { title: "Profile", icon: "👤", onClick: () => console.log("Profile"), isActive: true },
          { title: "Security", icon: "🔒", onClick: () => console.log("Security") },
        ],
      }}
    >
      <Typography variant="h6">Settings</Typography>
      <Button variant="primary">Update</Button>
    </WindowWithSideMenu>
  );
}
```
{% endraw %}

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
- `Select`
- `SelectOption`
- `Checkbox`
- `Toggle`
- `Dropdown`
- `DropdownOption`
- `Loading`
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
