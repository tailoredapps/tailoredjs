'use strict'

/* eslint-env mocha */

import { expect } from 'chai'

import * as k from '../src/koa'

describe('koa related functionality', function () {
  describe('error handler middleware', function () {
    const noop = function () { }
    const fauxLogger = { error: noop, debug: noop }

    it('calls error message modifier function', async function () {
      const origMessage = 'error message'
      const fnMod = 'foo'
      const modify = (message, ctx) => `${message}${ctx.mod}${fnMod}`
      const next = async () => { throw new Error(origMessage) }
      const fauxCtx = { status: null, body: null, mod: 'bar' }

      const errorHandler = k.errorHandler(fauxLogger, modify)

      await errorHandler(fauxCtx, next)

      expect(fauxCtx.status).to.equal(500)
      expect(fauxCtx.body).to.equal(`${origMessage}${fauxCtx.mod}${fnMod}`)
    })

    it('sets the correct status code', async function () {
      const getThrower = (status) => async () => {
        let e = new Error()

        if (status) {
          e.status = status
        }

        throw e
      }

      let ctx = { }

      const handler = k.errorHandler(fauxLogger)
      await handler(ctx, getThrower())

      expect(ctx.status).to.equal(500) // default

      await handler(ctx, getThrower(401))
      expect(ctx.status).to.equal(401)

      await handler(ctx, getThrower(404))
      expect(ctx.status).to.equal(404)
    })

    it('uses message if no body is set', async function () {
      const willThrow = async () => {
        let e = new Error()
        e.message = 'message'

        throw e
      }

      let ctx = { }

      const handler = k.errorHandler(fauxLogger)

      await handler(ctx, willThrow)

      expect(ctx).to.include.all.keys([ 'status', 'body' ])
      expect(ctx.body).to.equal('message')

    })

    it('uses body property if present', async function () {
      const willThrow = async () => {
        let e = new Error()
        e.message = 'message'
        e.body = 'body'

        throw e
      }

      let ctx = { }

      const handler = k.errorHandler(fauxLogger)

      await handler(ctx, willThrow)

      expect(ctx).to.include.all.keys([ 'status', 'body' ])
      expect(ctx.body).to.equal('body')
    })
  })
})
