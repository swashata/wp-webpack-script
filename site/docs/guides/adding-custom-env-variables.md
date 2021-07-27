---
title: Adding custom env variables
order: 3
shortTitle: ENV Variables
---

Starting version `6.0.0` `@wpackio/scripts` can handle custom env variables from

- `.env` file at the root of your project.
- Anything in `process.env` available during `yarn start` or `yarn build`.

All variables starting with `WPAKCIO_` will be available in your application
code without the `WPACKIO_` prefix. So if you have `WPACKIO_SECRET_KEY` in your
env, then you can access it from your app by `process.env.SECRET_KEY`.

### Easiest way to get started

Start by creating a `.env` (note the leading dot) file at the root of your
project. Now paste the following content in it

```text
WPACKIO_STRIPE_PUBLIC_KEY="some-super-secret-key"
WPACKIO_SENDY_PUBLIC_KEY="some-super-secret-key"
```

The above values would be available through `process.env.STRIPE_PUBLIC_KEY` and
`process.env.SENDY_PUBLIC_KEY`. The prefix `WPACKIO_` is automatically stripped
in application code.

```js
const stripeSdk = Stripe(process.env.STRIPE_PUBLIC_KEY);
const elements = stripeSdk.elements();
```

> Anything in the `env` which does not start with `WPACKIO_` is ignored. This is
> made this way to prevent leaking sensitive credentials to the app.
