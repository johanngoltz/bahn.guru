'use strict'

const params = require('./lib/params')
const options = require('./lib/options')
const station = require('./lib/station')
const journeys = require('./lib/journeys')
const settings = require('./settings')

const shopLink = (origin, destination, date, params) => null

module.exports = {params, options, station, journeys, shopLink, settings}
