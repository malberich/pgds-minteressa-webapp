angular.module(
        'MinterSessionsModule',
        [
            'RestResources',
            appName + 'Config'
        ]
    ).factory(
        'sessionStorage',
        [
            '$window', 'Config',
            function ($window, Config) {
                'use strict';
                var self,
                    service = {
                        emptySession: function () {
                            self.removeSession()
                                .removeUser();
                        },
                        removeSession: function () {
                            self.removeData(Config.application + '.session');
                            return self;
                        },
                        removeUser: function () {
                            self.removeData(Config.application + '.user');
                            return self;
                        },
                        setSession: function (sessionData, userData) {
                            self.setData(Config.application + '.session', sessionData);
                            self.setData(Config.application + '.user', userData);
                            return self;
                        },

                        getSession: function () {
                            return self.getData(Config.application + '.session');
                        },
                        getUser: function () {
                            return self.getData(Config.application + '.user');
                        },

                        setData: function (attribute, value) {
                            if (!angular.isString(value)) {
                                value = JSON.stringify(value);
                            }
                            try {
                                $window.sessionStorage.setItem(attribute, value);
                                return self.getData(attribute);
                            } catch (e) {
                                return null;
                            }
                        },

                        getData: function (attribute) {
                            try {
                                return JSON.parse($window.sessionStorage.getItem(attribute));
                            } catch (e) {
                                try {
                                    return $window.sessionStorage.getItem(attribute);
                                } catch (e2) {
                                    return null;
                                }
                            }
                        },

                        removeData: function (attribute) {
                            try {
                                $window.sessionStorage.removeItem(attribute);
                                return true;
                            } catch (e) {
                                return false;
                            }
                        }
                    };
                self = service;

                return service;
            }
        ]
    ).factory(
        'MinterSessions',
        [
            '$rootScope',
            '$q',
            'MinterRest',
            'Config',
            '$state',
            '$log',
            'sessionStorage',
            'growl',
            function ($rootScope, $q, Restangular, Config, $state, $log, sessionStorage, growl) {
                'use strict';
                var currentService = Restangular.service('sessions'),
                    sessObject;

                currentService.route = 'sessions';

                currentService.preloaded = false;

                currentService.forbiddenState = Config.forbiddenState;
                currentService.loggedInState  = Config.loggedInState;
                currentService.loginState     = Config.loginState;

                currentService.isAuthorized = function isAuthorized () {
                    return currentService.checkSession();
                };

                currentService.isAuthenticated = function isAuthenticated () {
                    return currentService.checkSession();
                };

                currentService.getUser = sessionStorage.getUser;
                currentService.getSesison = sessionStorage.getSession;

                currentService.login = function login(uname, pwd) {
                    currentService
                        .post({username: uname, password: pwd})
                        .then(
                            function (data) {
                                sessionStorage.setSession(data, data.passport.user);
                                $rootScope.$broadcast('session.login');
                            },
                            function (err) {
                                currentService.logout();
                                growl.error(err);
                            }
                        );
                };

                currentService.logout = function logout() {
                    currentService.removeSession();
                    $rootScope.$broadcast('session.logout');
                };

                currentService.checkSession = function checkSession() {
                    sessObject = sessionStorage.getSession();
                    if (angular.isObject(sessObject)) {
                        return true;
                    } else {
                        return false;
                    }
                };

                currentService.preloadSession = function preloadSession() {
                    var deferred = $q.defer();
                    sessObject = sessionStorage.getSession();
                    if (angular.isObject(sessObject)) {
                        deferred.resolve(sessObject);
                    } else {
                        return currentService
                            .getList()
                            .then(
                                function (session) {
                                    $rootScope.Sessions.preloaded = true;
                                    $log.debug(JSON.stringify(session[0]));
                                    sessionStorage.setSession(
                                        session[0],
                                        (session[0].passport || {user: ""}).user
                                    );
                                    return deferred.resolve(sessionStorage.getSession());
                                },
                                function (err) {
                                    $rootScope.Sessions.preloaded = true;
                                    return deferred.reject(null);
                                }
                            );
                    }
                    return deferred.promise;
                };

                currentService.redirectLogin = function redirectLogin() {
                    $state.go(currentService.loginState);
                };

                currentService.redirect403 = function redirect403() {
                    $state.go(currentService.forbiddenState);
                };

                currentService.removeSession = function removeSession() {
                    sessObject = sessionStorage.getSession();
                    sessionStorage
                        .removeUser()
                        .removeSession();
                    currentService.preloaded = false;
                    if (sessObject) {
                        var currentUser = sessionStorage.getUser()
                        return currentService
                            .one(currentUser)
                            .remove(
                                function () {
                                    $state.go(currentService.loginState);
                                },
                                function (err) {
                                    growl.error(err);
                                }
                            );
                    }
                };

                if (Config.authenticate === true) {
                    $rootScope.$on(
                        'session.login',
                        function () {
                            $state.go($rootScope.Sessions.loggedInState);
                            growl.success("You have successfully logged in");
                        }
                    );

                    $rootScope.$on(
                        'session.logout',
                        function () {
                            $log.debug("redirecting to", $rootScope.Sessions.loginState);
                            $state.go($rootScope.Sessions.loginState);
                            growl.warning("You have successfully logged out");
                        }
                    );

                    $rootScope.$on(
                        'session.unauthorized',
                        function (ev, params) {
                            $rootScope.Sessions.redirect403();
                            // $state.go($rootScope.Sessions.forbiddenState);
                            growl.warning(
                                "You are not authorized to access to such resource. " +
                                    (!params.authenticated ? 'Please, log in if necessary' : ''),
                                {ttl: 3000}
                            );
                        }
                    );
                }

                return currentService;
            }
        ]
    ).config(
        function ($provide) {
            'use strict';
            $provide.factory(
                'httpSessionFinishedInterceptor',
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
    );