'use strict'

import { expect } from 'chai'

import * as tailoredUtil from '../util'

describe('util module', function () {
  describe('replaceTokens', function () {
    it('should correctly replace tokens in a string', function () {
      const source = 'foo {replaced} {notReplaced}'
      const replace = { replaced: 'bar', ignoredProp: 'dummy' }

      expect(tailoredUtil.replaceTokens(source, replace)).to.equal('foo bar {notReplaced}')
    })
  })
})
