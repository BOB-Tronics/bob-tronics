# Bob Tronics Frontend

This is the Next.js frontend for the Bob Tronics project.

## Project structure

- `src/app/` — app pages and layout
- `public/` — static assets
- `next.config.ts` — Next.js configuration
- `package.json` — scripts and dependencies

## Run locally

From the `frontend` folder:

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000

## Production build

```bash
npm run build
npm run start
```

## Useful commands

```bash
npm run lint
```

## Notes

- The dev server listens on `0.0.0.0:3000` so it is easier to access in local development and containers.
- Keep the app code inside the `frontend` folder unless the project is intentionally expanded into a monorepo structure.
