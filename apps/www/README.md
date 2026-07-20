# SSOVEE UI Demo App

This app is the interactive playground for `ssovee-os-web-ui`. It lives in `apps/www` and is used to validate component behavior and visual styles in a consumer environment.

## Scripts

From this folder:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

From repository root:

```bash
npm run dev:www
npm run build:www
npm run lint:www
```

## Styling

The demo imports package styles from:

```ts
import 'ssovee-os-web-ui/theme.css'
```

This validates the published consumer-facing stylesheet path.
