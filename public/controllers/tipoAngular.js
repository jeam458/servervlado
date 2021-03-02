angular.module('MyApp')
    .factory('tipocomun', function($http) {
        var tipocomun = {};
        tipocomun.tipos = [];
        tipocomun.tipo = {};

        tipocomun.getAll = function() {
            return $http.get('/tipos')
                .success(function(data) {
                    angular.copy(data, tipocomun.tipos)
                    return tipocomun.tipos
                        //console.log(tipocomun.tipos);
                })
        }
        tipocomun.add = function(tipo) {
            return $http.post('/tipo', tipo)
                .success(function(tipo) {
                    tipocomun.tipos.push(tipo);
                })
        }
        tipocomun.update = function(tipo) {
            return $http.put('/tipo/' + tipo._id, tipo)
                .success(function(data) {
                    var indice = tipocomun.tipos.indexOf(tipo);
                    tipocomun.tipos[indice] = data;
                })
        }
        tipocomun.delete = function(tipo) {
            return $http.delete('/tipo/' + tipo._id)
                .success(function() {
                    var indice = tipocomun.tipos.indexOf(tipo);
                    tipocomun.tipos.splice(indice, 1);
                })
        }
        return tipocomun;

    })
    .controller('CtrlTipo', function($scope, $state, tipocomun) {
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = true;
        $scope.openAddModal = function() {
            $scope.tipo = "";
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
        }
        $scope.tipo = {};
        tipocomun.getAll();
        $scope.tipos = tipocomun.tipos;
        $scope.agregar = function() {
            tipocomun.add({
                nombre: $scope.tipo.nombre,
                descripcion: $scope.tipo.descripcion
            })
            $scope.tipo.nombre = "";
            $scope.tipo.descripcion = "";
            $('#addModal').modal('hide');
        }
        $scope.eliminar = function(tipo) {
            tipocomun.delete(tipo);
        }
        $scope.procesaObjeto = function(tipo) {
            $scope.showAddBtn = false;
            $scope.showUpdateBtn = true;
            tipocomun.tipo = tipo;
            $scope.tipo = tipocomun.tipo;
        }
        $scope.actualizar = function() {
            tipocomun.update(tipocomun.tipo);
            $('#addModal').modal('hide');
        }

    })