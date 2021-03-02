angular.module('MyApp')
    .factory('fProveedores', function($http) {
        var fProveedores = {};
        fProveedores.proveedores = [];
        fProveedores.proveedor = {};
        /*** Servicio de mongo ***/
        fProveedores.getAll = function() {
            return $http.get('/proveedores')
                .success(function(data) {
                    angular.copy(data, fProveedores.proveedores)
                    return fProveedores.proveedores;
                })
        }

        fProveedores.add = function(proveedor) {
            return $http.post('/proveedor', proveedor)
                .success(function(proveedor) {
                    fProveedores.proveedores.push(proveedor);
                })
        }

        fProveedores.update = function(proveedor) {
            return $http.put('proveedor/' + proveedor._id, proveedor)
                .success(function(data) {
                    var indice = fProveedores.proveedores.indexOf(proveedor);
                    fProveedores.proveedor[indice] = data;
                })
        }

        fProveedores.delete = function(proveedor) {
            return $http.delete('/proveedor/' + proveedor._id)
                .success(function() {
                    var indice = fProveedores.proveedores.indexOf(proveedor);
                    fProveedores.proveedores.splice(indice, 1);
                })
        }

        return fProveedores;
    })

.controller('CtrlProveedor', function($scope, $state, fProveedores, toastr) {
    $scope.encabezado = "";
    $scope.tipo_persona = {
        availableOptions: [
            { id: '0', name: 'Natural' },
            { id: '1', name: 'Jurídica' },
            { id: '2', name: 'Natural con RUC' }
        ],
        selectedOption: { id: '0', name: 'Natural' } //This sets the default value of the select in the ui
    };
    $scope.estado_persona = {
        availableOptions: [
            { id: '0', name: 'Activo' },
            { id: '1', name: 'Inactivo' }
        ],
        selectedOption: { id: '0', name: 'Activo' }
    }
    $scope.cabecera_proveedor = ['RUC/DNI', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Tipo', 'Estado', 'Fecha', 'Editar', 'Eliminar'];
    $scope.proveedor = [];
    $scope.proveedor.tipo = $scope.tipo_persona.selectedOption.id;
    $scope.proveedor.Estado = $scope.estado_persona.selectedOption.id;
    $scope.addProveedor = function() {
        $scope.proveedor.tipo = parseInt($scope.tipo_persona.selectedOption.id);
        $scope.proveedor.Estado = parseInt($scope.estado_persona.selectedOption.id);
        fProveedores.add($scope.proveedor)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.clear();
                toastr.success('Proveedor agregado');
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
    $scope.listProveedor = function() {
        fProveedores.getAll()
            .then(function(response) {
                $scope.isProfileLoading = true;
                $scope.proveedores = fProveedores.proveedores;
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
    $scope.updProveedor = function() {
        $scope.proveedor.tipo = parseInt($scope.tipo_persona.selectedOption.id);
        $scope.proveedor.Estado = parseInt($scope.estado_persona.selectedOption.id);
        fProveedores.update($scope.proveedor)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.success('Proveedor Actualizado');
                $scope.isProfileLoading = false;
            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };
    $scope.delProveedor = function(proveedor) {
        fProveedores.delete(proveedor)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.warning('Proveedor Eliminado');
                $scope.isProfileLoading = false;
            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };
    // funcionde angular
    $scope.actualizar = function(proveedor) {
        $scope.proveedor = proveedor;
        console.log($scope.proveedor);
        $scope.tipo_persona.selectedOption = $scope.tipo_persona.availableOptions[proveedor.tipo];
        $scope.estado_persona.selectedOption = $scope.estado_persona.availableOptions[proveedor.Estado];
        $scope.changeProveedor();
        $scope.booladd = false;
        $scope.boolupd = true;
        $scope.encabezado = "Proveedor: " + $scope.proveedor.Nombre;
    };
    $scope.agregar = function() {
        $scope.tipo_persona.selectedOption = { id: '0', name: 'Natural' };
        $scope.estado_persona.selectedOption = { id: '0', name: 'Activo' };
        $scope.proveedor = {};
        $scope.changeProveedor();
        $scope.boolupd = false;
        $scope.booladd = true;
        $scope.encabezado = "Agregar Nuevo Proveedor";
    };
    $scope.changeProveedor = function() {
        if ($scope.tipo_persona.selectedOption.id == 1) {
            $scope.fEmpresa = true;
            $scope.fPersona = false;
            $scope.fConRuc = false;
            $scope.proveedor.AP = "";
            $scope.proveedor.AM = "";
        } else if ($scope.tipo_persona.selectedOption.id == 2) {
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

    $scope.listProveedor();


});