# bt-monorepo

This is supposed to resemble a corporate web platform with a secure, public, identity provider as well as a design system. Eventually...

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=bugs)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=bjorntirsen_bt-monorepo&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=bjorntirsen_bt-monorepo)

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
