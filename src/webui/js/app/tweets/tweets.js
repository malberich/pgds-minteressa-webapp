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
    ]).constant(
        'SampleTweets',
        [
            {
                id: 1,
                text: "HelloWorld Tutorial with @cocos2d and #EziSocial Plugin available now. https://t.co/GlAAq2paTv http://t.co/1zKO6Jejbc",
                created_at: "2014-09-16T01:05:21.000Z",
                source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
                truncated: false,
                language: "en",
                mention: [
                {
                id: 44851095,
                name: "Cocos2D",
                screen_name: "cocos2d",
                start: 25,
                end: 33
                }
                ],
                retweet_count: 0,
                hashtag: [
                {
                text: "EziSocial",
                start: 38,
                end: 48
                }
                ],
                link: [
                {
                url: "https://t.co/GlAAq2paTv",
                display_url: "github.com/ezibyte/EziSoc…",
                expand_url: "https://github.com/ezibyte/EziSocial-3x-Silver-Bullet/wiki/3.1---HelloWorld",
                start: 71,
                end: 94
                }
                ],
                user: {
                id: 1347597842,
                name: "EziByte",
                screen_name: "ezibyte",
                location: "Noida",
                description: null,
                profile_image_url: "http://pbs.twimg.com/profile_images/496213187906113537/qSF0OGyK_normal.png",
                profile_image_url_https: "https://pbs.twimg.com/profile_images/496213187906113537/qSF0OGyK_normal.png"
                },
                tweetable: false,
                saved: false,
                relevant: false
            },
            {
                id: 2,
                text: "JavaScript: Five Lessons From JavaScript: The Good Parts - CodeProject http://t.co/n4xZHdovoh #javascript #html5",
                created_at: "2014-09-16T00:47:14.000Z",
                source: '<a href="https://dev.twitter.com/docs/tfw" rel="nofollow">Twitter for Websites</a>',
                truncated: false,
                language: "en",
                mention: [ ],
                retweet_count: 0,
                hashtag: [
                {
                text: "javascript",
                start: 94,
                end: 105
                },
                {
                text: "html5",
                start: 106,
                end: 112
                }
                ],
                link: [
                {
                url: "http://t.co/n4xZHdovoh",
                display_url: "codeproject.com/Articles/81872…",
                expand_url: "http://www.codeproject.com/Articles/818729/Five-Lessons-From-JavaScript-The-Good-Parts",
                start: 71,
                end: 93
                }
                ],
                user: {
                id: 18298021,
                name: "Jeffery Cosby",
                screen_name: "jcoz1968",
                location: "Oklahoma",
                description: "appdev, based in Oklahoma City",
                profile_image_url: "http://pbs.twimg.com/profile_images/1173545777/twitterPic_normal.jpg",
                profile_image_url_https: "https://pbs.twimg.com/profile_images/1173545777/twitterPic_normal.jpg"
                },
                tweetable: false,
                saved: false,
                relevant: false,
                },
                {
                text: "[tablesorter] https://t.co/rThARt1Q8V Mottie - Editable: Add editable_focus, editable_blur, and editable_selectAll options. See #708",
                created_at: "2014-09-16T00:45:51.000Z",
                source: '<a href="http://github.com" rel="nofollow">GitHub Service Hooks</a>',
                truncated: false,
                language: "en",
                mention: [ ],
                retweet_count: 0,
                hashtag: [ ],
                link: [
                {
                url: "https://t.co/rThARt1Q8V",
                display_url: "github.com/Mottie/tableso…",
                expand_url: "https://github.com/Mottie/tablesorter/commit/3a290109efdb79ba13a44715b19fc71b52d70c27",
                start: 14,
                end: 37
                }
                ],
                user: {
                id: 70888744,
                name: "Mot",
                screen_name: "WoWMottie",
                location: "",
                description: "When I get bored, I teach myself programming... this is the result",
                profile_image_url: "http://pbs.twimg.com/profile_images/571410791/SMRT_2_normal.jpg",
                profile_image_url_https: "https://pbs.twimg.com/profile_images/571410791/SMRT_2_normal.jpg"
                },
                tweetable: false,
                saved: false,
                relevant: false,
            },
            {
                id: 3,
                text: "[tablesorter] https://t.co/hNXiZuOYSY Mottie - Editable: Add editable_wrapContent option",
                created_at: "2014-09-16T00:45:51.000Z",
                source: '<a href="http://github.com" rel="nofollow">GitHub Service Hooks</a>',
                truncated: false,
                language: "fr",
                mention: [ ],
                retweet_count: 0,
                hashtag: [ ],
                link: [
                {
                url: "https://t.co/hNXiZuOYSY",
                display_url: "github.com/Mottie/tableso…",
                expand_url: "https://github.com/Mottie/tablesorter/commit/ebd2edb0407e6507bca66b75ae5d0f5f3cb23d4a",
                start: 14,
                end: 37
                }
                ],
                user: {
                id: 70888744,
                name: "Mot",
                screen_name: "WoWMottie",
                location: "",
                description: "When I get bored, I teach myself programming... this is the result",
                profile_image_url: "http://pbs.twimg.com/profile_images/571410791/SMRT_2_normal.jpg",
                profile_image_url_https: "https://pbs.twimg.com/profile_images/571410791/SMRT_2_normal.jpg"
                },
                tweetable: false,
                saved: false,
                relevant: false,
                },
                {
                text: "[tablesorter] https://t.co/6x8alOD0YF Mottie - Parser: Add duration parser & demo",
                created_at: "2014-09-16T00:45:59.000Z",
                source: '<a href="http://github.com" rel="nofollow">GitHub Service Hooks</a>',
                truncated: false,
                language: "fr",
                mention: [ ],
                retweet_count: 0,
                hashtag: [ ],
                link: [
                {
                url: "https://t.co/6x8alOD0YF",
                display_url: "github.com/Mottie/tableso…",
                expand_url: "https://github.com/Mottie/tablesorter/commit/33b3abe75afb512d015f0297ea41e30faa45cd86",
                start: 14,
                end: 37
                }
                ],
                user: {
                id: 70888744,
                name: "Mot",
                screen_name: "WoWMottie",
                location: "",
                description: "When I get bored, I teach myself programming... this is the result",
                profile_image_url: "http://pbs.twimg.com/profile_images/571410791/SMRT_2_normal.jpg",
                profile_image_url_https: "https://pbs.twimg.com/profile_images/571410791/SMRT_2_normal.jpg"
                },
                tweetable: false,
                saved: false,
                relevant: false
            }
        ]
    ).controller(
    'TopicTweetsIndexController',
    [
        '$scope', '$stateParams', 'Restangular', 'SampleTweets',
        function TopicTweetsIndexController($scope, $stateParams, Restangular, SampleTweets) {
            'use strict';
            $scope.saved = false;
            $scope.topicId = $stateParams.topicId;
            Restangular
                .one('api/topics', $stateParams.topicId)
                .getList(
                    'tweets',
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

            $scope.saveTweet = function rmTweet(tweetId) {
                updateTweet(tweetId, true);
            };


            $scope.sample_text = 'This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  ';
        }
    ]).controller(
    'TopicTweetsSearchIndexController',
    [
        '$scope', '$stateParams', 'Restangular', 'SampleTweets',
        function TopicTweetsSearchIndexController($scope, $stateParams, Restangular, SampleTweets) {
            'use strict';
            $scope.saved = false;
            Restangular
                .one('api/topics', $stateParams.topicId)
                .getList(
                    'tweets',
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

            function updateTweet (tweetId, selected) {
                Restangular
                    .one('api/topics', $stateParams.topicId)
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

            $scope.saveTweet = function rmTweet(tweetId) {
                updateTweet(tweetId, true);
            };


            $scope.sample_text = 'This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  This is a sample text from a scrapped page.  ';
        }
    ]).controller(
        'TopicSavedTweetsController',
        [
            '$scope', '$stateParams', 'Restangular', 'SampleTweets',
            function TopicTweetsIndexController($scope, $stateParams, Restangular, SampleTweets) {
                'use strict';
                $scope.saved = true;
                $scope.topicId = $stateParams.topicId;
                Restangular
                    .one('api/topics', $stateParams.topicId)
                    .getList(
                        'tweets',
                        {
                            reviewed: 200
                        }
                    ).then(
                        function (tweets) {
                            $scope.tweets = SampleTweets;
                        },
                        function (err) {

                        }
                    );

                function updateTweet (tweetId, selected) {
                    Restangular
                        .one('api/topics', $stateParams.topicId)
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