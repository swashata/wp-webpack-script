---
title: Server Configuration with wpackio.server.js
order: 2
shortTitle: Server Configuration
---

The `wpackio.server.js` file at the root of your workspace tells wpackio how
your development server is handled.

It is used to proxy an existing development server and run webpack and
browsersync on top of it, to give you the ultimate developer experience.

> You should NOT commit `wpackio.server.js` with your VCS, if you do not have
> docker based development. In case of mamp, wamp, vvv, local server generally
> differs for team members.

A typical server file looks like this.

```js
module.exports = {
	// Your LAN IP or host where you would want the live server
	// Override this if you know your correct external IP (LAN)
	// Otherwise, the system will always try to get a LAN ip.
	// This will also create some issues with file watching because for
	// some reason, service-worker doesn't work on localhost?
	// https://github.com/BrowserSync/browser-sync/issues/1295
	// So it is recommended to change this to your LAN IP.
	// If you intend to access it from your LAN (probably do?)
	host: undefined,
	// Your WordPress development server address
	proxy: 'http://localhost:8080',
	// PORT on your localhost where you would want live server to hook
	port: 3000,
	// UI passed directly to browsersync
	ui: {
		port: 3001,
	},
	// Whether to show the "BrowserSync Connected"
	notify: false,
	// Open the dev server URL, set false to disable
	open: true,
	// BrowserSync ghostMode, set to false to completely disable
	ghostMode: {
		clicks: true,
		scroll: true,
		forms: true,
	},
	// Override system calculated public path of the `dist` directory
	// This must have forward slash, otherwise it will not work.
	distPublicPath: undefined,
};
```

Let's dive in deep with different options.

## `host` (`string`)

The IP Address of your local network. An IP is needed because only then can we
properly have browser-sync accessible across network and have our service
workers work.

wpackio will try to determine the best possible IP address from your interfaces
and will use that.

If you pass a specific value (`192.168.1.102`), then it will be used instead.

## `proxy` (`string`)

The URL of the local WordPress development server where your theme/plugin is
installed and being developed upon.

Right now, we recommend having a Root WordPress installation (not sub-folder).
If you have sub-folder installation, then put the whole URL as proxy like
`http://localhost/wp-plugin`

## `port` (`number`)

A port where the development hot server will live.

## `ui` (`Object`)

Passed directly to
[browser-sync](https://browsersync.io/docs/options#option-ui).

## `notify` (`boolean`)

Whether or not to show notification on browser.

## `open` (`boolean`)

Whether to automatically open the local server on your browser.

## `ghostMode` (`boolean`|`Object`)

Passed directly to
[browser-sync](https://browsersync.io/docs/options#option-ghostMode).

## `distPublicPath` (`string`)

Absolute URL path (without protocol and host) of the `outputPath` defined in
your project configuration. It is used for development server only and has no
effect on the production build.

By default `wpackio-scripts` calculates the URL of the `outputPath` in this way

```
/wp-content/{{plugins|themes}}/{{slug}}/{{outputPath}}/
```

So this assumes that

- WordPress proxy server is installed in root and not in sub-directory.
- The directory structures of plugins, themes are set as default.
- You have entered the correct `slug` in your project configuration and it
  matches with the directory structure of your development server.

In case, your development server doesn't work like this, you can specify your
`distPublicPath` manually.

```
/wp-custom-content/secret-plug-directory/overriden-slug/dist/
```

**Remember you have to put a forward slash at the end of the value**.
