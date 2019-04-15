# `@wpackio/entrypoint`

A custom entry-point for webpack. This is designed to set the `publicPath` dynamically
under production build. This should not be used elsewhere.

Please see [wpack.io](https://wpack.io) for usage.

## Installation

If using `yarn`

```bash
yarn add @wpackio/entrypoint
```

or with `npm`

```bash
npm i @wpackio/entrypoint
```

## Usage

It is taken care of automatically. What `@wpackio/scripts` does is adds
`@wpackio/entrypoint/lib/index.js` under all entry-points.

It depends on `__WPACKIO__` free variable, as defined by `webpack.DefinePlugin`.
All of it is taken care of by `@wpackio/scripts`.

## Development

This package has the same `npm scripts` as this monorepo. These should be run
using `lerna run <script>`. More information can be found under [CONTRIBUTION.md](../../CONTRIBUTION.md).

-   `build`: Use babel to build for nodejs 8.6+. Files inside `src` are compiled and put under `lib`. All type definitions are stripped and individual type declaration files are created.
-   `prepare`: Run `build` after `yarn` and before `publish`.
-   `lint`: Lint all files using eslint.
-   `test`: Run tests on files using jest.
