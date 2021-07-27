---
title: Configure JS entry-points
order: 3
image: ./03-config.png
---

Now edit your newly generated `wpackio.project.js` file and put your javascript
entry-points. An entry-point is the
[`module`](http://2ality.com/2014/09/es6-modules-final.html) which runs the
final javascript code on browser. It can (and should) `import` other modules
which has `export`-ed something.

[webpack](https://webpack.js.org) will automatically bundle all the dependencies
together. For more information
[read the guide](https://webpack.js.org/concepts/#entry).

You can have multiple entry-point under the same entry, or have multiple file
entry. More information can be found in the docs.
