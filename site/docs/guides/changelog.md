---
title: Changelog
order: 50
shortTitle: Changelog
---

## VERSION 6.4.0

#### `@wpackio/scripts`

- **ENHANCE** `-e`, `--entries` of `wpackio-scripts start` now accepts name of
  entries along with indexex. More
  [here](/tutorials/starting-selective-entries/).

#### Other packages

Non breaking upgrade of dependencies.

## VERSION 6.3.0

#### `@wpackio/scripts`

- **NEW** Option `useBabelConfig` in file config to override project-wide
  configuration for a particular entry.
- **NEW** Option `compileNodeModules` in project config to handle how
  `node_modules` are compiled during production and development.

#### `@wpackio/eslint-config`

- **FIX** Babel plugin not being configured properly for typescript preset.

---

For previous changelogs, kindly visit our
[GitHub Repo](https://github.com/swashata/wp-webpack-script/blob/master/CHANGELOG.md).
