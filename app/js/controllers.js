'use strict';

/* Controllers */

var controllers = angular.module('portello.controllers', []);

controllers.controller('LoginCtrl', ['$scope', '$location', 'cardService',
    function($scope, $location, cardService) {
        $scope.submit = function() {
            cardService.getToken($scope.username, $scope.password, null, null, function(err) {
                if (err)
                    console.log(err);
                else {
                    console.log('successfully authenticated');
                    $location.url('/home');
                }
            });
        };
    }
]);

controllers.controller('HeaderCtrl', ['$scope', '$rootScope', 'cardService', function ($scope, $rootScope, cardService) {
    $scope.$watch('searchText', function () {
        $rootScope.searchText = $scope.searchText;
    });

    $rootScope.$watch('token', function () {
        if(!$rootScope.token)
            return;

     $scope.username = 'Welcome, ' + $rootScope.firstName + '!';

        // cardService.getUsername(function(err, name) {
        //     if(err)
        //         return;

        //     $scope.username = 'Welcome, ' + name.me.firstName + '!';
        // });
    });
}]);

controllers.controller('CourseCtrl', ['$scope', '$location', 'cardService', '$stateParams', '$rootScope', '$timeout',
    function($scope, $location, cardService, $stateParams, $rootScope, $timeout) {
        $rootScope.$watch('searchText', function (value) {
            $scope.searchText = typeof value == 'undefined' ? '' : value;
            console.log($scope.searchText);
        });

        if(!$rootScope.userId) {
            $location.url('/login');// $rootScope.userId = '2127715';
            return;
        }

        cardService.getCardsForUser($stateParams.cardId, function (err, data) {
            if (err) {
                console.log('error occured while loading cards');
                return;
            }

            $scope.cardStack = [[],[],[]];

            for (var i = 0; i < data.length; i++) {
                (function (i, $scope, data) {
                    $timeout(function() {
                        $scope.cardStack[i%3].push(data[i]);
                    }, i*50);
                })(i, $scope, data);
            }
        });

        $scope.loadWhatsNew = function (card) {
            // TODO: for now, let's just assume this will always be the announcements feed
            cardService.getWhatsNewForCard(card.externalLinks[0].href, function (err, data) {
                _.extend(card, {
                    cardAnnouncements : data.announcements,
                    cardAnnouncementsLoaded: true
                });
            });
        };

        $scope.goToCardUrl = function (card) {
            if (card.linkUri) {
                cardService.resolveLinkUri(card.linkUri, function (err, url) {
                    if(err) {
                        console.log('Error resolving url');
                        return;
                    }

                    // remove the quotes from the url
                    url = url.replace(/"/g, "");     
                    document.location.href = url;              
                });
            } else {
                $location.url('/card/' + card.id);
            }
        }
    }
]);