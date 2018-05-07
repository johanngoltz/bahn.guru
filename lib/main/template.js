'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const options = require('../api').options
const opengraph = require('../helpers').openGraph
const settings = require('../api').settings

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0"}),
		html.title(null, settings.title),
		...opengraph(),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/reset.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/base.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/main.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/autocomplete.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/'+require('config').api+'.css'})
	]
	return html.head(null, elements)
}

const errorBox = (params) => {
	if(params.error) return html.div({id: 'error', class: 'subtitle'}, [html.span(null, params.error)])
	return []
}

const generate = (params) => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.form({id: 'page', action: '/calendar', method: 'GET'}, [
				html.div('#header', [html.h1(null, settings.mainTitle)]),
				errorBox(params),
				html.div('#form', [
					html.div({id: 'origin', class: 'station'}, [html.span(null, settings.originShort), html.input({id: 'originInput', name: 'origin', type: 'text', value: (params.origin) ? params.origin.name : '', placeholder: settings.originPlaceholder, size: 1})]),
					html.div({id: 'destination', class: 'station'}, [html.span(null, settings.destinationShort), html.input({id: 'destinationInput', name: 'destination', type: 'text', value: (params.destination) ? params.destination.name : '', placeholder: settings.destinationPlaceholder, size: 1})]),
					html.div('#go', [html.input({id: 'submit', name: 'submit', type: 'submit', value: settings.submit})])
				]),
				html.div('#options', options.input(params))
			]),
			html.div('#footer', [
				html.a({id: 'faq', href: '/faq'}, settings.faqTitle),
				html.span(null, ' – '),
				html.a({id: 'impressum', href: '/impressum'}, settings.legalTitle)
			]),
			html.script({src: 'assets/scripts/bundle.js'})
		])
	])
	return beautify(document)
}

module.exports = generate
