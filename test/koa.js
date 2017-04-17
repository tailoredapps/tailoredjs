/* eslint-env mocha */
const { expect } = require('chai')
const moment = require('moment')

const k = require('../lib/koa-middleware')

describe('koa related functionality', function () {
  const noop = () => undefined
  const fauxLogger = { error: noop, verbose: noop, debug: noop }

  describe('error handler middleware', function () {
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

  describe('cache lifetime helper middleware', function () {
    const fauxCtx = () => {
      let headers = {}

      return {
        state: {},
        set: (key, val) => {
          headers[key] = val
        },
        get headers () {
          return headers
        }
      }
    }
    const handleCacheLifetime = k.cacheLifetimeHelper(fauxLogger)

    it('provides a setCacheLifetime function on context state', async function () {
      let ctx = fauxCtx()

      await handleCacheLifetime(ctx, () => undefined)

      expect(ctx.state.setCacheLifetime).to.be.a('function')
    })

    it('does not set cache-control headers unless specified', async function () {
      let ctx = fauxCtx()

      await handleCacheLifetime(ctx, () => undefined)

      expect(ctx.headers).to.not.include.keys([ 'Cache-control' ])
    })

    it('sets Cache-control header', async function () {
      let ctx = fauxCtx()

      await handleCacheLifetime(ctx, () => {
        const { setCacheLifetime } = ctx.state

        setCacheLifetime(1)
      })

      expect(ctx.headers).to.include.keys([ 'Cache-control' ])
      expect(ctx.headers['Cache-control']).to.equal('max-age=1')
    })

    it('sets Expires header', async function () {
      let ctx = fauxCtx()

      await handleCacheLifetime(ctx, () => {
        const { setCacheLifetime } = ctx.state

        setCacheLifetime(1, true)
      })

      expect(ctx.headers).to.include.keys([ 'Expires' ])
      expect(ctx.headers['Expires']).to.equal(`${moment().locale('en').utc().add(1, 'second').format('ddd, DD MMM YYYY HH:mm:ss')} GMT`)
    })
  })
})
