/*global angular*/
/*global appName*/
/*global appEnv*/

angular
    .module(appName + "Config", [])
    .constant(
        'Config',
        {
            application: "minteressaApp",
            useMocks: false,
            authenticate: true,
            debug: true,

            view_dir: 'partials/',

            API: {
                protocol: 'http',
                host: '127.0.0.1:8080',
                path: '/api',
                fakeDelay: 500
            },

            loginState: 'authz.login',
            loggedInState: 'authz.panel',
            forbiddenState: 'authz.login'
        }
    ).config(
        [
            '$stateProvider',
            function config($stateProvider) {
                'use strict';

                $stateProvider.state(
                    'authz',
                    {
                        abstract: true,
                        views: {
                            '': {
                                template:  '<ui-view/>'
                            },
                            'authz.nav@': {
                                templateUrl: 'js/app/layouts/partials/toolbar.html',
                                controller: 'ToolbarController'
                            }
                        }
                    }
                );
            }
        ]
    ).config(
        [
            '$stateProvider',
            function config($stateProvider) {
                'use strict';

                $stateProvider.state(
                    'authz.panel',
                    {
                        parent: 'authz',
                        url: '^/',
                        views: {
                            '': {
                                templateUrl: 'js/app/layouts/partials/home.html',
                                controller: "TopicsHomeController"
                            },
                            'topic_config@authz.panel': {
                                controller: 'TopicsEditController',
                                templateUrl: 'js/app/topics/partials/edit.html'
                            },
                            'tweet_search@authz.panel': {
                                controller: 'TweetsSearchIndexController',
                                templateUrl: 'js/app/tweets/partials/searched.html'
                            },
                            'tweet_label_request@authz.panel': {
                                controller: 'TweetsSearchIndexController',
                                templateUrl: 'js/app/tweets/partials/index.html'
                            },
                            'tweet_saved@authz.panel': {
                                controller: 'TweetsSavedIndexController',
                                templateUrl: 'js/app/tweets/partials/index.html'
                            },
                            'tweet_view@authz.panel': {
                                templateUrl: 'js/app/tweets/partials/view.html'
                            }
                        }
                    }
                );
            }
        ]
    );
