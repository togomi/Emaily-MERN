const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// access to mongoose model class users
const User = mongoose.model('users'); // one argument = fetch; in index.js, loads userSchema into mongoose

// function definitions
passport.serializeUser((user, done) => {
	done(null, user.id); // mongo ID
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

// configuration for passport.js
// console.developers.google.com
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true
		},
		// call back function
		async (accessToken, refreshToken, profile, done) => {
			// then is promise as this is async; existingUser = instance that is found. NULL if not found
			const existingUser = await User.findOne({ googleID: profile.id });
			if (existingUser) {
				// already have a record with a given profile ID
				return done(null, existingUser); // null = error handler, existingUser is return value
			}

			// we don't have a user record with this ID, make a new record
			const user = await new User({ googleID: profile.id }).save(); // save() will save it to database
			done(null, user);
		}
	)
);
