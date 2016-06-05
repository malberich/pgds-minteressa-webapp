/*global angular */
/*global appName */

angular.module(
    'RestResources',
    [
        'restangular',
        appName + "Config",
        'angular-growl'
    ]
).factory(
    'MinterRest',
    [
        'Restangular', '$rootScope', 'Config', 'growl',
        function config(R, $rootScope, Config, growl) {
            'use strict';
            return R.withConfig(
                function (RestangularConfigurer) {
                    RestangularConfigurer.addResponseInterceptor(
                        function (
                            message,
                            operation,
                            what,
                            url,
                            response,
                            deferred
                        ) {
                            if (response.status >= 400) {
                                growl.error(message.meta.feedback);
                                deferred.reject();
                            } else {
                                if (message && message.meta && message.meta.feedback) {
                                    growl.success(message.meta.feedback);
                                }
                                if (operation.match(/custom?(post|put)/ig)) {
                                    $rootScope.$broadcast(
                                        "MinterRest::ResourceChange",
                                        {
                                            model: what,
                                            data: message.data
                                        }
                                    );
                                }
                            }
                            return message;
                        }
                    );

                    RestangularConfigurer.setBaseUrl(
                        Config.API.protocol + '://' +
                            Config.API.host +
                            (angular.isDefined(Config.API.port) && Config.API.port.trim()  ? ':' + Config.API.port : '')  +
                            Config.API.path + '/'
                    );
                }
            );
        }
    ]
);
