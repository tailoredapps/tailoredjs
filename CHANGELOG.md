# Changelog

## 2017-04-05 `v7.0.2`
* ms `[SEMVER_PATCH]` `requestProfiler` middleware will now emit a `debug` statement at the start of each request

## 2017-03-06 `v7.0.1`
* ms `[SEMVER_MAJOR]` Removed `ddos-protection` module
* ms `[SEMVER_MAJOR]` to determine response body, koa error handler will now evaluate an errors properties in the following order: `err.body`, `err.error`, `err.message`

## 2017-03-02 `v6.0.1`
* ms `[SEMVER_MAJOR]` Refactored logging configuration:
  - console/stdout now a string config, removed redundant `enable` and `level` props
  - baseDir for file logging now in `cfg.files`, list of logfiles now in `cfg.files.logFiles`

## 2017-01-30 `v5.0.0`
* ms `[SEMVER_MAJOR]` koa error handler middleware now prefers an errors `body` over a `message` property if both are set

## 2016-12-23 `v4.0.0`
* ms `[SEMVER_MAJOR]` rename all koa middleware functions from `get[MyFunc]Middleware` to `myFunc`

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
