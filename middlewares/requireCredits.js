// next is like done callback (call next middleware)
module.exports = (req, res, next) => {
	if (req.user.credits < 1) {
		// 403: forbidden
		return res.status(403).send({ error: 'Not enough credits!' });
	}

	next();
};
