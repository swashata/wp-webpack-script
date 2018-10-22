# `@wpackio/cli`

A cli tooling intended to be used with `npx` to quickly add needed dependencies
to your WordPress theme/plugin project.

For more information, check our website [wpack.io](https://wpack.io).

## Installation

If using `yarn`

```bash
yarn global add @wpackio/cli
```

or with `npm`

```bash
npm i -g @wpackio/cli
```

It creates a `wpackio-cli` binary to your system. Run it with

```bash
wpackio-cli --client yarn
```

> **NOTE**: This is not intended to be used locally, rather globally or with
> `npx`. See usage instruction below.

## Usage

To add `@wpackio/scripts` dependency to your project, run this tool.

```bash
npx @wpackio/cli
```

## Options

##### `-c, --client [npm|yarn]

Specify which npm client you want to use, `yarn` or `npm`.

It tries to detect automatically, if `yarn.lock` file is present in the directory.
But it can be overridden with `-c`.

```bash
npx @wpackio/cli --client yarn
```

## Development

This package has the same `npm scripts` as this monorepo. These should be run
using `lerna run <script>`. More information can be found under [CONTRIBUTION.md](../../CONTRIBUTION.md).

-   `build`: Use babel to build for nodejs 8.6+. Files inside `src` are compiled and put under `lib`. All type definitions are stripped and individual type declaration files are created.
-   `prepare`: Run `build` after `yarn` and before `publish`.
-   `lint`: Lint all files using tslint.
-   `test`: Run tests on files using jest.
