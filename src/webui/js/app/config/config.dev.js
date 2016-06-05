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
                    'authz.panel',
                    {
                        parent: 'authz',
                        url: '^/',
                        views: {
                            '': {
                                templateUrl: 'js/app/layouts/partials/home.html'
                            },
                            'edit@authz.panel': {
                                controller: 'TopicsEditController',
                                templateUrl: 'js/app/topics/partials/edit.html'
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
                            },
                            'authz.topics@': {
                                templateUrl: 'js/app/topics/partials/sidebar.html',
                                controller: 'TopicsIndexController'
                            }
                        }
                    }
                );
            }
        ]
    );
