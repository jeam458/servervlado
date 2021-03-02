angular.module('MyApp')
    .factory('fAccesos', function($http) {
        var fAcceso = {};
        fAcceso.accesos = [];
        fAcceso.acceso = {};
        fAcceso.getAll = function() {
            return $http.get('/accesos')
                .success(function(data) {
                    angular.copy(data, fAcceso.accesos)
                    return fAcceso.accesos
                })
        }
        fAcceso.add = function(acceso) {
            return $http.post('acceso', acceso)
                .success(function(acceso) {
                    fAcceso.accesos.push(acceso);
                })
        }
        fAcceso.update = function(acceso) {
            return $http.post('acceso/' + acceso._id, acceso)
                .success(function(data) {
                    var indice = fAcceso.accesos.indexOf(acceso);
                    fAcceso.accesos[indice] = data;
                })
        }
        return fAcceso;
    })
    .controller('CtrlAccesos', function($scope, fAccesos, toastr, Account) {
        $scope.listaraccesos = function() {
            Account.getAll()
                .then(function(response) {
                    $scope.users = response.data;
                })
            fAccesos.getAll()
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    console.log(fAccesos.accesos);
                    $scope.accesos = fAccesos.accesos;
                    $scope.people = $scope.accesos;
                    $scope.isProfileLoading = false;
                })
        }
        $scope.listaraccesos();
        $scope.icons = {
            gray: '../placeholder1.png',
            red: '../placeholder.png',
        }
        $scope.options = {
            map: {
                center: new google.maps.LatLng(-13.53195, -71.967463),
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            },
            highlighted: {
                icon: $scope.icons.red
            },
            unhighlighted: {
                icon: $scope.icons.gray
            },
        };
        $scope.getMarkerOptions = function(person) {
            var opts = { title: person.NombreUsuario };
            if (person._id in $scope.filteredPeople) {
                return angular.extend(opts, $scope.options.highlighted);
            } else {
                return angular.extend(opts, $scope.options.unhighlighted);
            }
        };
        $scope.dispositivo = "";
        $scope.tipocomp = function(acceso) {
            if (acceso.lat == 0) {
                $scope.dispositivo = "Dispositivo movil";
            } else if (acceso.lat != 0) {
                $scope.dispositivo = "Computador";
            }
        }

        $scope.filters1 = {
            _id: null
        }
        $scope.filterPeople = function() {
            $scope.filteredPeople = {};
            angular.forEach($scope.people, function(person) {
                var nameMatch = ($scope.filters1._id) ? ~person.CodUsuario.indexOf($scope.filters1._id) : true;
                /*var isMale = person.gender === 'male';
                var genderMatch = ($scope.filters.male && isMale) ||
                                  ($scope.filters.female && !isMale);*/
                if (nameMatch) {
                    $scope.filteredPeople[person._id] = person;
                }
            });
            $scope.$broadcast('gmMarkersUpdate', 'people');
        };
        $scope.triggerOpenInfoWindow = function(etno) {
            $scope.markerEvents = [{
                event: 'openinfowindow',
                ids: [etno._id]
            }, ];
            $scope.tipocomp(etno);
        }
        $scope.$watch('people', function() {
            $scope.filterPeople();
        });
    })