'use strict';

angular.module('psJwtApp').service('auth', function ($http, authToken, API_URL, $state, $window) {

	function authSuccessful(res){
		authToken.setToken(res.token);
		$state.go('main');
	}

	this.login = function(email, password){
		return $http.post(API_URL + 'login', {
			email: email, 
			password: password
		}).success(authSuccessful);
	}

	this.register = function(email, password){
		return $http.post(API_URL + 'register',{
			email: email, 
			password: password
		}).success(authSuccessful);
	}
	
	var urlBuilder = [];
	urlBuilder.push('response_type=code',
		'client_id=927479755973-h32bfmj92eqrbl3f4f5e4565n0d4at5a.apps.googleusercontent.com',
		'redirect_uri=' + window.location.origin,
		'scope=profile email');

	this.googleAuth = function(){

		var url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlBuilder.join('&');
		var options = "width=500, height=500, left=" + ($window.outerWidth - 500) / 2 + ", top=" + ($window.outerHeight - 500 ) / 2.5;

		$window.open(url, '', options);
	}



});
