const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

// mailer class (treats as react component)
class Mailer extends helper.Mail {
	// initial set up for instances we create
	constructor({ subject, recipients }, content) {
		//In ES6, derived classes have to call super() if they have a constructor.
		super();

		this.sgApi = sendgrid(keys.sendGridKey);
		this.from_email = new helper.Email('no-reply@emaily.com');
		this.subject = subject;
		this.body = new helper.Content('text/html', content);
		this.recipients = this.formatAddresses(recipients);

		// Mailer built-in function
		this.addContent(this.body);
		this.addClickTracking();
		this.addRecipients();
	}

	// helper functions
	// pulling just email properties in the array
	formatAddresses(recipients) {
		return recipients.map(({ email }) => {
			return new helper.Email(email);
		});
	}

	// enable click-tracking feature (sendgrid)
	addClickTracking() {
		const trackingSettings = new helper.TrackingSettings();
		const clickTracking = new helper.ClickTracking(true, true);

		trackingSettings.setClickTracking(clickTracking);
		this.addTrackingSettings(trackingSettings);
	}

	// formatting for list of emails to process with sendgrid
	addRecipients() {
		const personalize = new helper.Personalization();

		this.recipients.forEach(recipient => {
			personalize.addTo(recipient);
		});
		this.addPersonalization(personalize);
	}

	// send to sendGrid (sendgrid API request)
	async send() {
		const request = this.sgApi.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: this.toJSON()
		});

		// getting response from sendgrid request
		const response = await this.sgApi.API(request);
		return response;
	}
}

module.exports = Mailer;
