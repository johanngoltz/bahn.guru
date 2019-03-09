'use strict'

const createParseParams = require('../params')
const createTemplate = require('./template')
const graph = require('./graph')

const createForwardError = (req, next) => (code) => {
	req.query.error = code
	next()
}

const createGraphRoute = api => {
	const parseParams = createParseParams(api)
	const template = createTemplate(api)
	return async (req, res, next) => {
		const forwardError = createForwardError(req, next)
		try {
			// general and api-specific params
			const { params, error } = await parseParams(req.query)
			if (error) return forwardError(error)

			// route-specific params
			if (+req.query.weeks && +req.query.weeks <= 12 && +req.query.weeks > 0) params.weeks = +req.query.weeks
			else params.weeks = 4

			// route content
			const graphResults = await graph(api, params)
			if (!graphResults) return forwardError('no-results')
			return res.send(template({ input: params, output: graphResults }))
		} catch (error) {
			console.log(error)
			return forwardError('unknown')
		}
	}
}

module.exports = createGraphRoute
