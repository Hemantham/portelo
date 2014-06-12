'use strict';

var services = angular.module('portello.services', []);

services.factory('cardService', ['$rootScope', '$http', '$cookies',
    function($rootScope, $http) {
        var service = {
            getToken: function(username, password, clientId, ep, cb) {
                ep = config.development.ep;

                var postData = {
                    userid: ( ep != null && ep.length != 0 ? ep + '\\' : '') +  username,
                    password: password,
                    clientname: ep
                };



                $http.post(config.development.authurl, postData)
                .success(

                    function(data) {
                    //data = data.replace(/"/g, "");

                    $rootScope.token = data.authValue;
                    $rootScope.authKey = data.authKey;
                    $rootScope.authValue = data.authValue;
                    $rootScope.authParameterType = data.authParameterType;
                    $rootScope.provider = data.provider;
                    $rootScope.firstName = data.firstName;
                    $rootScope.lastName = data.lastName;

                    $rootScope.userId = data.userid ;//data.split('|')[2]; // user id is the third element of the array
                    // $cookies.put('token', data);
                    console.log(data);
                    cb();
                }).error(function(data) {
                    cb(data);
                });
            },
            getCardsForUser: function(id, cb) {
                if(!$rootScope.userId) {
                    console.log('$rootScope.userId not set. Setting the default value');
                    $rootScope.userId = '2127705';
                }

                var url = config.development.cardsapi +  '/user/' + $rootScope.userId + '/cards';

                if (id) { // if there's an id that means this is a card with children
                    url += '/' + id + '/children';
                }

                console.log(url);

            	$http.get(url)
                .success(function (data) {
                   cb(null, data.items);
                })
                .error(function (data) {
                    cb(data);
                });
            },
            getWhatsNewForCard: function (url, cb) {
                if (!$rootScope.token)
                    console.log('$rootScope.token not preesent'); // TODO:
                
                $http.post('/api/proxy', {
                    url: url,
                    token: $rootScope.token
                })
                .success(function (data) {
                    cb(null, data);
                })
                .error(function (data) {
                    cb(data);
                });
            },
            getUsername: function (cb) {
                if (!$rootScope.token)
                    console.log('$rootScope.token not preesent'); // TODO:
                
                $http.post('/api/proxy', {
                    url: config.development.mapi + '/me',
                    token: $rootScope.token
                })
                .success(function (data) {
                    cb(null, data);
                })
                .error(function (data) {
                    cb(data);
                });
            },
            resolveLinkUri: function (url, cb) {
                if (!$rootScope.token) {
                    console.log('$rootScope.token not preesent'); // TODO:
                    $rootScope.token = '';
                }

                $http({
                    url: url,
                    method: 'GET',
                    headers: {
                        "X-Authorization": $rootScope.token
                    }
                })
                .success(function (data) {
                    cb(null, data);
                })
                .error(function (data) {
                    cb(data);
                });
            }
        }

        return service;
    }
]);

