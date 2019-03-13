'use strict'

const moment = require('moment-timezone')
const Queue = require('p-queue')
const retry = require('p-retry')
const timeout = require('p-timeout')
const formatDuration = require('ms')

const timeoutTime = 10 * 1000

const generateDays = weeks => {
	let date = moment().tz('Europe/Berlin').startOf('day')

	const dates = []
	for (let i = 0; i < weeks * 7; i++) {
		const formattedDate = dates.length === 0 || +date.format('D') === 1
			? date.format('D MMM')
			: date.format('D')
		dates.push({ date: { raw: moment(date), formatted: formattedDate } })
		date.add(1, 'days')
	}

	return dates
}

const requestJourneys = (q, api, params, date) =>
	q.add(() =>
		retry(() => timeout(api.journeys(params, date), timeoutTime), { retries: 3 })
			// eslint-disable-next-line handle-callback-err
			.catch(err => []))

const paramsForInboundJourney = params => {
	const newParams = { ...params };
	[newParams.destination, newParams.origin] = [newParams.origin, newParams.destination]
	return newParams
}

const journeyHasPrice = journey => journey.price && journey.price.amount

const addShorthandAttributesToJourney = journey => ({
	...journey,
	duration: formatDuration(new Date(journey.legs[journey.legs.length - 1].arrival) - new Date(journey.legs[0].departure))
})

const graph = (api, params) => {
	const q = new Queue({ concurrency: 16 })
	const days = generateDays(params.weeks)
	const outboundParams = params
	const inboundParams = paramsForInboundJourney(params)

	const requestJourneysIntoQ = requestJourneys.bind(null, q, api)
	const requests = days.flatMap(d => [
		requestJourneysIntoQ(outboundParams, d.date.raw),
		requestJourneysIntoQ(inboundParams, d.date.raw.clone().add(3, 'days'))
	])
	return Promise.all(requests)
		.then(inAndOutbundJourneysPerDay => {
			const voyages = []
			for (let i = 0; i < inAndOutbundJourneysPerDay.length;) {
				const journeyCombinations = {};
				['outbound', 'inbound'].forEach(k => {
					journeyCombinations[k] =
						inAndOutbundJourneysPerDay[i]
							.filter(journeyHasPrice)
							.map(addShorthandAttributesToJourney)
							.sort((j1, j2) => j1.duration - j2.duration)
							.sort((j1, j2) => j1.price.amount - j2.price.amount)[0]
					i++
				})
				if (journeyCombinations.outbound && journeyCombinations.inbound) {
					const departureDay = moment(journeyCombinations.outbound.legs[0].departure).startOf('day')
					const arrivalDay = moment(journeyCombinations.inbound.legs[0].departure).startOf('day')
					journeyCombinations.combined = {
						price: journeyCombinations.outbound.price.amount + journeyCombinations.inbound.price.amount,
						daysStay: moment.duration(arrivalDay.diff(departureDay)).asDays() | 0
					}
					voyages.push({ date: days[i / 2 - 1 | 0], combinations: journeyCombinations })
				}
			}

			if (!voyages.length) return null
			else return voyages
		})
		.catch(err => {
			console.error(err)
			return null
		})
}

module.exports = graph
