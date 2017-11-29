const express = require('express');

// app object; express App to register this route handler
const app = express();

//route handler other methods (get, post, put, delete, path) available
// get -> watch for incoming requests with this method
// '/' -> watch for reqeusts trying to access '/' (localhost:5000*/*)
// req -> object representing the incoming requests
// res -> object representing the outgoing response
// res.send... -> immdediately send some JSON back to whoever made this request.
app.get('/', (req, res) => {
	res.send({ hi: 'there' });
});

// node it wants to listen to which port
app.listen(5000);
