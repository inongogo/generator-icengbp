(function(module) {
    'use strict';

    module.config(config);

    config.$inject = ['$stateProvider'];

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider.state('index', {
            url: '/',
            views: {
                'main': {
                    controller: '<%= projectName %>.app.index.IndexController as index'
                    //templateUrl: '/src/app/index/index.tpl.html'
                }
            },
            data: {pageTitle: 'Index'}
        });
    }

}(angular.module('<%= projectName %>.app.index', [
    'ui.router'
])));
