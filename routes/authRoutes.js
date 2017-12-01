const passport = require('passport');
//route handler other methods (get, post, put, delete, path) available
// get -> watch for incoming requests with this method
// '/' -> watch for reqeusts trying to access '/' (localhost:5000*/*)
// req -> object representing the incoming requests
// res -> object representing the outgoing response
// res.send... -> immdediately send some JSON back to whoever made this request.
/*
app.get('/', (req, res) => {
	res.send({ hello: 'there' });
});
*/

module.exports = app => {
	// use authenticate specifying 'google' strategy
	// 'google' automatically picks up GoogleStrategy object when authenticate
	// scope: permission parameters (can be contact list, emails)
	app.get(
		'/auth/google',
		passport.authenticate('google', {
			scope: ['profile', 'email']
		})
	);

	// automatically handles with code this time
	app.get('/auth/google/callback', passport.authenticate('google'));

	// log out
	app.get('/api/logout', (req, res) => {
		req.logout(); // takes cookie and kill it
		res.send(req.user);
	});

	// whenever app send requests; req=incoming request, res=outgoing response
	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});
};
