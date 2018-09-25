# WordPress webpack Script

[![Build Status](https://travis-ci.com/swashata/wp-webpack-script.svg?branch=master)](https://travis-ci.com/swashata/wp-webpack-script) [![codecov](https://codecov.io/gh/swashata/wp-webpack-script/branch/master/graph/badge.svg)](https://codecov.io/gh/swashata/wp-webpack-script)

## Project npm scope

> `@wpackio`

## 🚧👀This is just a preface and under development. Watch out!👀🚧

The goal of this project is to ease up setting and using webpack with WordPress.
The first few problems I had when going through this

1. Doing a lot of configuration to setup webpack.
2. A lot of things to hook webpack with browsersync. We can not safely have webpack dev server because it doesn't reload for PHP files.
3. A lot of dependencies like babel, webpack loaders and what not.

So I want to have a tool which should be easy to setup, easy to use and opinionated just enough to have a sane
structure, but shouldn't come to you way, if you don't want to.

1. It should work for any sort of project setup, docker, vagrant, mamp, lamp, wamp, the tooling shouldn't restrict you.
2. webpack has support for dynamic imports and code splitting. But setting up public path is a pain point, which should be handled by the tooling.
3. Right out of the box, all dependencies, like babel and webpack loaders should be handled.
4. It should work with existing build system, like gulp.
5. It should harness webpack's power of compiling JS, SASS files, SVG etc.
6. It should hackable to extend webpack config for power users.
7. Provide all tooling for modern javascript development, like linting, formatting, compiling etc.

With that in mind, I start to develop this and hope this will help people out there.
