'use strict';

angular.module('psJwtApp').service('auth', function ($http, authToken, API_URL, $state) {
	var url = API_URL + 'login';

	this.login = function(email, password){
		return $http.post(url, {
			email: email, 
			password: password
		}).success(function(res){
			authToken.setToken(res.token);
			$state.go('main');
		});
	}

});
