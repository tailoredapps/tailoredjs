/* eslint-env mocha */
const { expect } = require('chai')

const k = require('../lib/koa-middleware')

describe('koa related functionality', function () {
  describe('error handler middleware', function () {
    const noop = function () { }
    const fauxLogger = { error: noop, debug: noop }
    const getThrower = (err) => async () => {
      throw err
    }

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

    it('prefers body over error prop', async function () {
      let err = new Error()
      err.error = 'error'
      err.body = 'body'
      err.message = 'message'

      let ctx = { }

      const handler = k.errorHandler(fauxLogger)
      await handler(ctx, getThrower(err))

      expect(ctx).to.include.all.keys([ 'status', 'body' ])
      expect(ctx.body).to.equal('body')
    })

    it('prefers error over message prop', async function () {
      let err = new Error()
      err.error = 'error'
      err.message = 'message'

      let ctx = { }

      const handler = k.errorHandler(fauxLogger)
      await handler(ctx, getThrower(err))

      expect(ctx).to.include.all.keys([ 'status', 'body' ])
      expect(ctx.body).to.equal('error')
    })

    it('uses message if neither body nor error props are set', async function () {
      let err = new Error()
      err.message = 'message'

      let ctx = { }

      const handler = k.errorHandler(fauxLogger)
      await handler(ctx, getThrower(err))

      expect(ctx).to.include.all.keys([ 'status', 'body' ])
      expect(ctx.body).to.equal('message')
    })
  })
})
