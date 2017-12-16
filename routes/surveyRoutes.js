const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');

const mongoose = require('mongoose');
// is user logged in?
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

// call surveys model class
const Survey = mongoose.model('surveys');

module.exports = app => {
	app.get('/api/surveys', requireLogin, async (req, res) => {
		const surveys = await Survey.find({ _user: req.user.id }).select({
			recipients: false
		});

		res.send(surveys);
	});

	// this is when end user clicks the link in email
	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
		res.send('Thanks for voting!');
	});

	// webhooks
	app.post('/api/surveys/webhooks', (req, res) => {
		// extract surveyId and the choice using parser
		const p = new Path('/api/surveys/:surveyId/:choice');

		// map and extract the path from URL, remove undefined elements and uniquify using compact function
		_.chain(req.body)
			.map(({ email, url }) => {
				// following returns {surveyId: 'asfgd3', choice: 'yes'}, returns null if both not found
				const match = p.test(new URL(url).pathname);
				if (match) {
					return { email, surveyId: match.surveyId, choice: match.choice };
				}
			})
			.compact()
			.uniqBy('email', 'surveyId')
			.each(({ surveyId, email, choice }) => {
				Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: { email: email, responded: false }
						}
					},
					{
						$inc: { [choice]: 1 },
						$set: { 'recipients.$.responded': true },
						lastResponded: new Date()
					}
				).exec();
			})
			.value();

		res.send({});
	});

	// make it async arrow function
	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		// getting following data from request body
		const { title, subject, body, recipients } = req.body;

		// create survey instance
		const survey = new Survey({
			// same as title: title (ES2015 syntax)
			title,
			subject,
			body,
			// subdocument collections
			//recipients: recipients.split(',').map(email=>{return{email: email}})
			recipients: recipients.split(',').map(email => ({ email: email.trim() })),
			_user: req.user.id,
			dateSent: Date.now()
		});

		// immediately catch error when we do async await
		try {
			// Send an email!
			const mailer = new Mailer(survey, surveyTemplate(survey));
			await mailer.send();

			// update database
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();

			// send back new user model
			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}
	});
};
