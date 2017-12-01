const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');
require('./services/passport');
mongoose.connect(keys.mongoURI);

// app object; express App to register this route handler
const app = express();

// middlewares: small function for incoming request before going to route handlers
// cookieSession configuration for express
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
		keys: [keys.cookieKey] // for encryption
	})
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

// heroku PORT from environment variable (or if env variable is not defined, use 5000)
const PORT = process.env.PORT || 5000;

// node it wants to listen to which port
app.listen(PORT);
