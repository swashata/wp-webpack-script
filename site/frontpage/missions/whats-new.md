---
order: 4
title: What's new?
---

#### 📦 VERSION 5

###### 🚀 Support for React Fast Refresh.

Simply have `hasReact: true` in your project config and all your components will
hot reload using
[react refresh plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin).

###### 🚀 Start selective entries during development

If you have multiple entries inside `files` of project config, wpackio will
start all of them when you do `yarn start`, running a multi compiler instance.

This could be slow and distracting when you are working on only one entry at a
time. So now we have a new `CLI` parameter `-e` using which you can specify
which entries to start.

```bash
yarn start -e 0
```

will start the first entry of your `files` array.

```bash
yarn start -e 0 2
```

will start the first and third entries of your `files` array.

---

Kindly see the
[roadmap](https://github.com/swashata/wp-webpack-script/issues/977) for more
info.
