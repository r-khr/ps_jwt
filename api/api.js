var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var request = require('request');
var createSendToken = require('./services/jwt.js');
var User = require('./models/User.js');
var facebookAuth = require('./services/facebookAuth.js');
var localStrategy = require('./services/localStrategy.js');

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

passport.serializeUser(function(user, done){
	done(null, user.id);
})

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-ALlow-Headers', 'Content-Type, Authorization');
 
	next();
});

passport.use('local-register', localStrategy.register);
passport.use('local-login', localStrategy.login);

app.post('/register', passport.authenticate('local-register'), function(req, res){
	createSendToken(req.user, res);
});

app.post('/login', passport.authenticate('local-login'), function(req, res){
	createSendToken(req.user, res);
})

app.post('/auth/facebook', facebookAuth);

var jobs = [
'Cook',
'SuperHero',
'Unicor Wisprer',
'Toast Inspector'
];

app.get('/jobs', function(req, res){
	if(!req.headers.authorization){
		return res.status(401).send({
			message: 'You are not authorized'
		});
	}

	var token = req.headers.authorization.split(' ')[1];
	var payload = jwt.decode(token, "shhh..");

	if(!payload.sub){
		res.status(401).send({
			message: 'Authentication failed'
		});
	}

	res.json(jobs);
})

app.post('/auth/google', function(req, res){

	var url = 'https://www.googleapis.com/oauth2/v4/token';
	var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

	var params = {
		client_id: req.body.clientId,
		redirect_uri: req.body.redirectUri,
		code: req.body.code,
		grant_type: 'authorization_code',
		client_secret: '3IcfPvtBB7vZw6CbyJck5LMZ'
		// normally putting client_secret here isn't a good idea, client secret should be stored securely
	}

	request.post(url, { 
		json: true, 
		form: params 
	},  function (err, response, token) {
		var accessToken = token.access_token;
		var headers = {
			Authorization: 'Bearer ' + accessToken
		}
		request.get({
			url: apiUrl,
			headers: headers,
			json: true
		}, function (err, response, profile) {
			User.findOne({ googleId: profile.sub }, function(err, foundUser){
				if(foundUser) return createSendToken(foundUser, res);

				var newUser = new User();
				newUser.googleId = profile.sub;
				newUser.displayName = profile.name;
				newUser.save(function(err){
					if(err) return next(err);
					createSendToken(newUser, res);
				})
			})
		})

	});

})

mongoose.connect('mongodb://admin:1234@ds031681.mongolab.com:31681/ps_jwt');

mongoose.connection.on('error', function (err) {
	console.log(err);
});


var server = app.listen(3000, function(){
	console.log('api listening on', server.address().port);
});

