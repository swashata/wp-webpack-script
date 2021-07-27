# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [6.4.0](https://github.com/swashata/wp-webpack-script/compare/v6.3.0...v6.4.0) (2021-07-27)


### Bug Fixes

* eslint and typescript issues after upgrade ([12cc73f](https://github.com/swashata/wp-webpack-script/commit/12cc73f700e3297dc31696486e18d32b969a8939))


### Features

* make entries list accept entry name too ([2c397dc](https://github.com/swashata/wp-webpack-script/commit/2c397dc8fd24bd972b0256997933d6ccac5d4798))





# [6.3.0](https://github.com/swashata/wp-webpack-script/compare/v6.2.0...v6.3.0) (2021-05-26)


### Bug Fixes

* babel plugin not being configured properly for ts ([2b8b2df](https://github.com/swashata/wp-webpack-script/commit/2b8b2dfbc35b9b31f10ef4851add069d611ca1d7))


### Features

* add option useBabelConfig in file config to override project config ([32954a6](https://github.com/swashata/wp-webpack-script/commit/32954a6fe18ecdd9a0795a5cd57683d08363f5a0))
* new project config compileNodeModules ([a9d5951](https://github.com/swashata/wp-webpack-script/commit/a9d5951854cb70fc167e0e10639779341754852d))





# [6.2.0](https://github.com/swashata/wp-webpack-script/compare/v6.1.4...v6.2.0) (2021-05-02)


### Bug Fixes

* issue with bootstrap script ([6985639](https://github.com/swashata/wp-webpack-script/commit/698563917fb1654d299ea1a378c3f982efe9b950)), closes [#1220](https://github.com/swashata/wp-webpack-script/issues/1220)
* use https if proxy url is https ([54d9a44](https://github.com/swashata/wp-webpack-script/commit/54d9a44b06ca44863340b681523eb0ec4e62b7fc)), closes [#1180](https://github.com/swashata/wp-webpack-script/issues/1180)





## [6.1.4](https://github.com/swashata/wp-webpack-script/compare/v6.1.3...v6.1.4) (2021-04-29)


### Bug Fixes

* disable react refresh in babel loader if optimized for gutenberg ([8feddc7](https://github.com/swashata/wp-webpack-script/commit/8feddc751428b9281651ecf6fcc9d3cc9b250f48))





## [6.1.3](https://github.com/swashata/wp-webpack-script/compare/v6.1.2...v6.1.3) (2021-04-29)


### Bug Fixes

* disable react refresh if optimized for gutenberg ([eedf6b6](https://github.com/swashata/wp-webpack-script/commit/eedf6b6d610965ed1239fd76c41c278c4c42540a))





## [6.1.2](https://github.com/swashata/wp-webpack-script/compare/v6.1.1...v6.1.2) (2021-04-29)


### Bug Fixes

* issue with entries in server script ([022daa7](https://github.com/swashata/wp-webpack-script/commit/022daa7dad1a358749f334b3dec47e1a62c0b5a2))





## [6.1.1](https://github.com/swashata/wp-webpack-script/compare/v6.1.0...v6.1.1) (2021-04-29)


### Bug Fixes

* do not use ts checker plugin if hasTypeScript is explicitly false ([b6c35cb](https://github.com/swashata/wp-webpack-script/commit/b6c35cb6fdd692e4f7de46e52f01d54e5ef6d8e5))





# [6.1.0](https://github.com/swashata/wp-webpack-script/compare/v6.0.1...v6.1.0) (2021-04-28)


### Features

* add option to disable handling wordpress externals ([bb99130](https://github.com/swashata/wp-webpack-script/commit/bb991303b5c047641cb13d3d61fc4f0b7fe506f4))





## [6.0.1](https://github.com/swashata/wp-webpack-script/compare/v6.0.0...v6.0.1) (2021-04-27)

**Note:** Version bump only for package @wpackio/scripts





# [6.0.0](https://github.com/swashata/wp-webpack-script/compare/v5.0.0...v6.0.0) (2021-04-26)


### Bug Fixes

* always install postcss to the latest version in bootstrap ([3b3291a](https://github.com/swashata/wp-webpack-script/commit/3b3291ab73c5a2c104d4eaa16ea06ca1af870f7b))
* mini-css-extract-plugin configuration options ([368e528](https://github.com/swashata/wp-webpack-script/commit/368e528690463c372288e50a821df73d0d71de30))
* upgrade webpack-dev-middleware type and fix code ([84c7d48](https://github.com/swashata/wp-webpack-script/commit/84c7d48744bdfbbd5607e5a18c183e8b9af0d162))
* **deps:** update dependency cpy to v8.1.1 ([d205ebf](https://github.com/swashata/wp-webpack-script/commit/d205ebf44b2dc29f77327a06bb2bf491de6a319e))
* **deps:** update dependency mini-css-extract-plugin to ^0.10.0 ([7c463f2](https://github.com/swashata/wp-webpack-script/commit/7c463f2e73152ff800fbd0ce2cf33792ea0e40e0))
* **deps:** update dependency mini-css-extract-plugin to ^0.11.0 ([460a5bd](https://github.com/swashata/wp-webpack-script/commit/460a5bdd09d016b58cff7ce5b217fd6b8ea1391b))
* **deps:** update dependency mini-css-extract-plugin to ^0.12.0 ([ea3d884](https://github.com/swashata/wp-webpack-script/commit/ea3d884606f1525497979777fabf1e53fc1c94a3))
* **deps:** update dependency react-refresh to ^0.9.0 ([29b2b8a](https://github.com/swashata/wp-webpack-script/commit/29b2b8abee2ce6f27298ca561ac4994358b8ab17))


### Features

* add custom plugin to auto extract wp dependencies ([18ccb5a](https://github.com/swashata/wp-webpack-script/commit/18ccb5a661a30e39bb9ed59a8b9fe7cccb27e9a4))
* add optimizeForGutenberg in files template ([0249b7f](https://github.com/swashata/wp-webpack-script/commit/0249b7fa96ccfbaf30d677397bfa831921c6de55))
* add option for using new jsx runtime for react 17 ([7c88193](https://github.com/swashata/wp-webpack-script/commit/7c88193976d4351772bcf117da89023a22dadd5b))
* auto insert matching env from dotenv file ([7925cd5](https://github.com/swashata/wp-webpack-script/commit/7925cd56ddb4b13b4a0ecb1a714050d85d7115fb)), closes [#1134](https://github.com/swashata/wp-webpack-script/issues/1134)
* change wording a little ([5c4202a](https://github.com/swashata/wp-webpack-script/commit/5c4202a2276d690e1d9437d1e75a411b8ffddfa3))
* let bootstrap update dependencies even if config present ([e69da48](https://github.com/swashata/wp-webpack-script/commit/e69da48f8969aaa5dce87110dac60262765d88c9))
* replace inquirer with prompts ([a505dec](https://github.com/swashata/wp-webpack-script/commit/a505decc07a7d57b196914ed2036738c73335c2c))
* safely upgrade less and postcss loader for webpack 4 ([acf6872](https://github.com/swashata/wp-webpack-script/commit/acf6872e02ccb6c82f4ba032a6f053e31b0572a7))
* save external dependencies as json instead of php ([4e6b7df](https://github.com/swashata/wp-webpack-script/commit/4e6b7df31d9e421b57993acaa450c12718222f39))
* upgrade all postcss dependencies ([3f27990](https://github.com/swashata/wp-webpack-script/commit/3f27990e17210af18e8a20d4ef183b61236d3958))
* upgrade package del to 6.0 ([a5f7014](https://github.com/swashata/wp-webpack-script/commit/a5f7014fa5314516077f688c0c6f58a102dffaab))
* upgrade webpack dev server and account for breaking changes ([73281f5](https://github.com/swashata/wp-webpack-script/commit/73281f5a38b31969318a775f0d2eeb7cd8aa85de))





# [5.0.0](https://github.com/swashata/wp-webpack-script/compare/v4.4.1...v5.0.0) (2020-08-07)


### Bug Fixes

* do not add react refresh in production ([bf4279b](https://github.com/swashata/wp-webpack-script/commit/bf4279ba611520ce251c4fbe7c6577fa95027771))
* failing tests due to changes in sourcemap ([2d6fc07](https://github.com/swashata/wp-webpack-script/commit/2d6fc076ee2e0ca5aa1cabed87554d2af0cf890c))
* remove duplicate packages in scripts ([74a8ccb](https://github.com/swashata/wp-webpack-script/commit/74a8ccbb09d0088887bd489e42ab96d5ef64be34))


### Features

* add entry name in console output ([e1e4599](https://github.com/swashata/wp-webpack-script/commit/e1e45996d74232f0d61e16661b9817ce98a00619))
* add options for selective entries during serve ([d4ee6f1](https://github.com/swashata/wp-webpack-script/commit/d4ee6f1b4dfa456d51fc3603f3b3c107c813f47b))
* add react refresh support ([1f4cb57](https://github.com/swashata/wp-webpack-script/commit/1f4cb579a0191dbcdc5a277d41944ad5acdf520f))
* make fork-ts plugin 5 compatible and remove react-dev-utils ([a6f414d](https://github.com/swashata/wp-webpack-script/commit/a6f414d644dc9552942b9b23172ff35c49b5ea78))
* update listed deps and devDeps ([d85f5ae](https://github.com/swashata/wp-webpack-script/commit/d85f5ae8c50fd2536380e17b5c23fe3e5d2b104f))
* upgrade less, css and sass loader ([3dc914e](https://github.com/swashata/wp-webpack-script/commit/3dc914eb38bbb41d29702b2a9b2fa224297b879f))
* use consistent eslint throughout the repo ([720efbf](https://github.com/swashata/wp-webpack-script/commit/720efbff7bcec03295ec06301191037bc96fe672))





## [4.4.1](https://github.com/swashata/wp-webpack-script/compare/v4.4.0...v4.4.1) (2020-03-21)


### Bug Fixes

* archive not deleting old files ([a170f2b](https://github.com/swashata/wp-webpack-script/commit/a170f2b50af2724fa7ab9f55a159063ecac18ce1)), closes [#890](https://github.com/swashata/wp-webpack-script/issues/890)
* use cheap module source map for devtool to work ([d4e696f](https://github.com/swashata/wp-webpack-script/commit/d4e696f98d92d7df47371513db461bc408702f09))





# [4.4.0](https://github.com/swashata/wp-webpack-script/compare/v4.3.0...v4.4.0) (2020-03-17)


### Bug Fixes

* issue with ts checker and first compile ([a49290a](https://github.com/swashata/wp-webpack-script/commit/a49290afd27d11eb4a541ac0dfbbd3b5d0a5b118))


### Features

* simplify whm socket path ([ec800e0](https://github.com/swashata/wp-webpack-script/commit/ec800e0cb4efd0fd4687b47e0e6adf99ba61e402))





# [4.3.0](https://github.com/swashata/wp-webpack-script/compare/v4.2.0...v4.3.0) (2019-12-26)


### Bug Fixes

* add ghostMode to browsersync config ([ec4cae1](https://github.com/swashata/wp-webpack-script/commit/ec4cae1))
* add proper message to promise reject message ([4dc499d](https://github.com/swashata/wp-webpack-script/commit/4dc499d))
* fix failing tests ([a6b0409](https://github.com/swashata/wp-webpack-script/commit/a6b0409))
* **deps:** update dependency mini-css-extract-plugin to ^0.9.0 ([07c1bc1](https://github.com/swashata/wp-webpack-script/commit/07c1bc1))





# [4.2.0](https://github.com/swashata/wp-webpack-script/compare/v4.1.0...v4.2.0) (2019-10-29)

**Note:** Version bump only for package @wpackio/scripts





# [4.1.0](https://github.com/swashata/wp-webpack-script/compare/v4.1.0-alpha.2...v4.1.0) (2019-10-28)

**Note:** Version bump only for package @wpackio/scripts





# [4.1.0-alpha.2](https://github.com/swashata/wp-webpack-script/compare/v4.1.0-alpha.1...v4.1.0-alpha.2) (2019-10-28)


### Features

* export loaders from package for external usage ([3e99b3b](https://github.com/swashata/wp-webpack-script/commit/3e99b3b))





# [4.1.0-alpha.1](https://github.com/swashata/wp-webpack-script/compare/v4.0.0...v4.1.0-alpha.1) (2019-10-28)


### Bug Fixes

* use require.resolve on babel presets ([e89d4bd](https://github.com/swashata/wp-webpack-script/commit/e89d4bd))





# [4.0.0](https://github.com/swashata/wp-webpack-script/compare/v3.5.0...v4.0.0) (2019-10-28)


### Bug Fixes

* issue with babel override and preset options ([3052630](https://github.com/swashata/wp-webpack-script/commit/3052630)), closes [#692](https://github.com/swashata/wp-webpack-script/issues/692)
* issue with eslint, updated deps and typescript ([2625e7d](https://github.com/swashata/wp-webpack-script/commit/2625e7d))
* issue with spinner and empty output ([a4fb650](https://github.com/swashata/wp-webpack-script/commit/a4fb650))


### Features

* add progressbar to build process ([dbdf429](https://github.com/swashata/wp-webpack-script/commit/dbdf429))
* make error output better ([79a9133](https://github.com/swashata/wp-webpack-script/commit/79a9133))
* make error reports a tad better ([b6fa2b6](https://github.com/swashata/wp-webpack-script/commit/b6fa2b6))
* update some more deps by semver ([83ed778](https://github.com/swashata/wp-webpack-script/commit/83ed778))
* use mini-css-extract plugin hmr ([2116177](https://github.com/swashata/wp-webpack-script/commit/2116177))





# [3.5.0](https://github.com/swashata/wp-webpack-script/compare/v3.4.0...v3.5.0) (2019-05-04)


### Bug Fixes

* **deps:** update dependencies ([01711b0](https://github.com/swashata/wp-webpack-script/commit/01711b0))
* module issue with plugin-transform-runtime ([e55528d](https://github.com/swashata/wp-webpack-script/commit/e55528d)), closes [#479](https://github.com/swashata/wp-webpack-script/issues/479)





# [3.4.0](https://github.com/swashata/wp-webpack-script/compare/v3.3.0...v3.4.0) (2019-05-04)

**Note:** Version bump only for package @wpackio/scripts





# [3.3.0](https://github.com/swashata/wp-webpack-script/compare/v3.2.0...v3.3.0) (2019-04-29)


### Bug Fixes

* **scripts:** add missing properties to default babel preset options ([68544b3](https://github.com/swashata/wp-webpack-script/commit/68544b3))


### Features

* **scripts:** add async typecheck report ([3bf18dd](https://github.com/swashata/wp-webpack-script/commit/3bf18dd))
* **scripts:** make build output style consistent ([b355d9d](https://github.com/swashata/wp-webpack-script/commit/b355d9d))
* modify build warning message ([3f3face](https://github.com/swashata/wp-webpack-script/commit/3f3face))





# [3.2.0](https://github.com/swashata/wp-webpack-script/compare/v3.1.0...v3.2.0) (2019-04-28)


### Bug Fixes

* **deps:** update dependencies ([1146e63](https://github.com/swashata/wp-webpack-script/commit/1146e63))


### Features

* **scripts:** add cache to babel loader for js and ts ([e87abd6](https://github.com/swashata/wp-webpack-script/commit/e87abd6)), closes [#472](https://github.com/swashata/wp-webpack-script/issues/472)
* **scripts:** add less support ([751c4d6](https://github.com/swashata/wp-webpack-script/commit/751c4d6)), closes [#469](https://github.com/swashata/wp-webpack-script/issues/469)
* **scripts:** compile node-modules with babel-loader ([9ac03a4](https://github.com/swashata/wp-webpack-script/commit/9ac03a4)), closes [#471](https://github.com/swashata/wp-webpack-script/issues/471)
* **scripts:** improve performance of build time ([0ddd9a3](https://github.com/swashata/wp-webpack-script/commit/0ddd9a3)), closes [#473](https://github.com/swashata/wp-webpack-script/issues/473)





# [3.1.0](https://github.com/swashata/wp-webpack-script/compare/v3.0.0...v3.1.0) (2019-04-18)


### Bug Fixes

* **scripts:** missing name in single compiler mode ([2677b9c](https://github.com/swashata/wp-webpack-script/commit/2677b9c))
* remove unused module ([4bb0d3a](https://github.com/swashata/wp-webpack-script/commit/4bb0d3a))
* remove unused parameter ([c2e1956](https://github.com/swashata/wp-webpack-script/commit/c2e1956))
* **scripts:** time output in log ([ee82d38](https://github.com/swashata/wp-webpack-script/commit/ee82d38)), closes [#444](https://github.com/swashata/wp-webpack-script/issues/444)


### Features

* **scripts:** add compile time message to output ([63136c7](https://github.com/swashata/wp-webpack-script/commit/63136c7)), closes [#444](https://github.com/swashata/wp-webpack-script/issues/444)
* **scripts:** improve typechecking performance ([e63aa9b](https://github.com/swashata/wp-webpack-script/commit/e63aa9b)), closes [#447](https://github.com/swashata/wp-webpack-script/issues/447)
* **scripts:** show cli output on browser-sync reload ([c1885e2](https://github.com/swashata/wp-webpack-script/commit/c1885e2)), closes [#444](https://github.com/swashata/wp-webpack-script/issues/444)





# [3.0.0](https://github.com/swashata/wp-webpack-script/compare/v2.13.0...v3.0.0) (2019-04-16)


### Bug Fixes

* **deps:** update dependency @types/browser-sync to ^0.0.43 ([1c83c8c](https://github.com/swashata/wp-webpack-script/commit/1c83c8c))
* **deps:** update dependency @types/inquirer to ^0.0.44 ([e3f26ff](https://github.com/swashata/wp-webpack-script/commit/e3f26ff))
* **deps:** update dependency del to v4 ([2389279](https://github.com/swashata/wp-webpack-script/commit/2389279))
* **deps:** update dependency mini-css-extract-plugin to ^0.6.0 ([2e23e1b](https://github.com/swashata/wp-webpack-script/commit/2e23e1b))
* **plugins:** issue with new version of clean webpack plugin ([b98c1b3](https://github.com/swashata/wp-webpack-script/commit/b98c1b3))
* **postcss:** add sourcemap to postcss-loader ([afa8e39](https://github.com/swashata/wp-webpack-script/commit/afa8e39))
* **scripts:** remove unneeded object property ([3deaa1d](https://github.com/swashata/wp-webpack-script/commit/3deaa1d))


### Features

* **cli:** improve cli output ([fc7502c](https://github.com/swashata/wp-webpack-script/commit/fc7502c)), closes [#429](https://github.com/swashata/wp-webpack-script/issues/429)
* add helpers for file-loader ([49bd29c](https://github.com/swashata/wp-webpack-script/commit/49bd29c)), closes [#284](https://github.com/swashata/wp-webpack-script/issues/284)
* **cli:** improve cli output and logo ([e012ab6](https://github.com/swashata/wp-webpack-script/commit/e012ab6)), closes [#429](https://github.com/swashata/wp-webpack-script/issues/429)
* add sharable eslint config ([9eb1e2c](https://github.com/swashata/wp-webpack-script/commit/9eb1e2c)), closes [#434](https://github.com/swashata/wp-webpack-script/issues/434)
* **babel-loader:** option to use babel config from project ([9eac648](https://github.com/swashata/wp-webpack-script/commit/9eac648))





# [2.13.0](https://github.com/swashata/wp-webpack-script/compare/v2.12.0...v2.13.0) (2019-02-21)


### Features

* extract babel config function as modules ([d16f162](https://github.com/swashata/wp-webpack-script/commit/d16f162))
* properly add barrel for nodejs API ([d3e8abd](https://github.com/swashata/wp-webpack-script/commit/d3e8abd))





# [2.12.0](https://github.com/swashata/wp-webpack-script/compare/v2.11.0...v2.12.0) (2019-02-12)


### Bug Fixes

* **deps:** update dependency make-dir to v2 ([7c1a876](https://github.com/swashata/wp-webpack-script/commit/7c1a876))
* **deps:** update lint and types and fix related errors ([f78148f](https://github.com/swashata/wp-webpack-script/commit/f78148f))
* **deps:** update non-conflicting dependencies ([8f7f101](https://github.com/swashata/wp-webpack-script/commit/8f7f101))
* **lint:** update tslint rules for changes in preset ([6261073](https://github.com/swashata/wp-webpack-script/commit/6261073))
* failing snapshot due to change in year ([6065719](https://github.com/swashata/wp-webpack-script/commit/6065719))


### Features

* **server:** add snippet options to browser-sync ([b518511](https://github.com/swashata/wp-webpack-script/commit/b518511)), closes [#155](https://github.com/swashata/wp-webpack-script/issues/155)





# [2.11.0](https://github.com/swashata/wp-webpack-script/compare/v2.10.0...v2.11.0) (2018-12-30)


### Features

* remove serverConfig from pack ([fc277e6](https://github.com/swashata/wp-webpack-script/commit/fc277e6))





# [2.10.0](https://github.com/swashata/wp-webpack-script/compare/v2.9.0...v2.10.0) (2018-12-30)


### Bug Fixes

* **deps:** update dependency mini-css-extract-plugin to ^0.5.0 ([12b1705](https://github.com/swashata/wp-webpack-script/commit/12b1705))


### Features

* remove serverConfig from build command ([c9a0754](https://github.com/swashata/wp-webpack-script/commit/c9a0754))





# [2.9.0](https://github.com/swashata/wp-webpack-script/compare/v2.8.1...v2.9.0) (2018-12-03)


### Bug Fixes

* issue with css image through webpack ([7807e60](https://github.com/swashata/wp-webpack-script/commit/7807e60)), closes [#117](https://github.com/swashata/wp-webpack-script/issues/117)


### Features

* add contenthash during prod build ([1cbb309](https://github.com/swashata/wp-webpack-script/commit/1cbb309))





# [2.8.0](https://github.com/swashata/wp-webpack-script/compare/v2.7.0...v2.8.0) (2018-11-14)


### Features

* **docs:** update doc for latest changes ([50e83fa](https://github.com/swashata/wp-webpack-script/commit/50e83fa))
* add distPublicPath option to server config ([6f7773d](https://github.com/swashata/wp-webpack-script/commit/6f7773d))





# [2.7.0](https://github.com/swashata/wp-webpack-script/compare/v2.6.0...v2.7.0) (2018-11-13)


### Bug Fixes

* **deps:** update dependency clean-webpack-plugin to v1 ([72681e1](https://github.com/swashata/wp-webpack-script/commit/72681e1))
* issue with NaN or Infinity in progress bar ([1b460a1](https://github.com/swashata/wp-webpack-script/commit/1b460a1))


### Features

* improve progress bar of copy and archive ([e8ecddd](https://github.com/swashata/wp-webpack-script/commit/e8ecddd))





# [2.6.0](https://github.com/swashata/wp-webpack-script/compare/v2.5.0...v2.6.0) (2018-11-12)


### Features

* add pack command for creating zip files ([80d0376](https://github.com/swashata/wp-webpack-script/commit/80d0376))
* add pack script during bootstrap ([42d9136](https://github.com/swashata/wp-webpack-script/commit/42d9136))
* finalize pack command ([2e329dc](https://github.com/swashata/wp-webpack-script/commit/2e329dc))
* merge default config to obtained config ([fae5a99](https://github.com/swashata/wp-webpack-script/commit/fae5a99))





# [2.5.0](https://github.com/swashata/wp-webpack-script/compare/v2.4.0...v2.5.0) (2018-11-06)


### Features

* add option in server config to override bs ([1889f7c](https://github.com/swashata/wp-webpack-script/commit/1889f7c))





# [2.4.0](https://github.com/swashata/wp-webpack-script/compare/v2.3.0...v2.4.0) (2018-11-03)


### Bug Fixes

* **deps:** pin dependencies ([b3e9444](https://github.com/swashata/wp-webpack-script/commit/b3e9444))
* pass externals to webpack config ([ae32d63](https://github.com/swashata/wp-webpack-script/commit/ae32d63)), closes [#42](https://github.com/swashata/wp-webpack-script/issues/42)


### Features

* quit server on `q` keypress ([e0da13e](https://github.com/swashata/wp-webpack-script/commit/e0da13e))
* show first-time build errors (if any) ([a22b6d5](https://github.com/swashata/wp-webpack-script/commit/a22b6d5)), closes [#41](https://github.com/swashata/wp-webpack-script/issues/41)





<a name="2.3.0"></a>
# [2.3.0](https://github.com/swashata/wp-webpack-script/compare/v2.2.0...v2.3.0) (2018-10-30)


### Features

* remove fork-ts-checker-webpack-plugin from dependency ([b1d3c07](https://github.com/swashata/wp-webpack-script/commit/b1d3c07)), closes [#29](https://github.com/swashata/wp-webpack-script/issues/29)
* show proper error message on init ([ea4c3a9](https://github.com/swashata/wp-webpack-script/commit/ea4c3a9)), closes [#28](https://github.com/swashata/wp-webpack-script/issues/28)





<a name="2.2.0"></a>
# [2.2.0](https://github.com/swashata/wp-webpack-script/compare/v2.1.0...v2.2.0) (2018-10-29)


### Bug Fixes

* require fork-ts-checker-webpack-plugin at runtime ([4c00180](https://github.com/swashata/wp-webpack-script/commit/4c00180))





<a name="2.1.0"></a>
# [2.1.0](https://github.com/swashata/wp-webpack-script/compare/v2.0.1...v2.1.0) (2018-10-23)


### Features

* add check against camelCase appName ([1869b5b](https://github.com/swashata/wp-webpack-script/commit/1869b5b))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/swashata/wp-webpack-script/compare/v1.2.1...v2.0.0) (2018-10-22)


### Features

* add ts checker webpack plugin ([4faf10e](https://github.com/swashata/wp-webpack-script/commit/4faf10e)), closes [#15](https://github.com/swashata/wp-webpack-script/issues/15)
* beautify error reporting. ([c068758](https://github.com/swashata/wp-webpack-script/commit/c068758))
* normalize dependencies & devDependencies in bootstrap ([be44080](https://github.com/swashata/wp-webpack-script/commit/be44080))
* update bootstrap to include entrypoint dep ([297b54d](https://github.com/swashata/wp-webpack-script/commit/297b54d))





<a name="1.2.1"></a>
## [1.2.1](https://github.com/swashata/wp-webpack-script/compare/v1.2.0...v1.2.1) (2018-10-22)


### Bug Fixes

* file permission for executables ([47bdf45](https://github.com/swashata/wp-webpack-script/commit/47bdf45))





<a name="1.2.0"></a>
# [1.2.0](https://github.com/swashata/wp-webpack-script/compare/v1.1.0...v1.2.0) (2018-10-22)

**Note:** Version bump only for package @wpackio/scripts





<a name="1.1.0"></a>
# [1.1.0](https://github.com/swashata/wp-webpack-script/compare/v1.0.0...v1.1.0) (2018-10-20)


### Bug Fixes

* issue with multiple webpackJsonp & runtime ([846c2c0](https://github.com/swashata/wp-webpack-script/commit/846c2c0)), closes [#13](https://github.com/swashata/wp-webpack-script/issues/13)


### Features

* remove babelrc and babel.config from babel-loader ([31d8635](https://github.com/swashata/wp-webpack-script/commit/31d8635)), closes [#11](https://github.com/swashata/wp-webpack-script/issues/11)
* use modern browser target during dev ([ed5edb1](https://github.com/swashata/wp-webpack-script/commit/ed5edb1)), closes [#12](https://github.com/swashata/wp-webpack-script/issues/12)





<a name="1.0.0"></a>
# [1.0.0](https://github.com/swashata/wp-webpack-script/compare/v0.0.6...v1.0.0) (2018-10-19)


### Features

* accept function for webpackConfig ([3466fe7](https://github.com/swashata/wp-webpack-script/commit/3466fe7)), closes [#7](https://github.com/swashata/wp-webpack-script/issues/7)
* remove svg from bare file loader ([b95af1e](https://github.com/swashata/wp-webpack-script/commit/b95af1e)), closes [#10](https://github.com/swashata/wp-webpack-script/issues/10)





<a name="0.0.6"></a>
## [0.0.6](https://github.com/swashata/wp-webpack-script/compare/v0.0.5...v0.0.6) (2018-10-13)

**Note:** Version bump only for package @wpackio/scripts





<a name="0.0.5"></a>
## [0.0.5](https://github.com/swashata/wp-webpack-script/compare/v0.0.4...v0.0.5) (2018-10-13)


### Features

* add postcss.config.js in project template ([04f63ba](https://github.com/swashata/wp-webpack-script/commit/04f63ba))
* add timefixplugin to avoid multiple build ([3a1e513](https://github.com/swashata/wp-webpack-script/commit/3a1e513))
* further beautify bootstrap cli output ([f762b26](https://github.com/swashata/wp-webpack-script/commit/f762b26))





<a name="0.0.4"></a>
## [0.0.4](https://github.com/swashata/wp-webpack-script/compare/v0.0.3...v0.0.4) (2018-10-13)


### Features

* change logging of scripts bootstrap ([7bb89b6](https://github.com/swashata/wp-webpack-script/commit/7bb89b6))





<a name="0.0.3"></a>
## [0.0.3](https://github.com/swashata/wp-webpack-script/compare/v0.0.2...v0.0.3) (2018-10-12)


### Features

* beautify bootstrap cli ([288440a](https://github.com/swashata/wp-webpack-script/commit/288440a))
* rename init command to bootstrap ([b7a6342](https://github.com/swashata/wp-webpack-script/commit/b7a6342))





<a name="0.0.2"></a>
## [0.0.2](https://github.com/swashata/wp-webpack-script/compare/v0.0.1...v0.0.2) (2018-10-12)


### Bug Fixes

* issue with babel-loader and options ([1cc53c3](https://github.com/swashata/wp-webpack-script/commit/1cc53c3))
* issues with cleanWebPackPlugin ([bc38690](https://github.com/swashata/wp-webpack-script/commit/bc38690))


### Features

* add [@wpackio](https://github.com/wpackio)/babel-preset-base dependency to scripts ([d7645af](https://github.com/swashata/wp-webpack-script/commit/d7645af))
* add node_modules watch plugin from react-dev-utils ([e336af9](https://github.com/swashata/wp-webpack-script/commit/e336af9))
* add overrides & features in babel and webpack config ([7c2a0c0](https://github.com/swashata/wp-webpack-script/commit/7c2a0c0)), closes [#6](https://github.com/swashata/wp-webpack-script/issues/6)
* almost finalize serve cli ([58a9179](https://github.com/swashata/wp-webpack-script/commit/58a9179))
* chalk up the cli ([270c1b2](https://github.com/swashata/wp-webpack-script/commit/270c1b2))
* code cleanup and introduce appName ([5786ddb](https://github.com/swashata/wp-webpack-script/commit/5786ddb))
* complete build mode ([463e245](https://github.com/swashata/wp-webpack-script/commit/463e245))
* create basics of [@wpackio](https://github.com/wpackio)/scripts ([db9f318](https://github.com/swashata/wp-webpack-script/commit/db9f318))
* create skeleton of cli interface ([3e74066](https://github.com/swashata/wp-webpack-script/commit/3e74066))
* create the init/cli for onboarding ([07c9a2f](https://github.com/swashata/wp-webpack-script/commit/07c9a2f))
* create typescript config and start migration ([ccdf227](https://github.com/swashata/wp-webpack-script/commit/ccdf227))
* feature freeze on wpackio/scripts ([fe61b48](https://github.com/swashata/wp-webpack-script/commit/fe61b48))
* fine-tune spinners and dim ([89499d9](https://github.com/swashata/wp-webpack-script/commit/89499d9))
* finish up scripts for server and build ([8245033](https://github.com/swashata/wp-webpack-script/commit/8245033))
* fix some stuff on the serve cli ([4e15a0f](https://github.com/swashata/wp-webpack-script/commit/4e15a0f))
* have proper name wpackio-scripts ([cf032b2](https://github.com/swashata/wp-webpack-script/commit/cf032b2))
* make hmr, multi-compiler etc work nicely ([05668c7](https://github.com/swashata/wp-webpack-script/commit/05668c7))
* provide entrypoint publicPath functionality ([7aeabeb](https://github.com/swashata/wp-webpack-script/commit/7aeabeb))
* remove all logs and use network ip by default ([9aea139](https://github.com/swashata/wp-webpack-script/commit/9aea139))
* remove config and scripts dependency on process.cwd ([40c3e0a](https://github.com/swashata/wp-webpack-script/commit/40c3e0a))
* remove dependency on node-sass ([9e35f6b](https://github.com/swashata/wp-webpack-script/commit/9e35f6b))
* remove plugins from typescript rules ([c410152](https://github.com/swashata/wp-webpack-script/commit/c410152))
* remove webpack dashboard because it doesn't work ([3fc2423](https://github.com/swashata/wp-webpack-script/commit/3fc2423))
* successfully create an example ([61fe269](https://github.com/swashata/wp-webpack-script/commit/61fe269))
