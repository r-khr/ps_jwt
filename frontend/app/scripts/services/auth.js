'use strict';

angular.module('psJwtApp').service('auth', function ($http, authToken, API_URL, $state, $window, $q) {

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
	var clientId = '927479755973-h32bfmj92eqrbl3f4f5e4565n0d4at5a.apps.googleusercontent.com';
	var redirectUri = window.location.origin;

	urlBuilder.push('response_type=code',
		'client_id=' + clientId,
		'redirect_uri=' + redirectUri,
		'scope=profile email');

	this.googleAuth = function(){
		var url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlBuilder.join('&');
		var options = 'width=500, height=500, left=' + ($window.outerWidth - 500) / 2 + ', top=' + ($window.outerHeight - 500 ) / 2.5;

		var deferred = $q.defer();	

		var popup = $window.open(url, '', options);
		$window.focus();

		$window.addEventListener('message', function(event){
			if(event.origin === $window.location.origin){
				var code = event.data;
				popup.close();

				$http.post(API_URL + 'auth/google', {
					code:code,
					clientId:clientId,
					redirectUri:redirectUri
				}). success(function(jwt){
					authSuccessful(jwt);
					deferred.resolve(jwt);
				});
			}
		});

		return deferred.promise;
	}

});
