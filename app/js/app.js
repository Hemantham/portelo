'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('portello', ['portello.directives', 'portello.controllers', 'portello.services', 'ui.router', 'ngAnimate', 'ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/courses.html',
            controller: 'CourseCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .state('card', {
            url: '/card/:cardId',
            templateUrl: 'partials/courses.html',
            controller: 'CourseCtrl'
        });
});

app.run(function ($cookies, $rootScope) {
    // $rootScope.token = $cookies.get('token');
});