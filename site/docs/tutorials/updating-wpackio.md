---
title: Updating wpackio scripts to the latest version
order: -1
shortTitle: Update wpackio
---

Updating `@wpackio/scripts` and related toolchain is very straight forward and
just like updating any other nodejs dependencies.

First update the package by running

```bash
yarn upgrade-interactive --latest
```

or

```bash
yarn add @wpackio/scripts --dev
# IF USING NPM
npm i --save-dev @wpackio/scripts
```

This will install the latest version.

Now run the following command

```bash
yarn bootstrap
# IF USING NPM
npm run bootstrap
```

This will check for other updates necessary and install the latest version of
needed packages.
