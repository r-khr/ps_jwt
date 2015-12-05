'use strict';

/**
 * @ngdoc overview
 * @name psJwtApp
 * @description
 * # psJwtApp
 *
 * Main module of the application.
 */
 angular.module('psJwtApp').config(function($urlRouterProvider 
  ,$stateProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider

 .state('main', {
    url: '/',
    templateUrl: '/views/main.html'
  })
  .state('register', {
    url: '/register',
    templateUrl: '/views/register.html',
    controller: 'RegisterCtrl'
  });
});