# ssovee-os-web-ui

A standalone React UI component library that packages the shared, reusable components from this repository into a publishable npm package.

## Features

- Shared UI component exports for multiple applications
- TypeScript-friendly component interfaces
- Tree-shakeable package build output
- SemVer-friendly publish workflow

## Installation

Install the library in your app:

```bash
npm install ssovee-os-web-ui
```

If your app does not already include React and React DOM, install them as well:

```bash
npm install react react-dom
```

This library uses Tailwind CSS. Install Tailwind CSS in the consuming application and follow the configuration below so Tailwind generates the library's classes.

The package entry is intended to provide the public React component surface. Internal helper hooks and utilities used by the components remain implementation details and are not part of the consumer-facing API.

## Tailwind CSS setup

Import the supplied base theme once from your application's global CSS file:

```css
@import "ssovee-os-web-ui/theme.css";
```

For Tailwind v3, add the library build output to `content` and use the supplied preset:

```js
import ssoveePreset from "ssovee-os-web-ui/tailwind-preset";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/ssovee-os-web-ui/dist/**/*.{js,mjs,cjs}",
  ],
  presets: [ssoveePreset],
};
```

For Tailwind v4, import the package theme stylesheet directly in your global CSS. The package theme entry already carries the Tailwind bootstrap and library source scanning for the built dist output, so consumers do not need to repeat the `@source`/`@import "tailwindcss"` lines in their app CSS:

```css
@import "ssovee-os-web-ui/theme.css";
```

If you use a project-level `tailwind.config.js`, the package also publishes a ready-to-reference config entry that already applies the preset by default:

```js
import ssoveePreset from "ssovee-os-web-ui/tailwind-preset";

export default {
  presets: [ssoveePreset],
};
```

You can also point your app at the published config file directly via the package export:

```js
import ssoveePreset from "ssovee-os-web-ui/tailwind.config.js";
```

The preset includes the library's semantic colors (`primary`, `secondary`, `surface-*`, `brand-color`, `border-1`, and `muted`). Override the `--ssovee-*` CSS variables in your application to customize the theme.

## Usage

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

## Available exports

The library publishes the following shared UI components from the package entry point:

- `Button`
- `Input`
- `TextArea`
- `Select`
- `Checkbox`
- `Toggle`
- `Dropdown`
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
- `Table` and its table subcomponents

Internal helper hooks and utilities such as `useShortcutFormatter` and `cn` are used within the component implementation and are not documented as public package exports.

## Package structure

```text
src/
  components/
  hooks/
  utils/
  index.ts
```

## Build

```bash
npm install
npm run build
```

## Internal component helpers

The source tree contains helper hooks and utilities used only by the component implementation. These are internal implementation details and are not intended to be consumed directly via the library package entry.

## Versioning and release

Use semantic versioning for releases:

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

Then publish:

```bash
npm login
npm publish --access public
```

## CI publish workflow

This repo is prepared for automated release publishing through GitHub Actions using the `NODE_AUTH_TOKEN` secret.

Before publishing, add an npm automation token with publish permission as the repository's `NPM_TOKEN` Actions secret. Create a version commit and matching tag (for example, `v0.1.1`), then push the tag to trigger the workflow.
