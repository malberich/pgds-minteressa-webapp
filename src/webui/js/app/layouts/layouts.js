angular
    .module(
        "MinterLayoutsModule",
        ['restangular', 'RestResources']
    ).controller(
        'ToolbarController',
        [
            '$rootScope', '$scope', '$log', 'Restangular', 'MinterSessions',
            function ToolbarController($rootScope, $scope, $log, Restangular, MinterSessions) {
                'use strict';

                $scope.topics = [];
                if (MinterSessions.checkSession()) {
                    Restangular
                        .one('api/users', MinterSessions.getUser())
                        .get()
                        .then(
                            function (userInfo) {
                                if (angular.isArray(userInfo)) {
                                    $log.debug(userInfo[0][0]);
                                    $scope.user = userInfo[0][0].twitter;
                                }
                            },
                            function (err) {
                                $scope.user = {};
                            }
                        );
                }

                $scope.logout = function () {
                    return MinterSessions.logout();
                };
            }
        ]
    );