---
title: Upgrading from v5 to v6 and Breaking Changes
order: -2
shortTitle: Breaking v5 ➡️ v6
---

Version 6 of `@wpackio/scripts` has many improvements. While most of the changes
are kept as backward compatible, some might break your project. So please take
note of the followings.

## POSTCSS VERSION UPDATE

`postcss-loader` has been updated to the very latest and now `postcss` is a peer
dependency. So after updating you'd either need to install `postcss`

```bash
yarn add postcss --dev
```

Or bootstrap again

```bash
yarn bootstrap
```

For CSS processing to work.

## AUTOMATIC WORDPRESS SCRIPTS ALIASING

> If you are not using anything from `@wordpress` package, then you are not
> affected.

Starting v6, all modules under `@wordpress` namespace will be automatically
marked as externals. So when you do something like

```js
import { __ } from '@wordpress/i18n';

const greetings = __('Hello World', 'domain');
```

It will be roughly compiled into

```js
const { __ } = wp.i18n;

const greetings = __('Hello World', 'domain');
```

But it doesn't mean you have to add `wp-i18n` script dependency manually. If you
are using `wpackio/enqueue` PHP library, then this process is automatic. No code
change is necessary.

We do this by default only for all `@wordpress` namespace packages. We don't do
this for React, ReactDOM, jQuery or any other scripts.

Except when `optimizeForGutenberg` is set to true. Please see
[Project Configuration](/apis/project-configuration/#optimizeforgutenberg-boolean)
to learn more.

## CHANGES IN MANIFEST

> If you are not dealing with the manifest file directly, then you are not
> affected.

webpack asset manifest plugin has been updated and it has changed the output
format. Accordingly `wpackio/enqueue` has also been updated (`v3.0.0`). If you
are dealing with the manifest directly, then note instead of

```php
$manifest['wpackioEp'][ $entryPoint ]
```

we now have to do

```php
$manifest['wpackioEp'][ $entryPoint ]['assets']
```
