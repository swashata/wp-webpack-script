---
order: 2
title: How does <span class="wpackio-logo-text">wpack.<em>io</em></span> work?
---

Glad you asked. Behind the scene, <span class="wpackio-logo-text">wpack.<em>io</em></span> works on top of
[webpack](https://webpack.js.org) and [browser-sync](https://browsersync.io/).

It considers the fact that we serve files from WordPress, through `wp_enqueue_*`
APIs and there could be multiple webpack compiled assets on the same page, coming
from different plugins and themes.

Keeping it in mind and of course to provide a great **DX**, wpackio was made. If
you would like to know more about the inner working and principles, please read
the [concepts](/concepts/).
