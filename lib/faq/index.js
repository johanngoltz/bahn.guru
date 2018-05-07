'use strict'

const html = require('pithy')
const beautify = require('js-beautify').html
const opengraph = require('../helpers').openGraph
const settings = require('../api').settings

const head = () => {
	const elements = [
		html.meta({charset: 'utf-8'}),
		html.meta({name: 'viewport', content: "width=device-width, initial-scale=1.0"}),
		html.title(null, 'FAQ | '+settings.title),
		...opengraph(),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/reset.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/base.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/faq.css'}),
		html.link({rel: 'stylesheet', type: 'text/css', href: 'assets/styles/'+require('config').api+'.css'})
	]
	return html.head(null, elements)
}

const generate = () => {
	let document = '<!doctype html>' + html.html(null, [
		head(),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({href: "/", title: settings.mainTitle}, [html.h1(null, settings.mainTitle)])]),
				html.h2(null, settings.faqTitle),
				...settings.faq.map((q) => html.div('.question', [
					html.h3(null, q.title),
					html.p('.description', q.description)
				]))
			]),
			html.div('#footer', [
				html.a({id: 'faq', href: '/faq'}, settings.faqTitle),
				html.span(null, ' – '),
				html.a({id: 'impressum', href: '/impressum'}, settings.legalTitle)
			])
		])
	])
	return beautify(document)
}

const main = (req, res, next) => {
	res.send(generate())
}

module.exports = main
