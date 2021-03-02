angular.module('MyApp')
    .controller('LoginCtrl', function($scope, $location, $auth, toastr, fAccesos, geolocation, Account) {
        $scope.lat = 0;
        $scope.lng = 0;
        $scope.registro = {};
        geolocation.getLocation().then(function(data) {
            $scope.lat = data.coords.latitude;
            $scope.lng = data.coords.longitude;
        })
        $scope.login = function() {
            $auth.login($scope.user)
                .then(function() {
                    toastr.clear();
                    Account.getProfile()
                        .then(function(response) {
                            //console.log(response.data);
                            $scope.user = response.data;
                            $scope.registro.CodUsuario = $scope.user._id;
                            $scope.registro.NombreUsuario = $scope.user.nombres + ' ' + $scope.user.apellidos;
                            $scope.registro.fecha2 = Date.now();
                            $scope.registro.lat = $scope.lat;
                            $scope.registro.lng = $scope.lng;
                            fAccesos.add($scope.registro);
                        })
                    toastr.success('iniciaste sesión correctamente.');
                    $location.path('/dashboard/mytravels/upcoming');
                })
                .catch(function(response) {
                    toastr.clear();
                    toastr.error(response.data.message, response.status);

                });
        };
        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    toastr.clear();
                    toastr.success('Has iniciado sesión correctamente con' + provider);
                    $location.path('/dashboard/mytravels/upcoming');
                })
                .catch(function(response) {
                    toastr.clear();
                    toastr.error(response.data.message);

                });
        };
    });