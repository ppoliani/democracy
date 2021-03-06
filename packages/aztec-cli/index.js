'use strict'

const common  = require('./src/common')
const mint    = require('./src/mint')
const cx      = require('./src/cx')
const bs      = require('./src/bs')
const pt      = require('./src/pt')
const lt      = require('./src/lt')
const cheatPt = require('./src/cheatPt')
const departs = require('./src/departs')

const all = {
  ...common ,
  ...mint   ,
  ...cx     ,
  ...bs     ,
  ...pt     ,
  ...lt     ,
  ...cheatPt,
  ...departs,
}

module.exports = all
