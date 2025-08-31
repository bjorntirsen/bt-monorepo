# bt-monorepo

This is supposed to resemble a corporate web platform with a secure, public, identity provider as well as a design system. Eventually...

## Quickstart

1. Clone repo.

2. Make sure you have [Node](https://nodejs.org/en) and [pnpm](https://pnpm.io/) installed on your computer.

3. Run `pnpm i`.

4. Run `pnpm dev`.

5. Happy coding!

## Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## TODO

[ ] rename web to public web
[ ] update public web appearance
[ ] create a vite secure app
[ ] create a fastify secure bff
[ ] create a vite idp app
[ ] create a fastify idp bff with a fake backend
[ ] link them together
[ ] create design system
