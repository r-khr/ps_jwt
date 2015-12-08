'use strict';

angular.module('psJwtApp')
  .controller('JobsCtrl', function ($scope, $http, APP_URL, alert) {

  	$http.get(APP_URL + 'jobs').success(function(jobs){
  		$scope.jobs = jobs;
  	}).error(function(err){
  		alert('warning', 'unable to get jobs', err.message);
  	})

  });
