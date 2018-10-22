---
title: Start development server
order: 5
image: ./05-start.gif
---

```bash
npm start
```

Or if using `yarn`

```bash
yarn start
```

This will start the development server proxying your local WordPress server. Now
you can have access to hot module replacement and live file watching. Just edit
your files and see it live in the browser.

In the image, we see changing the heading is seen live in the browser. It is done
through `react-hot-loader`. Do check out advanced concepts to learn how we have
set that up.

Once done, press `Ctrl` + `c` to stop the server.
