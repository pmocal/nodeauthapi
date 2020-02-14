const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
	res.json({
		message: 'Welcome to the API'
	});
});

app.post('/api/posts', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err) {
			res.sendStatus(403);
		} else {
			res.json({
				message: 'Post created...',
				authData
			});
		}
	});
})

app.post('/api/login', (req, res) => {
	//mock user
	const user = {
		id: 1,
		username: 'brad',
		email: 'brand@gmail.com'
	}

	jwt.sign({user: user}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
		res.json({
			token
		});
	});
});

// Format of token
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
	// get auth header value
	const bearerHeader = req.headers['authorization']
	// check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		req.token = bearer[1];
		next();
	} else {
		// forbidden
		res.sendStatus(403);
	}
}

app.listen(5000, () => console.log('Server started on port 5000'));
