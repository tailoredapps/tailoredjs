'use strict'

/* eslint-env mocha */

import { expect } from 'chai'

import * as k from '../src/koa'

describe('koa related functionality', function () {
  describe('error handler middleware', function () {
    it('calls error message modifier function', async function () {
      const origMessage = 'error message'
      const fnMod = 'foo'
      const modify = (message, ctx) => `${message}${ctx.mod}${fnMod}`
      const next = async () => { throw new Error(origMessage) }
      const fauxCtx = { status: null, body: null, mod: 'bar' }
      const noop = function () { }

      const errorHandler = k.errorHandler({ error: noop, debug: noop }, modify)

      await errorHandler(fauxCtx, next)

      expect(fauxCtx.status).to.equal(500)
      expect(fauxCtx.body).to.equal(`${origMessage}${fauxCtx.mod}${fnMod}`)
    })
  })
})
