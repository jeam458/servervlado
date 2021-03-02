angular.module('MyApp')
    .factory('fSucursales', function($http) {
        var fSucursal = {};
        fSucursal.sucursales = [];
        fSucursal.sucursal = {};

        fSucursal.getAll = function() {
            return $http.get('/sucursales')
                .success(function(data) {
                    angular.copy(data, fSucursal.sucursales)
                    return fSucursal.sucursales
                    console.log(fSucursal.sucursales);
                })
        }
        fSucursal.add = function(sucursal) {
            return $http.post('/sucursal', sucursal)
                .success(function(sucursal) {
                    fSucursal.sucursales.push(sucursal);
                })
        }
        fSucursal.update = function(sucursal) {
            return $http.put('/sucursal/' + sucursal._id, sucursal)
                .success(function(data) {
                    var indice = fSucursal.sucursales.indexOf(sucursal);
                    fSucursal.sucursales[indice] = data;
                })
        }
        fSucursal.delete = function(sucursal) {
            return $http.delete('/sucursal/' + sucursal._id)
                .success(function() {
                    var indice = fSucursal.sucursales.indexOf(sucursal);
                    fSucursal.sucursales.splice(indice, 1);
                })
        }
        return fSucursal;

    })
    .controller('CtrlSucursal', function($scope, $state, fSucursales, toastr) {
        $scope.encabezado = "";
        $scope.tipo_sucursal = {
            availableOptions: [
                { id: '0', name: 'Almacen' },
                { id: '1', name: 'Tienda' },
            ],
            selectedOption: { id: '0', name: 'Almacen' } //This sets the default value of the select in the ui
        };

        $scope.cabecera_sucursal = ['Nombre', 'Gerente', 'Dirección', 'Encargado', 'Tipo', 'Fecha', 'Editar', 'Eliminar'];
        $scope.sucursal = [];
        $scope.sucursal.tipo = $scope.tipo_sucursal.selectedOption.id;
        $scope.addSucursal = function() {
            $scope.sucursal.tipo = parseInt($scope.tipo_sucursal.selectedOption.id);
            fSucursales.add($scope.sucursal)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.clear();
                    toastr.success('Sucursal agregado');
                    $scope.isProfileLoading = false;
                })
                /*.finally(function() {
  
  
              })*/
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    //toastr.error(response.data.message, response.status);
                    toastr.error(response.status, response.data.message);
                });
        };
        $scope.listSucursal = function() {
            fSucursales.getAll()
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.sucursales = fSucursales.sucursales;
                    $scope.isProfileLoading = false;
                })
                .finally(function() {

                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        $scope.updSucursal = function() {
            fSucursales.update($scope.sucursal)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.success('Sucursal Actualizada');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        $scope.delSucursal = function(sucursal) {
            fSucursales.delete(sucursal)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.warning('Sucursal Eliminada');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        // funcionde angular
        $scope.actualizar = function(sucursal) {
            $scope.sucursal = sucursal;
            console.log($scope.sucursal);
            $scope.tipo_sucursal.selectedOption = $scope.tipo_sucursal.availableOptions[sucursal.tipo];
            $scope.changeSucursal();
            $scope.booladd = false;
            $scope.boolupd = true;
            $scope.encabezado = "Sucursal: " + $scope.sucursal.Nombre;
        };
        $scope.agregar = function() {
            $scope.encabezado = "Agregar Nueva Sucursal";
            $scope.tipo_sucursal.selectedOption = { id: '0', name: 'Almacen' };
            $scope.sucursal = {};
            $scope.changeSucursal();
            $scope.boolupd = false;
            $scope.booladd = true;
        };
        $scope.changeSucursal = function() {
            if ($scope.tipo_sucursal.selectedOption.id == 0) {
                $scope.fEmpresa = true;
                $scope.fPersona = false;
                $scope.fConRuc = false;
                //$scope.cliente.AP = "";
                //$scope.cliente.AM = "";
            } else if ($scope.tipo_sucursal.selectedOption.id == 1) {
                $scope.fEmpresa = false;
                $scope.fPersona = true;
                $scope.fConRuc = true;
                //$scope.cliente.AP = "";
                //$scope.cliente.AM = "";
            } else {
                $scope.fEmpresa = false;
                $scope.fPersona = true;
                $scope.fConRuc = false;
            }
        };

        $scope.listSucursal();


    });