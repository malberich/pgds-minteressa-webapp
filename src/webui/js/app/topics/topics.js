/*global angular */
/*global appName */
/*global UiGridBaseController*/
angular.module(
        'MinterTopicsModule',
        [
            'restangular',
            'RestResources',
            'ui.router'
        ]
    ).config(
        function config($stateProvider) {
            'use strict';
            $stateProvider
                .state(
                    'authz.topics',
                    {
                        parent: 'authz',
                        url: '^/topics/:topicId',
                        views: {
                            '': {
                                templateUrl: 'js/app/topics/partials/panel.html',
                                controller: 'TopicsPanelController'
                            },
                            'config@authz.topics': {
                                templateUrl: 'js/app/topics/partials/edit.html',
                                controller: 'TopicsEditController'
                            },
                            'saved@authz.topics': {
                                templateUrl: 'js/app/tweets/partials/index.html',
                                controller: 'TopicSavedTweetsController'
                            },
                            'unreviewed@authz.topics': {
                                templateUrl: 'js/app/tweets/partials/index.html',
                                controller: 'TopicTweetsIndexController'
                            },
                            'searched@authz.topics': {
                                templateUrl: 'js/app/tweets/partials/searched.html'
                            },
                            'documents@authz.topics': {
                                templateUrl: 'js/app/tweets/partials/index.html',
                                controller: 'TopicTweetDocumentsIndexController'
                            },
                            'view@authz.topics': {
                                templateUrl: 'js/app/tweets/partials/view.html'
                            }
                        }
                    }
                );
        }
    ).controller('TopicsIndexController', [
        '$scope', '$log', '$state', 'Restangular', 'MinterSessions',
        function TopicsIndexController($scope, $log, $state, Restangular, MinterSessions) {
            'use strict';
            $scope.topics = [];

            $scope.newTopicData = {
                title: ''
            };

            $scope.newTopic = function newTopic () {
                Restangular
                    .all('api/topics')
                    .post($scope.newTopicData)
                    .then(
                        function (data) {
                            $scope.newTopicTitle = '';
                            $log.debug(data);
                            if (data.data._id) {
                                getTopics();
                                $state.go('authz.topics', {params:{topic_id: data._id}});
                            }
                        }
                    );
            };

            $scope.newTopicTitle = '';
        }
    ]).controller('TopicsPanelController', [
        '$scope', '$stateParams', '$interval', 'MinterSessions', 'Restangular',
        function TopicsPanelController($scope, $stateParams, $interval, MinterSessions, Restangular) {
            var topicInterval,
                getTopics = function getTopics () {
                    Restangular
                        .all('api/topics')
                        .getList()
                        .then(
                            function (topicList) {
                                $scope.topics = topicList;

                            },
                            function (err) {
                                $scope.topics = [];
                            }
                        );
                };

            $scope.topic = {};
            $scope.selectedTweets = [];
            if (!/^new$/.test($stateParams.topicId)) {
                $scope.newTopic = false;
                Restangular
                    .one('api/topics', $stateParams.topicId)
                    .get()
                    .then(
                        function (thisTopic) {
                            $scope.topic = thisTopic[0];
                        }
                    );
            } else {
                $scope.topic = {
                    title: '',
                    timelineCount: 100,
                    search: ''
                }
                $scope.newTopic = true;
            }
            if (MinterSessions.checkSession()) {
                getTopics();
                topicInterval = $interval(getTopics, 10000);
            }

            function cancelInterval () {
                if (angular.isObject(topicInterval)) {
                    $interval.cancel(topicInterval);
                }
            }

            $scope.$on('session.logout', cancelInterval);
            $scope.$on('$destroy', cancelInterval);
            $scope.$on('session.login', getTopics);
        }
    ]).controller(
        'TopicsEditController',
        [
            '$rootScope', '$scope', '$log', '$stateParams', 'Restangular',
            function TopicsEditController($rootScope, $scope, $log, $stateParams, Restangular) {


                $scope.saveTopicConfig = function saveTopicConfig() {
                    if (!$scope.newTopic) {
                        Restangular
                            .one('api/topics', $stateParams.topicId)
                            .get()
                            .then(
                                function (thisTopic) {
                                    angular.copy(thisTopic[0], $scope.topic);
                                    Restangular
                                        .one('api/topics', $stateParams.topicId)
                                        .put($scope.topic)
                                        .then(
                                            function (savedTopic) {
                                                $scope.newTopic = false;
                                            }
                                        );
                                }
                            );
                    } else {
                        Restangular
                            .all('api/topics')
                            .post($scope.topic)
                            .then(
                                function (savedTopic) {
                                    angular.copy(savedTopic, $scope.topic);
                                    $log.debug(savedTopic);
                                }
                            );
                    }
                };

                $scope.fetchTimeline = function fetchTimeline() {
                    Restangular
                        .one('api/users', $rootScope.Sessions.getUser())
                        .getList('timeline')
                        .then(
                            function (tweets) {
                                angular.copy(tweets, $scope.selectedTweets);
                                $log.debug(tweets);
                            }
                        );
                };

                $scope.twitterSearch = function twitterSearch() {
                    Restangular
                        .one('api/users', $rootScope.Sessions.getUser())
                        .getList('search', {q: $scope.topic.search})
                        .then(
                            function (tweets) {
                                angular.copy(tweets, $scope.selectedTweets);
                                $log.debug(tweets);
                            }
                        );
                };
            }
        ]
    );
