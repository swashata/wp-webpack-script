---
title: Bootstrap with @wpakcio/cli
order: 1
shortTitle: '@wpackio/cli'
---

The package `@wpackio/cli` comes with one binary `wpackio-cli`. We do not
recommend installing it directly. It is best to use it with `npx` (which comes
with npm 5.2+).

## Install globally

```bash
npm i -g @wpackio/cli
wpackio-cli --help
```

## Using with `npx`

```bash
npx @wpackio/cli --help
```

## Usage

The command doesn't take any parameters. It is used to
[bootstrap `@wpackio/scripts`](/guides/getting-started/) in your project.

Simply navigate to your project.

```bash
cd my-awesome-project
```

And run it.

```bash
npx @wpackio/cli
```

Then follow the screen instruction.
