angular
	.module('MinterDocumentsModule', ['restangular'])
	.controller(
        'TopicTweetDocumentsIndexController',
        [
            '$scope', '$stateParams', 'Restangular', 'SampleTweets',
            function TopicTweetDocumentsIndexController($scope, $stateParams, Restangular, SampleTweets) {
                'use strict';
                $scope.documents = [];

                Restangular
                    .one('api/topics', $stateParams.topicId)
                    .one('tweets', $scope.tweetId)
                    .getList('documents')
                    .then(
                        function (tweets) {
                            $scope.tweets = SampleTweets;
                        },
                        function (err) {

                        }
                    );

                function updateTweet (tweetId, selected) {
                    Restangular
                        .one('api/topics', $scope.topicId)
                        .one('tweets', tweetId)
                        .get()
                        .then(
                            function (tweetData) {
                                var thisTweet = tweetData.data[0] || {id: tweetId, seleted: false};
                                thisTweet.selected = false;
                                return thisTweet
                                    .put()
                                    .then(
                                        function () {
                                            var counter = 0, item;
                                            for (item in $scope.tweets) {
                                                if ($scope.tweets[item].id === tweetId) {
                                                    $scope.tweets.splice(counter, 1);
                                                    break;
                                                }
                                                counter += 1;
                                            }
                                        }
                                    );
                            }
                        );
                }

                $scope.rmTweet = function rmTweet(tweetId) {
                    updateTweet(tweetId, false);
                };
            }
        ]
    );