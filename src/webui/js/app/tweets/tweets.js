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

            // function updateTweet (tweetId, selected) {
            //     Restangular
            //         .one('api/tweets', tweetId)
            //         .get()
            //         .then(
            //             function (tweetData) {
            //                 var thisTweet = tweetData.data[0] || {id: tweetId, seleted: false};
            //                 thisTweet.selected = false;
            //                 return thisTweet
            //                     .put()
            //                     .then(
            //                         function () {
            //                             var counter = 0, item;
            //                             for (item in $scope.tweets) {
            //                                 if ($scope.tweets[item].id === tweetId) {
            //                                     $scope.tweets.splice(counter, 1);
            //                                     break;
            //                                 }
            //                                 counter += 1;
            //                             }
            //                         }
            //                     );
            //             }
            //         );
            // }

            // $scope.rmTweet = function rmTweet(tweetId) {
            //     updateTweet(tweetId, false);
            // };

            // $scope.saveTweet = function rmTweet(tweetId) {
            //     updateTweet(tweetId, true);
            // };


            $scope.sample_text = 'This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  ';
        }
    ]).controller(
    'TweetsSearchIndexController',
    [
        '$rootScope', '$scope', '$stateParams', 'Restangular',
        function TweetsSearchIndexController($rootScope, $scope, $stateParams, Restangular) {
            'use strict';
            $scope.saved = false;
            Restangular
                .one('api/users', $rootScope.Sessions.getUser())
                .all(
                    'tweets',
                    {
                        reviewed: 0
                    }
                )
                .getList()
                .then(
                    function (tweets) {
                        $scope.selectedTweets = tweets;
                    },
                    function (err) {

                    }
                );

            $scope.twitterSearch = function twitterSearch() {
                Restangular
                    .one('api/users', $rootScope.Sessions.getUser())
                    .one('search', {q: $scope.topic.search})
                    .get()
                    .then(
                        function (tweets) {
                            $scope.selectedTweets = tweets;
                            $log.debug(tweets);
                        }
                    );
            };
        }
    ]).controller(
        'TweetsSavedIndexController',
        [
            '$scope', '$stateParams', 'Restangular',
            function TweetsSavedIndexController($scope, $stateParams, Restangular) {
                'use strict';
                $scope.saved = true;
                $scope.topicId = $stateParams.topicId;
                Restangular
                    .all('api/tweets')
                    .getList(
                        {
                            reviewed: 200
                        }
                    ).then(
                        function (tweets) {
                            $scope.reviewedTweets = tweets;
                        },
                        function (err) {

                        }
                    );

                // function updateTweet (tweetId, selected) {
                //     Restangular
                //         .one('api/users', $rootScope.Sessions.getUser())
                //         .one('tweets', tweetId)
                //         .get()
                //         .then(
                //             function (tweetData) {
                //                 var thisTweet = tweetData.data[0] || {id: tweetId, selected: false};
                //                 thisTweet.selected = false;
                //                 return thisTweet
                //                     .put()
                //                     .then(
                //                         function () {
                //                             var counter = 0, item;
                //                             for (item in $scope.tweets) {
                //                                 if ($scope.tweets[item].id === tweetId) {
                //                                     $scope.tweets.splice(counter, 1);
                //                                     break;
                //                                 }
                //                                 counter += 1;
                //                             }
                //                         }
                //                     );
                //             }
                //         );
                // }

                // $scope.rmTweet = function rmTweet(tweetId) {
                //     updateTweet(tweetId, false);
                // };
            }
        ]
    ).controller(
        'TweetsProposedIndexController',
        [
            '$scope', '$stateParams', 'Restangular',
            function TweetsProposedIndexController(
                $scope,
                $stateParams,
                Restangular
            ) {
                'use strict';
                $scope.saved = true;
                $scope.topicId = $stateParams.topicId;
                Restangular
                    .all('api/tweets')
                    .getList(
                        {
                            reviewed: 200
                        }
                    ).then(
                        function (tweets) {
                            $scope.reviewedTweets = tweets;
                        },
                        function (err) {

                        }
                    );

                // function updateTweet (tweetId, selected) {
                //     Restangular
                //         .one('api/users', $rootScope.Sessions.getUser())
                //         .one('tweets', tweetId)
                //         .get()
                //         .then(
                //             function (tweetData) {
                //                 var thisTweet = tweetData.data[0] || {id: tweetId, selected: false};
                //                 thisTweet.selected = false;
                //                 return thisTweet
                //                     .put()
                //                     .then(
                //                         function () {
                //                             var counter = 0, item;
                //                             for (item in $scope.tweets) {
                //                                 if ($scope.tweets[item].id === tweetId) {
                //                                     $scope.tweets.splice(counter, 1);
                //                                     break;
                //                                 }
                //                                 counter += 1;
                //                             }
                //                         }
                //                     );
                //             }
                //         );
                // }

                // $scope.rmTweet = function rmTweet(tweetId) {
                //     updateTweet(tweetId, false);
                // };
            }
        ]
    );