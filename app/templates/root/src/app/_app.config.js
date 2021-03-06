(function() {
    'use strict';

    angular.module('<%= projectName %>')
        .config(toastrConfig)
        .config(configure);

    toastrConfig.$inject = ['toastr'];

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[iceCool Error] ' //Configure the exceptionHandler decorator
    };

    configure.$inject = ['$compileProvider', '$logProvider', '$urlRouterProvider', 'exceptionHandlerProvider'];

    /* @ngInject */
    function configure($compileProvider, $logProvider,
                       $urlRouterProvider, exceptionHandlerProvider) {
        $urlRouterProvider.otherwise('/home');

        $compileProvider.debugInfoEnabled(true);

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }

})();
