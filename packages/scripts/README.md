# `@wpackio/scripts`

<p align="center">
  <a href="https://wpack.io"><img width="600" height="130" src="https://raw.githubusercontent.com/swashata/wp-webpack-script/master/assets/wpackio-logo.png"></a>
</p>

This is the main scripts package of [wpack.io](https://wpack.io) tool.

> Please refer to the readme of this repo for usage instruction.

It produces an executable named `wpackio-scripts`.

## Installation

If using `yarn`

```bash
yarn add @wpackio/scripts
```

or with `npm`

```bash
npm i @wpackio/scripts
```

## Usage

The `wpackio-scripts` executable requires `wpackio.project.js` and `wpackio.server.js`
within your project root.

Please check [our documentation](https://wpack.io) for full documentation.

```bash
`npm bin`/wpackio-scripts bootstrap
```

Create configuration in a project.

```bash
`npm bin`/wpackio-scripts start
```

Start the development server.

```bash
`npm bin`/wpackio-scripts build
```

Build production files.

## Development

This package has the same `npm scripts` as this monorepo. These should be run
using `lerna run <script>`. More information can be found under [CONTRIBUTION.md](../../CONTRIBUTION.md).

-   `build`: Use babel to build for nodejs 8.6+. Files inside `src` are compiled and put under `lib`. All type definitions are stripped and individual type declaration files are created.
-   `prepare`: Run `build` after `yarn` and before `publish`.
-   `lint`: Lint all files using tslint.
-   `test`: Run tests on files using jest.
