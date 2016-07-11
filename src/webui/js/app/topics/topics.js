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
    ).controller(
        'TopicsHomeController',
        [
            '$rootScope', '$scope', '$log', 'Restangular',
            function TopicsHomeController($rootScope, $scope, $log, Restangular) {
                $scope.selectedTweets = [];
                $scope.classifiedTweets = [];
                $scope.topic = {};
                $scope.searching = false;
                $scope.saved = false;
                //TODO Perform periodic push against the server for saving the tweets
                function updateTweet (tweetId, selected) {
                    for (var item in $scope.selectedTweets) {
                        if ($scope.selectedTweets.hasOwnProperty(item) &&
                            $scope.selectedTweets[item].id === tweetId) {
                            //$scope.selectedTweets[item].selected = selected;
                            $scope.selectedTweets.splice(item, 1);
                            $scope.selectedTweets[item].minteressa= {
                                selected: selected
                            }
                            Restangular
                                .one('api/users', $rootScope.Sessions.getUser())
                                .one('tweets', tweetId)
                                .customPUT(
                                    $scope.selectedTweets[item],
                                    selected ? 'save' : 'discard'
                                ).then(
                                    function (data) {
                                        // $scope.classifiedTweets.push($scope.selectedTweets[item]);

                                    }
                                 );
                        }
                    }

                }

                $scope.rmTweet = function rmTweet(tweetId) {
                    updateTweet(tweetId, false);
                };

                $scope.saveTweet = function rmTweet(tweetId) {
                    updateTweet(tweetId, true);
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
                    $scope.searching = true;
                    Restangular
                        .one(
                            'api/users',
                            $rootScope.Sessions.getUser()
                        ).getList(
                            'search',
                            {q: $scope.topic.search}
                        ).then(
                            function (tweets) {
                                $scope.searching = false;
                                angular.copy(tweets, $scope.selectedTweets);
                                $log.debug(tweets);
                            }
                        );
                };

                $scope.finishTrain = function finishTrain() {
                    Restangular
                        .one('api/users', $rootScope.Sessions.getUser())
                        .one('tweets/_zzzz_/discard')
                        .customPUT(
                            {stop_train: true}
                        ).then(
                            function () {
                                $rootScope.topicStatus = 2;
                            }
                        );
                }
            }
        ]
    ).controller(
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


            }
        ]
    ).controller(
        'TopicTweetsIndexController',
        [
            '$rootScope', '$scope', '$log', '$stateParams', 'Restangular',
            function TopicTweetsIndexController($rootScope, $scope, $log, $stateParams, Restangular) {


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


            }
        ]
    );
