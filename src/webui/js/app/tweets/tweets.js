angular
	.module('MinterTweetsModule', ['restangular'])
    .config([
        '$stateProvider',
        function config($stateProvider) {
            'use strict';
            $stateProvider
                .state(
                    'authz.topics.tweet_documents',
                    {
                        parent: 'authz.topics',
                        url: '^/topics/:topicId/tweet/:tweetId/documents',
                        views: {
                            '': {
                                templateUrl: 'js/app/documents/partials/view.html',
                                controller: 'TopicDocumentsIndexController'
                            }
                        }
                    }
                ).state(
                    'authz.topics.config',
                    {
                        parent: 'authz.topics',
                        url: '^/topics/:topicId/config',
                        views: {
                            '': {
                                controller: 'TopicsEditController',
                                templateUrl: 'js/app/tweets/partials/edit.html'
                            }
                        }
                    }
                );
        }
    ]).controller(
    'TweetsIndexController',
    [
        '$scope', '$stateParams', 'Restangular', 'SampleTweets',
        function TopicTweetsIndexController($scope, $stateParams, Restangular, SampleTweets) {
            'use strict';
            $scope.saved = false;
            $scope.topicId = $stateParams.topicId;
            Restangular
                .all('api/tweets',
                    {
                        reviewed: 0
                    }
                ).then(
                    function (tweets) {
                        $scope.tweets = SampleTweets;
                    },
                    function (err) {

                    }
                );
        }
    ]).controller(
    'TweetsSearchIndexController',
    [
        '$rootScope', '$scope', '$stateParams', 'Restangular',
        function TweetsSearchIndexController($rootScope, $scope, $stateParams, Restangular) {
            'use strict';
            // $scope.saved = false;
            // $scope.searching = false;
            // Restangular
            //     .one('api/users', $rootScope.Sessions.getUser())
            //     .all(
            //         'tweets',
            //         {
            //             reviewed: 0
            //         }
            //     )
            //     .getList()
            //     .then(
            //         function (tweets) {
            //             $scope.selectedTweets = tweets;
            //         },
            //         function (err) {

            //         }
            //     );

            // $scope.twitterSearch = function twitterSearch() {
            //     console.log("searching...");
            //     $scope.searching = true;
            //     Restangular
            //         .one('api/users', $rootScope.Sessions.getUser())
            //         .one('search', {q: $scope.topic.search})
            //         .get()
            //         .then(
            //             function (tweets) {
            //                 console.log("search returned...");
            //                 $scope.searching = false;
            //                 $scope.selectedTweets = tweets;
            //                 $log.debug(tweets);
            //             }
            //         );
            // };


        }
    ]).controller(
        'TweetsProposedIndexController',
        [
            '$rootScope', '$scope', '$stateParams', 'Restangular',
            function TweetsProposedIndexController(
                $rootScope,
                $scope,
                $stateParams,
                Restangular
            ) {
                'use strict';

                $scope.labelRequest = function () {
                    Restangular
                        .one('api/users', $rootScope.Sessions.getUser())
                        .one('tweets','label_request')
                        .get()
                        .then(
                            function (data) {
                                console.log(data.data[0]);
                                // $scope.savedTweets = tweets;
                            },
                            function (err) {

                            }
                        );
                }

            }
        ]
    ).controller(
        'TweetsSavedIndexController',
        [
            '$rootScope', '$scope', '$stateParams', 'Restangular',
            function TweetsSavedIndexController($rootScope, $scope, $stateParams, Restangular) {
                'use strict';
                $scope.saved = true;
                $scope.topicId = $stateParams.topicId;
                Restangular
                    .one('api/users', $rootScope.Sessions.getUser())
                    .all(
                        'tweets',
                        {
                            reviewed: 0
                        }
                    ).getList()
                    .then(
                        function (tweets) {
                            $scope.savedTweets = tweets;
                        },
                        function (err) {

                        }
                    );
            }
        ]
    );