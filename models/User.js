const mongoose = require('mongoose');
const { Schema } = mongoose; //destructuring; const Schema = mongoose.Schema; // mongoose has property Schema

// mongoose gets rid of property of mongoDB having random variable
//  wants to know name of fields ahead of time
const userSchema = new Schema({
	googleID: String
});

// create model class - create 'user' class using above schema
//  skip this line if already exists
mongoose.model('users', userSchema);
