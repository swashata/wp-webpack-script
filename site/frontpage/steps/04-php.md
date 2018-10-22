---
title: Consume scripts & styles with PHP
order: 4
image: ./04-php.png
---

First install php helper API [`wpackio-enqueue`](https://github.com/swashata/wpackio-enqueue)
with [composer](https://getcomposer.org/).

```bash
composer require wpackio/enqueue
```

We instruct it to load the files right way, using WordPress APIs like
[`wp_enqueue_script`](https://developer.wordpress.org/reference/functions/wp_enqueue_script/) and
[`wp_enqueue_style`](https://developer.wordpress.org/reference/functions/wp_enqueue_style/).

Everything is taken care for you when
