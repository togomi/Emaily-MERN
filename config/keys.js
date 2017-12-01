// keys.js - figure out what set of credentials to return (dev or prod)
if (process.env.NODE_ENV === 'production') {
	// production - return the prod set of keys
	module.exports = require('./prod');
} else {
	// development - return the dev keys
	module.exports = require('./dev');
}
