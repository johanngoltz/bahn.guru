const html = require('pithy')
const beautify = require('js-beautify').html
const moment = require('moment-timezone')
const helpers = require('../helpers')

const head = (api, data) => {
    const title = generateSubTitleRoute(data).join('') + ' | Preisverlauf'
    const elements = [
        ...helpers.staticHeader(api),
        html.title(null, ` ${title} | ${api.settings.title}`),
        ...helpers.opengraph({ api, extraTitle: title }),
        html.link({ rel: 'stylesheet', type: 'text/css', href: '/assets/styles/calendar.css' })
    ]
    return html.head(null, elements)
}

const generateSubTitleRoute = (data) => {
	return [
		data.input.origin.name,
		' → ',
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

const graph = (api, data) => {
    if (!data) return html.span
    const result = [];
    for (let { outbound, inbound, combined } of data.output) {
        if (!outbound || !outbound.price || !inbound || !inbound.price) {
            result.push(html.span('', 'empty'));
        } else {
            result.push(html.span('', `${moment(outbound.legs[0].departure).format('D.M. HH:mm')} — ${moment(inbound.legs[inbound.legs.length-1].arrival).format('D.M. HH:mm')}, ${Math.round(combined.price, 1)}€`))
        }
    }
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
                graph(api, data),
                //html.div('#more', moreLink(api, data))
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
