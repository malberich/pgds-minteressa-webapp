/*global angular */
/*global appName */
/*global appEnv */

var appModules = [
    'ui.router',
    'ui.bootstrap',
    'ngCookies',
    'angular-growl',
    'RestResources',
    'MinterSessionsModule',
    'MinterLayoutsModule',
    'MinterTopicsModule',
    'MinterTweetsModule',
    'MinterDocumentsModule',
    'truncate',
    'ngSanitize',
    'twitterFilters',
    appName + "Config"
];

if (appEnv.toLowerCase() === 'mock') {
    appModules.push(appName + "Mocks");
}

angular.module(
    appName,
    appModules
).config(
    function ($provide) {
        'use strict';
        $provide.factory(
            'httpPortalRequestsInterceptor',
            [
                '$q',
                '$injector',
                function ($q, $injector) {
                    return {
                        response: function (response) {
                            return response;
                        },
                        responseError: function (rejection) {
                            if (rejection.status === 401) {
                                $injector
                                    .get('MinterSessions')
                                    .removeUser()
                                    .removeSession();
                            }
                            return $q.reject(rejection);
                        }
                    };
                }
            ]
        );
    }
).config(
        [
            '$stateProvider',
            function config($stateProvider) {
                'use strict';

                $stateProvider.state(
                    'authz.login',
                    {
                        url: '^/login',
                        parent: 'authz',
                        views: {
                            '': {
                                templateUrl:  'js/app/users/partials/login.html'
                            }
                        }
                    }
                );

                $stateProvider.state(
                    'authz.forbidden',
                    {
                        url: '^/forbidden',
                        parent: 'authz',
                        views: {
                            '': {
                                templateUrl:  'js/app/users/partials/forbidden.html'
                            }
                        }
                    }
                );
            }
        ]
).config(
    [
        'growlProvider',
        function (growlProvider) {
            'use strict';
            growlProvider.globalPosition('bottom-right');
            growlProvider.globalTimeToLive(
                {
                    info: 3000,
                    success: 3000,
                    warning: 5000,
                    error: 7000
                }
            );
        }
    ]
).config(
    [
        '$httpProvider',
        'Config',
        function ($httpProvider, Config) {
            'use strict';
            $httpProvider.interceptors.push('httpSessionFinishedInterceptor');
            $httpProvider.interceptors.push('httpPortalRequestsInterceptor');
        }
    ]
).factory('APIBase', function (Config) {
    'use strict';
    return {
        api: (Config.API.protocol + '://' + Config.API.host + (angular.isDefined(Config.API.port) ? ':' + Config.API.port : '')  + Config.API.path + '/'),
        host: (Config.API.protocol + '://' + Config.API.host + (angular.isDefined(Config.API.port) ? ':' + Config.API.port : '')  + '/'),
        urlbase: Config.API.path + '/',
        host_noproto: (
            '//' + Config.API.host +
            (angular.isDefined(Config.API.port) ? ':' + Config.API.port : '') +
            Config.API.path + '/'
        )
    };
}).config(
    [
        '$urlRouterProvider', '$logProvider', 'Config',
        function config($urlRouterProvider, $logProvider, Config) {
            'use strict';

            if (Config.debug === true || appEnv.toLowerCase() === 'dev') {
                $logProvider.debugEnabled(true);
            } else {
                $logProvider.debugEnabled(false);
            }

            $urlRouterProvider.otherwise("/");
        }
    ]
).run(
    [
        '$rootScope',
        '$rootElement',
        '$state',
        '$log',
        'Config',
        'growl',
        'MinterSessions',
        function ($rootScope, $rootElement, $state, $log, Config, growl, MinterSessions) {
            'use strict';

            $rootScope.$state        = $state;
            $rootScope.ngApp         = $rootElement.attr('ng-app');
            $rootScope.toState       = null;
            $rootScope.toStateParams = null;
            $rootScope.returnToState = null;
            $rootScope.returnToStateParams = null;

            $rootScope.notifications = [];

            $rootScope.Sessions = MinterSessions;

            if (Config.authenticate === true) {

                $rootScope.$on(
                    '$stateChangeStart',
                    function (ev, toState, toStateParams) {
                        $log.debug("State from", $state.current);
                        $log.debug("State to", toState);
                        if (toState.abstract !== true) {
                            $rootScope.toState = toState;
                            $rootScope.toStateParams = toStateParams;
                        }
                        if (toState.name === $rootScope.Sessions.loginState) {
                            // if (!$rootScope.Sessions.checkSession()) {
                                $log.debug("Loading login page");
                            // } else {
                                // $state.go(Config.loggedInState);
                            // }
                        } else {
                            $log.debug(
                                "$stateChangeStart Saving non-abstract toState",
                                toState
                            );

                            if ($rootScope.Sessions.preloaded) {
                                if (!$rootScope.Sessions.checkSession()) {
                                    $log.debug("User not authenticated, redirecting to login page");
                                    ev.preventDefault();
                                    $rootScope.Sessions.redirectLogin();
                                }
                            } else {
                                $rootScope
                                    .Sessions
                                    .preloadSession()
                                    .then(
                                        function (session) {
                                            $log.debug("$stateChangeStart session", session)
                                            if (
                                                session === null ||
                                                angular.isUndefined(session) ||
                                                !angular.isObject(session)
                                            ) {
                                                $log.debug("Session precheck: user not authenticated, redirecting to login page");
                                                $rootScope.Sessions.redirect403();
                                            } else if (!$rootScope.Sessions.getUser()) {
                                                $log.debug("Session precheck: user data seems empty", $rootScope.Sessions.getUser());
                                                $rootScope.Sessions.logout();
                                            }
                                        },
                                        function () {
                                            $log.debug("Session not found");
                                            $rootScope.Sessions.redirectLogin();
                                        }
                                    );
                            }
                        }
                    }
                );
                // $rootScope
                //     .Sessions
                //     .preloadSession()
                //     .then(
                //         function (session) {
                //             if (
                //                 session === null ||
                //                 angular.isUndefined(session) ||
                //                 !angular.isObject(session)
                //             ) {
                //                 $log.debug("Session precheck: user not authenticated, redirecting to login page");
                //                 $rootScope.Sessions.redirect403();
                //             } else if (!MinterSessions.getUser().length) {
                //                 $rootScope.Sessions.logout();
                //             }
                //         },
                //         function () {
                //             $log.debug("Session not found");
                //             $rootScope.Sessions.redirectLogin();
                //         }
                //     );
            }
            growl.info("Application loaded");
        }
    ]
);
