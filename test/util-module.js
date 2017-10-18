/* eslint-env mocha */
const { expect } = require('chai')

const u = require('../lib/util')

describe('util module', function () {
  describe('replaceTokens', function () {
    it('replaces tokens in a string', function () {
      const source = 'foo {replaced} {notReplaced}'
      const replace = { replaced: 'bar', ignoredProp: 'dummy' }

      expect(u.replaceTokens(source, replace)).to.equal('foo bar {notReplaced}')
    })
  })
})
