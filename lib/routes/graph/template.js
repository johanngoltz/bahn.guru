const html = require('pithy')
const beautify = require('js-beautify').html
const helpers = require('../helpers')

const head = (api, data) => {
	const title = generateSubTitleRoute(data).join('') + ' | Preisverlauf'
	const elements = [
		...helpers.staticHeader(api),
		html.title(null, ` ${title} | ${api.settings.title}`),
		...helpers.opengraph({ api, extraTitle: title }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/resultOverview.css' }),
		html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/graph.css' })
	]
	return html.head(null, elements)
}

const generateSubTitleRoute = (data) => {
	return [
		data.input.origin.name,
		' ↔ ',
		data.input.destination.name
	]
}

const generateSubTitleOptions = (api, data) => {
	const result = api.options.text(data.input)
	const changeLink = html.a({ href: './?origin=' + data.input.origin.name + '&destination=' + data.input.destination.name + '&' + (api.options.url(data.input).join('&')), id: 'change' }, 'Anfrage ändern...')
	if (result.length) {
		result.push('. ')
	}
	return [html.span(null, result), changeLink]
}

const createChartEntry = (minAmount, maxAmount, date, outbound, inbound, combined) =>
	html.div('.day', [
		html.div({ class: 'bar-with-overlay', style: `height: ${combined.price.amount / maxAmount * 100 - 10}%` }, [
			html.div('.bar' + (minAmount === combined.price.amount ? ' .cheapest' : '')),
			html.div('.overlay .journey-details', [
				html.div('.price', `${combined.price.euros},${combined.price.cents}€`),
				html.div('.duration', [
					html.span('', `→ ${outbound.duration}`),
					html.br(),
					html.span('', `← ${inbound.duration}`)
				])
			]),
			html.div('.overlay .day-connector', [
				html.div({ class: 'day-connector-main', style: `width: ${combined.daysStay * 100}%;` }),
				html.div('.day-connector-end')
			])
		]),
		html.div('.label', date.date.formatted)
	])

const graph = (api, data) => {
	if (!data) return html.span()
	const result = []
	const bars = []
	const combinedAmounts = data.output.map(o => o.combinations.combined.price.amount)
	const createBar = createChartEntry.bind(null, Math.min(...combinedAmounts), Math.max(...combinedAmounts))
	for (let { date, combinations } of data.output) {
		const { outbound, inbound, combined } = combinations
		if (!outbound || !outbound.price || !inbound || !inbound.price) {
			bars.push(html.span('', 'empty'))
		} else {
			bars.push(createBar(date, outbound, inbound, combined))
		}
	}
	result.push(html.div('#graph', bars))
	return result
}

const createTemplate = api => (data, error) => {
	const document = '<!doctype html>' + html.html(null, [
		head(api, data),
		html.body(null, [
			html.div('#page', [
				html.div('#header', [html.a({ href: './', title: 'Preisgrafik' }, [html.h1(null, 'Preisgrafik')])]),
				html.div({ id: 'route', class: 'subtitle' }, [html.span(null, generateSubTitleRoute(data))]),
				html.div({ id: 'options', class: 'subtitle' }, generateSubTitleOptions(api, data)),
				graph(api, data)
			]),
			html.div('#footer', [
				html.a({ id: 'faq', href: './faq' }, 'FAQ'),
				html.span(null, ' – '),
				html.a({ id: 'impressum', href: './impressum' }, 'Rechtliches')
			])
		])
	])
	return beautify(document)
}

module.exports = createTemplate
