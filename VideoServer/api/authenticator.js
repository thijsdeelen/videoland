var jwt		= require('jsonwebtoken');

function authenticate(request, response){
	var user = {
		username: 'test',
		email: 'test@test.com'
	}

	var token = jwt.sign(user, process.env.TOPSECRET, {
		expiresIn: 1000

	});
	response.json({
		success: true,
		token: token
	})

	console.log("[TOKEN] - Token obtained!")
}

module.exports = {
    authenticate
};