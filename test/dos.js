'use strict'

require('./util/babel-register')
var DDoSProtections = require('../src/ddos-protection').default
var dos = DDoSProtections.getInstance({ maxCounts: 15, maxInterval: 60 }, { dos: { msg: 'custom-msg' } })

var counter = 0
var errors = 0

var req = {headers: {'x-forwarded-for': 'test', 'user-agent': 'test'}, uniqueDoS: 'test-unique'}
var res = {}
var next = function() {
  console.log('counter: '+ ++counter)
}

function kill(i) {
  i = i || 0
  do {
    try {
      DDoSProtections.expressDoS(req, res, next)
    } catch (err) {
      console.log('counter: ' + ++counter + ' - errors: ' + ++errors + ' - msg: ' + err.message)
    }
  } while( --i > 0 )
}

kill(3)

setTimeout(function () { kill(8) }, 2000)
setTimeout(function () { kill(8) }, 4000)
setTimeout(function () { kill(20) }, 6000)
setTimeout(function () { kill(10) }, 65000)

setTimeout(dos.stopClearance ,65000)

