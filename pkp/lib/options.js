'use strict'

const html = require('pithy')
const moment = require('moment-timezone')
const mdf = require('moment-duration-format')

const optionHTML = (value, text, checked) => {
	const opt = {value: value}
	if(checked) opt.selected = true
	return html.option(opt, text)
}

const input = (params) => ([
	html.span('.optRow', [
		html.label('#departureAfter', ['After: ', html.input({type: 'text', placeholder: '--:--', value: (params.departureAfter) ? params.departureAfter.format('hh:mm') : '', name: 'departureAfter'}), ' h']),
		', '
	]),
	html.span('.optRow', [
		html.label('#arrivalBefore', ['before: ', html.input({type: 'text', placeholder: '--:--', value: (params.arrivalBefore)? params.arrivalBefore.format('hh:mm') : '', name: 'arrivalBefore'}), ' h']),
		', '
	]),
	html.span('.optRow', [
		'up to ',
		html.label('#duration', [html.input({type: 'text', placeholder: 24, value: params.duration || '', name: 'duration'}), ' h travel time']),
		'.'
	])
])

const text = (params) => {
	const result = []
	if(params.departureAfter&&params.departureAfter.format('m')>0) result.push('After '+params.departureAfter.format('HH:mm')+' h', ', ')
	if(params.arrivalBefore&&params.arrivalBefore.format('m')>0) result.push('before '+params.arrivalBefore.format('HH:mm')+' h', ', ')
	if(params.duration&&params.duration>0) result.push('Travel time up to '+params.duration+' h', ', ')
	if(result.length) result.pop()
	return result
}

const url = (params) => {
	const result = []
	if(params.departureAfter) result.push('departureAfter='+params.departureAfter.format('HH:mm'))
	if(params.arrivalBefore) result.push('arrivalBefore='+params.arrivalBefore.format('HH:mm'))
	if(params.duration) result.push('duration='+params.duration)
	return result
}

module.exports = {input, text, url}
