'use strict'

const createError = require('http-errors')
const request = require('request-promise')

/**
 * Simple Promise based wrapper class for the "request" package.
 *
 * @class
 */
class HttpRequest {
  /**
   * Create a new HttpRequest instance
   *
   * @param {string|object} opts Options passed directly to the "request" method.
   */
  constructor (opts) {
    this.opts = opts
    this.defaultTimeout = 60 // Sensible default value, can be overridden by simply extending this class
  }

  get requestOptions () {
    let opts = {}

    if (typeof this.opts === 'string') {
      opts.uri = this.opts
    }
    else {
      Object.assign(opts, this.opts)
    }

    if (!opts.timeout) {
      opts.timeout = this.defaultTimeout
    }

    return opts
  }

  /**
   * Sends the request.
   *
   * @returns {Promise}
   */
  send () {
    return request(this.requestOptions)
    // Throw a proper 504 error when the remote backend times out
      .catch(error => Promise.reject(error.cause && error.cause.code === 'ETIMEDOUT' ? createError(504) : error))
  }
}

module.exports = HttpRequest
