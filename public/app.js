angular.module('MyApp', ['ngResource', 'ngMessages', 'ngAnimate','toastr', 'ui.router', 'satellizer', 'ui.bootstrap', 'zingchart-angularjs', 'geolocation', 'ngFileUpload', 'AngularGM', 'angularFileUpload','ngResource','angularUtils.directives.dirPagination'])


.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            controller: 'HomeCtrl',
            templateUrl: 'partials/home.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })

    .state('logout', {
            url: '/logout',
            template: null,
            controller: 'LogoutCtrl'
        })
        .state('stocks', {
            url: '/stocks',
            controller: 'CtrlStockProductos',
            templateUrl: 'partials/stockproducto.html'
        })
        .state('transferencias', {
            url: '/transferencias',
            controller: 'CtrlTransferencias',
            templateUrl: 'partials/transferencias.html'
        })
        .state('ventas', {
            url: '/ventas',
            controller: 'CtrlVentas',
            templateUrl: 'partials/venta.html'
        })
        .state('ventas.pagination',{
             url:'/dirPagination.tpl.html',
             views: {
                'pagination': {
                    templateUrl: 'partials/dirPagination.tpl.html'
                }
            }
        })
        .state('addventas',{
            url:'/addventas',
            controller:'CtrlAddVentas',
            templateUrl:'partials/addventa.html'
        })
        .state('reportes', {
            url: '/reportes',
            controller: 'CtrlReportes',
            templateUrl: 'partials/reportes.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl',
            abstract: true,
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('voto', {
            url: '/addvoto',
            templateUrl: 'partials/voto.html',
            controller: 'CtrlVoto',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('dashboard.signup', {
            url: '/signup',
            views: {
                'dashboardContent': {
                    templateUrl: 'partials/signup.html',
                    controller: 'SignupCtrl'
                }
            }
        })
        .state('dashboard.addpartidos',{
            url:'/addparditos',
            views: {
               'dashboardContent':{
                templateUrl:'partials/partido.html',
                controller:'CtrlPartido',
               } 
            }  
        })
        .state('dashboard.padron',{
            url:'/addpadron',
            views: {
                'dashboardContent':{
                    templateUrl:'partials/excel.html',
                    controller:'CtrlExcel',
                }
            }
        })
        .state('dashboard.sendmails',{
            url:'/sendmails',
            views: {
                'dashboardContent':{
                    templateUrl:'partials/sendmailx.html',
                    controller:'CtrlExcel',
                }
            }
        })
        .state('dashboard.voto',{
            url:'/addvoto',
            views: {
                'dashboardContent':{
                    templateUrl:'partials/voto.html',
                    controller:'CtrlVoto'
                }
            }
        })
        .state('dashboard.cliente', {
            url: '/cliente',
            views: {
                'dashboardContent': {
                    templateUrl: 'partials/Cliente.html',
                    controller: 'CtrlCliente'
                }
            }
        })
        .state('dashboard.proveedor', {
            url: '/proveedor',
            views: {
                'dashboardContent': {
                    templateUrl: 'partials/proveedor.html',
                    controller: 'CtrlProveedor'
                }
            }
        })
        .state('dashboard.producto', {
            url: '/producto',
            views: {
                'dashboardContent': {
                    templateUrl: 'partials/producto.html',
                    controller: 'CtrlProducto'
                }
            }
        })
        .state('dashboard.sucursal', {
            url: '/sucursal',
            views: {
                'dashboardContent': {
                    templateUrl: 'partials/sucursal.html',
                    controller: 'CtrlSucursal'
                }
            }
        })
        .state('dashboard.tipo', {
            url: '/tipo',
            views: {
                'dashboardContent': {
                    templateUrl: 'partials/tipos.html',
                    controller: 'CtrlTipo'
                }
            }
        })
        .state('dashboard.alta', {
            url: '/alta',
            views: {
                'dashboardContent': {
                    templateUrl: 'partials/alta.html',
                    controller: 'ctrlAlta'
                }
            }
        })
        .state('dashboard.accesos', {
            url: '/accesos',

            views: {
                'dashboardContent': {
                    templateUrl: 'partials/accesos.html',
                    controller: 'CtrlAccesos'
                }
            }
        })
        .state('dashboard.profile', {
            url: '/profile',

            views: {
                'dashboardContent': {
                    templateUrl: 'partials/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        })
        /*.state('dashboard.mytravels', {
          url: '/mytravels',

          views: {
            'dashboardContent': {
              templateUrl: 'partials/mytravels.html',
              controller: 'MyTravelCtrl'
            }
          }
        })
        .state('dashboard.mytravels.upcoming', {
          url: '/upcoming',
          templateUrl: 'partials/mytravels-upcoming.html'
        })

        // url will be /form/interests
        .state('dashboard.mytravels.past', {
          url: '/past',
          templateUrl: 'partials/mytravels-past.html'
        });*/

    $urlRouterProvider.otherwise('/');



    function skipIfLoggedIn($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }
})