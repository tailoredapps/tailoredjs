/**
 * Created on 02/15/2016
 *
 * @author: Stephan Schmid (DablS)
 * @copyright DablS 2015+
 */

'use strict'

// imports
import moment from 'moment'
import HttpErrors from 'http-errors'

// defaults
const defaultOpts = {
  maxCounts: 20,
  maxInterval: 120,
  burstPoint: 6,
  raiseMultiplier: 2,
  cleanUpInterval: 10 * 60 * 60
}
const defaultMsgs = {
  dos: { code: 429, msg: 'detected-as-dos' }
}

// privates
let mapDoS = new Map()
let singleton
let clearance

/**
 * Contains simple DoS (Denial of Service) protection.
 * @next: If possible add more complex DDoS (Distributed Denial of Service) protection.
 *
 * @class
 */
class DDoSProtection {
  constructor (opts = {}, msgs = {}) {
    this._opts = Object.assign({}, defaultOpts, opts)
    this._msgs = Object.assign({}, defaultMsgs, msgs)

    this.startClearance()
  }

  get options () {
    return this._opts || null
  }

  get messages () {
    return this._msgs || null
  }

  /**
   * Simple create singleton
   * @param opts
   * @param msgs
   * @returns {*|DDoSProtection}
   */
  static getInstance (opts = {}, msgs = {}) {
    return singleton = singleton || new DDoSProtection(opts, msgs)
  }

  /**
   * Handle simple DoS protection
   * @param unique
   */
  handleDoS (unique) {
    let data = null
    if (mapDoS.has(unique)) {
      data = mapDoS.get(unique)
      if (data.at < moment().utc().subtract(data.interval, 'seconds')) {
        mapDoS.delete(unique)
        data = null
      }
    }
    data = data || { count: 0, interval: 1, at: moment().utc() }
    data.count++

    if (data.count > this._opts.maxCounts) {
      throw new HttpErrors(this._msgs.dos.code, this._msgs.dos.msg)
    } else {
      if (data.count > this._opts.burstPoint && data.interval < this._opts.maxInterval) {
        data.interval = Math.min(Math.round(data.interval * this._opts.raiseMultiplier), this._opts.maxInterval)
      }
    }

    mapDoS.set(unique, data)
  }

  static expressDoS (req, res, next) {
    DDoSProtection.getInstance().handleDoS(req.uniqueDoS || `${req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress}#${req.headers[ 'user-agent' ]}`)
    next()
  }

  static *koaDoS (next) {
    DDoSProtection.getInstance().handleDoS(this.uniqueDoS || `${this.request.ip}#${this.request.headers[ 'user-agent' ]}`)
    yield next
  }

  static async koa2DoS (ctx, next) {
    DDoSProtection.getInstance().handleDoS(ctx.uniqueDoS || `${ctx.request.ip}#${ctx.request.headers[ 'user-agent' ]}`)
    await next()
  }

  /**
   * Interval clearance process over all maps
   */
  clearance () {
    mapDoS.forEach((val, key, map) => {
      if (val.at < moment().utc().subtract(val.interval, 'seconds')) {
        map.delete(key)
      }
    })
  }

  startClearance () {
    clearance = clearance || setInterval(this.clearance, this._opts.cleanUpInterval * 1000)
  }

  stopClearance () {
    if (clearance) {
      clearInterval(clearance)
    }
  }
}

// exports
export default DDoSProtection
export {DDoSProtection}