angular.module('MyApp')
    .controller('LogoutCtrl', function($scope, $location, $auth, toastr) {
        if (!$auth.isAuthenticated()) {
            return;
        }
        $auth.logout()
            .then(function() {

                toastr.clear();
                toastr.info('saliste de sesión');
                $location.path('/');
            });
    });