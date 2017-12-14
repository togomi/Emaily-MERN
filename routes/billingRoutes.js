const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
	app.post('/api/stripe', requireLogin, async (req, res) => {
		// cofiguration object, request stripe api, create charges, sending back
		const charge = await stripe.charges.create({
			amount: 500,
			currency: 'usd',
			description: '$5 for 5 credits',
			source: req.body.id
		});

		// add credit to user model; req.user can be used because of passport
		req.user.credits += 5;
		// save() is async request
		const user = await req.user.save();

		// send back to response
		res.send(user);
	});
};
