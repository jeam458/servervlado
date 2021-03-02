angular.module('MyApp')
    .factory('fClientes', function($http) {
        var fClientes = {};
        fClientes.clientes = [];
        fClientes.cliente = {};
        /*** Servicio de mongo ***/
        fClientes.getAll = function() {
            return $http.get('/clientes')
                .success(function(data) {
                    angular.copy(data, fClientes.clientes)
                    return fClientes.clientes;
                })
        }

        fClientes.add = function(cliente) {
            return $http.post('/cliente', cliente)
                .success(function(cliente) {
                    fClientes.clientes.push(cliente);
                })
        }

        fClientes.update = function(cliente) {
            return $http.put('cliente/' + cliente._id, cliente)
                .success(function(data) {
                    var indice = fClientes.clientes.indexOf(cliente);
                    fClientes.clientes[indice] = data;
                })
        }

        fClientes.delete = function(cliente) {
            return $http.delete('/cliente/' + cliente._id)
                .success(function() {
                    var indice = fClientes.clientes.indexOf(cliente);
                    fClientes.clientes.splice(indice, 1);
                })
        }

        return fClientes;
    })

.controller('CtrlCliente', function($scope, $state, fClientes, toastr) {
    $scope.encabezado = "";
    $scope.tipo_persona = {
        availableOptions: [
            { id: '0', name: 'Natural' },
            { id: '1', name: 'Jurídica' },
            { id: '2', name: 'Natural con RUC' }
        ],
        selectedOption: { id: '0', name: 'Natural' } //This sets the default value of the select in the ui
    };


    $scope.cabecera_cliente = ['RUC/DNI', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Tipo', 'Fecha', 'Editar', 'Eliminar'];
    $scope.cliente = [];
    $scope.cliente.tipo = $scope.tipo_persona.selectedOption.id;
    $scope.addCliente = function() {
        $scope.cliente.tipo = parseInt($scope.tipo_persona.selectedOption.id);
        console.log($scope.cliente);
        fClientes.add($scope.cliente)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.clear();
                toastr.success('Cliente agregado');
                $scope.isProfileLoading = false;
            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                //toastr.error(response.data.message, response.status);
                toastr.error(response.status, response.data.message);
            });
    };
    $scope.listCliente = function() {
        fClientes.getAll()
            .then(function(response) {
                $scope.isProfileLoading = true;
                $scope.clientes = fClientes.clientes;
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
    $scope.updCliente = function() {
        fClientes.update($scope.cliente)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.success('Cliente Actualizado');
                $scope.isProfileLoading = false;
            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };
    $scope.delCliente = function(cliente) {
        console.log(cliente);
        fClientes.delete(cliente)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.warning('Cliente Eliminado');
                $scope.isProfileLoading = false;
            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };
    // funcionde angular
    $scope.actualizar = function(cliente) {
        $scope.cliente = cliente;
        console.log($scope.cliente);
        $scope.tipo_persona.selectedOption = $scope.tipo_persona.availableOptions[cliente.tipo];
        $scope.changeCliente();
        $scope.booladd = false;
        $scope.boolupd = true;
        $scope.encabezado = "Cliente: " + $scope.cliente.Nombre;
    };
    $scope.agregar = function() {
        $scope.encabezado = "Agregar Nuevo Cliente";
        $scope.tipo_persona.selectedOption = { id: '0', name: 'Natural' };
        $scope.cliente = {};
        $scope.changeCliente();
        $scope.boolupd = false;
        $scope.booladd = true;
    };
    $scope.changeCliente = function() {
        if ($scope.tipo_persona.selectedOption.id == 1) {
            $scope.fEmpresa = true;
            $scope.fPersona = false;
            $scope.fConRuc = false;
            $scope.cliente.AP = "";
            $scope.cliente.AM = "";
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

    $scope.listCliente();


});