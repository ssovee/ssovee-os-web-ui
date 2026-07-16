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
- `useShortcutFormatter`
- `cn`

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

## Hook and utility usage

```tsx
import { cn, useShortcutFormatter } from "ssovee-os-web-ui";

const { formatKeys } = useShortcutFormatter();
const className = cn("button", isActive && "button-active");
const shortcutLabel = formatKeys(["ctrl", "k"]);
```

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
