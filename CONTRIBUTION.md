# Contributing

First off, thank you for considering contributing to `wpackio`. It's people like you that make `wpackio` such a great tool.

## How to contribute

Prerequisites:

-   Familiarity with [pull requests](https://help.github.com/articles/using-pull-requests) and [issues](https://guides.github.com/features/issues/).
-   Knowledge of [JavaScript](https://developer.mozilla.org/bm/docs/Web/JavaScript), [Typescript](https://www.typescriptlang.org/), [webpack](https://webpack.js.org/) and [WordPress API](https://developer.wordpress.org).
-   Concepts of [monorepo and lerna](https://lernajs.io/).
-   A strong passion 🔥.

Now let's dive in.

## Create a package

We use [plopjs](https://github.com/amwmedia/plop) to automate boilerplate package generation.

Use it to create a new package.

**`yarn plop`**

Now go through the questions and a new package will be created for you.

## Test

**`yarn test`**

Run all tests through jest.

## Writing code

We use typescript to write code in this repository. It helps avoid many runtime
bugs and a better type system goes a long way to maintain a project.

So please edit files under `src` of every package. For editor, I would suggest
using [🆚Code](https://code.visualstudio.com/).

We don't use `tsc` to compile, we use `babel 7`.

## Publish

**`yarn lerna publish**

This will bump version and publish. Make sure you have access to `@wpackio` npm org
or ask a maintainer.
