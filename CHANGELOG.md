# Changelog
## 2017-04-17 `v8.1.0`
* ms `[SEMVER_MINOR]` Added `cacheLifetime` to `koa-middleware`

## 2017-04-12 `v8.0.0`
* ms `[SEMVER_MAJOR]` Reworked file structure and exports - no more default exports, all modules now use named exports only
* ms `[SEMVER_MAJOR]` Reworked `index.js` exports
* ms `[SEMVER_MAJOR]` Renamed `koa` module to `koa-middleware`
* ms `[SEMVER_MAJOR]` Added `node >= 7.6.0` engine requirement to `package.json`
* ms `[SEMVER_MINOR]` Removed all code not natively supported by node >= 7.6. This means that tailored.js sourcecode will as of now be shipped as-is, without any transpilation steps in between. Therefore, all babel related dev dependencies have been removed as well

## 2017-04-12 `v7.0.3`
* ms `[SEMVER_PATCH]` Refactored linting dependencies
* ms `[SEMVER_PATCH]` Fixed various linting errors introduced by a major version upgrade of the `standard` package

## 2017-04-05 `v7.0.2`
* ms `[SEMVER_PATCH]` `requestProfiler` middleware will now emit a `debug` statement at the start of each request

## 2017-03-06 `v7.0.1`
* ms `[SEMVER_MAJOR]` Removed `ddos-protection` module
* ms `[SEMVER_MAJOR]` To determine response body, koa error handler will now evaluate an errors properties in the following order: `err.body`, `err.error`, `err.message`

## 2017-03-02 `v6.0.1`
* ms `[SEMVER_MAJOR]` Refactored logging configuration:
  - console/stdout now a string config, removed redundant `enable` and `level` props
  - baseDir for file logging now in `cfg.files`, list of logfiles now in `cfg.files.logFiles`

## 2017-01-30 `v5.0.0`
* ms `[SEMVER_MAJOR]` koa error handler middleware now prefers an errors `body` over a `message` property if both are set

## 2016-12-23 `v4.0.0`
* ms `[SEMVER_MAJOR]` Renamed all koa middleware functions from `get[MyFunc]Middleware` to `myFunc`

## 2016-12-16 `v3.2.0`
* ms `[SEMVER_MINOR]` Add support for per-request extra options in `api-connector`

## 2016-12-15 `v3.0.0`
* ms `[SEMVER_MAJOR]` Removed deprecated `http-request` module
* ms `[SEMVER_MINOR]` Fixed exports from `index.js`
* ms `[SEMVER_MINOR]` Added `api-connector` module

## 2016-08-02 `v2.1.0`
* ms `[SEMVER_MINOR]` Added taskrunner

## 2016-06-01 `v2.0.0`
* ms `[SEMVER_MAJOR]` Koa request digester methods only receive full ctx from now on

## 2016-04-26 `v1.1.0`
* ms `[SEMVER_MINOR]` Added koa module

## 2016-03-14 `v1.0.0`
* ms `[SEMVER_MAJOR]` Restructured exports: logger no longer exports getLogger as a named export, `index.js` is now the packages entry point and exports all default exports of all other modules
