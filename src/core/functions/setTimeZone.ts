const pg = require('pg') //eslint-disable-line

export const setTimeZone = function (timezone = '+0000') {
	const TIMESTAMPTZOID = 1184
	pg.types.setTypeParser(TIMESTAMPTZOID, (stringValue) => {
		return new Date(stringValue + timezone)
	})
}
