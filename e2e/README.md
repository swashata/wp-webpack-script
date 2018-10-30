# End 2 End Tests for wpack.io

This directory contains the setup for e2e tests on wpack.io tooling.

## `index.html`

This is a stub we have hard-coded which would `<script src>` all generated assets.
The URLs are given w.r.t `wp-content/plugins/<slug>/dist`, because `webpack-dev-server`
is configured in such a way.

## Running Tests

First we need to start a static website server. This is done with `serve`.

```bash
yarn serve
```

Now open another terminal and start wpack.io hot server.

```bash
yarn start
```

Once it starts rolling, we would use [cypress](https://www.cypress.io/) to run
all e2e tests on browsers.

```bash
yarn cypress:open
```

Once it is complete, we would check for build (production) files.

```bash
yarn build
yarn test
```

This will build production files and will use jest to check for files which were
created during the process.

## In CI

We use travis CI and the following sequence of commands take care of e2e testing.

```yml
script:
    - yarn
    - yarn serve &>/dev/null &
    - yarn wait-for-test-server
    - yarn start &>/dev/null &
    - yarn wait-for-wpackio-server
    - yarn cypress:run
    - yarn build
    - yarn test
```

We use the public version of cypress dashboard, which can be found [here](https://dashboard.cypress.io/#/projects/r3p1vm/runs).

## Why on OSX?

Due to some reason, the webpack watch doesn't work when we change the file
content with node `fs.writeFileSync`. This is limited to travis-ci ubuntu only
(I guess). But I've found when using `osx` as `os`, it works just fine.
