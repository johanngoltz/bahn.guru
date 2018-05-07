'use strict'

const stations = require('bilkom').stations

const station = (s) => {
	if(!s) return Promise.reject(false)
	return stations(s).then(
		(data) => {
			const found = data[0]
			if(found) return found
			return false
		},
		(error) => false
	)
}

module.exports = station
