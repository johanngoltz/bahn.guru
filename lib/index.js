'use strict'

const createExpress = require('express')
const http = require('http')
const compression = require('compression')
const morgan = require('morgan')
const shorthash = require('shorthash').unique
const cache = require('apicache').middleware

const createRoutes = require('./routes')

const createServer = ({ api, accessLogStream }) => {
	// setup HTTP and HTTPS servers
	const express = createExpress()
	const server = http.createServer(express)

	// enable caching
	express.use(cache('15 minutes'))

	// enable gzip compression
	express.use(compression())

	// setup the logger
	if (accessLogStream) {
		morgan.token('id', (req, res) => req.headers['x-forwarded-for'] ? shorthash(req.headers['x-forwarded-for']) : shorthash(req.ip))
		express.use(morgan(':date[iso] :id :method :url :status :response-time ms', { stream: accessLogStream }))
	}

	// enable static assets directory
	express.use('/assets', createExpress.static('assets'))

	// setup and enable routes
	const { mainRoute, dayRoute, calendarRoute, graphRoute, impressumRoute, faqRoute } = createRoutes(api)
	express.get('/', mainRoute)
	express.get('/day', dayRoute, mainRoute)
	express.get('/calendar', calendarRoute, mainRoute)
	express.get('/graph', graphRoute, mainRoute)
	express.get('/impressum', impressumRoute)
	express.get('/faq', faqRoute)

	return server
}

module.exports = createServer
