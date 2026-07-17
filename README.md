# ssovee-os-web-ui

Reusable React UI components for consuming projects.

## Install

```bash
npm install ssovee-os-web-ui
```

If your app does not already include React, install it as well:

```bash
npm install react react-dom
```

## CSS import

In the consuming app, add only the package theme stylesheet to your global CSS:

```css
@import "ssovee-os-web-ui/theme.css";
```

## Use components

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
- `Table` and its subcomponents

Internal helpers such as `useShortcutFormatter` and `cn` are used inside the library implementation and are not part of the recommended consumer API.
