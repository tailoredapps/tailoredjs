'use strict'

/* eslint-env mocha */

import { expect } from 'chai'

import { expectError } from './util/helpers'
import getConnector, { getRequestSpec, METHOD_PATCH, METHOD_DELETE, METHOD_PUT, METHOD_POST, METHOD_GET } from '../api-connector'

describe('api connector', function () {
  describe('data validation', function () {
    const validEndpoint = { id: 'get_foo', route: '/foo', method: 'get' }

    it('requires a baseUrl and a non empty list of endpoints', function () {
      expect(() => getConnector()).to.throw()
      expect(() => getConnector({ baseUrl: 'foo' })).to.throw()
      expect(() => getConnector({ endpoints: [] })).to.throw()
      expect(() => getConnector({ baseUrl: 'foo', endpoints: [ validEndpoint ] })).to.not.throw()
    })

    it('requires valid endpoint specs', function () {
      const conn = (...endpoints) => getConnector({ baseUrl: 'foo', endpoints })

      expect(() => conn({ })).to.throw()
      expect(() => conn({ id: 'get_foo' })).to.throw()
      expect(() => conn({ id: 'get_foo', route: '/foo' })).to.throw()
      expect(() => conn({ id: 'get_foo', method: 'get' })).to.throw()
      expect(() => conn({ id: 'get_foo', route: '/foo', method: 'invalid_method' })).to.throw()
      expect(() => conn(validEndpoint)).to.not.throw()
    })

    it('requires a valid endpoint id', async function () {
      const callApi = getConnector({ baseUrl: 'foo', endpoints: [ { id: 'one', route: '/foo', method: METHOD_GET } ], requestFn: (opts) => opts })

      await callApi('one')
      await expectError(async () => await callApi('two'), Error)
    })
  })

  describe('endpoint handling', function () {
    const baseUrl = 'foo'
    const getSpec = (endpoint, params) => getRequestSpec(baseUrl, endpoint, params)

    it('replaces tokens in the route path', function () {
      const spec = getSpec({ route: '/foo/{replace}', doReplace: true }, { replace: 'replaced' })

      expect(spec).to.contain.keys('uri')
      expect(spec.uri).to.equal('/foo/replaced')
    })

    it('populates query for get and delete requests', function () {
      const params = { a: 'b', c: 'd' }

      for (let method of [ METHOD_GET, METHOD_DELETE ]) {
        const spec = getSpec({ route: '/foo', method }, params)

        expect(spec).to.contain.keys('qs')
        expect(spec.qs).to.deep.equal(params)
        expect(spec.body).to.not.be.ok
      }
    })

    it('populates body for post, patch and put requests', function () {
      const params = { a: 'b', c: 'd' }

      for (let method of [ METHOD_PUT, METHOD_POST, METHOD_PATCH ]) {
        const spec = getSpec({ route: '/foo', method }, params)

        expect(spec).to.contain.keys([ 'body', 'json' ])
        expect(spec.body).to.deep.equal(params)
      }
    })

    it('uses getPath function to determine request path', function () {
      const spec = getSpec({ route: '/foo', getPath: (route, params) => `${route}/${params.arg}` }, { arg: 'bar' })

      expect(spec.uri).to.equal('/foo/bar')
    })

    it('uses getQuery function to determine query params', function () {
      const spec = getSpec({ route: '/foo', method: METHOD_GET, getQuery: (params) => Object.assign({}, params, { c: 'd' }) }, { a: 'b' })

      expect(spec.qs).to.deep.equal({ a: 'b', c: 'd' })
    })

    it('uses getBody function to determine request body', function () {
      const spec = getSpec({ route: '/foo', method: METHOD_POST, getBody: (params) => Object.assign({}, params, { c: 'd' }) }, { a: 'b' })

      expect(spec.body).to.deep.equal({ a: 'b', c: 'd' })
    })
  })
})
