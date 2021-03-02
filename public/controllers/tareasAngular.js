angular.module('MyApp')

.factory('comun', function($http) {
    var comun = {};

    comun.tareas = [];

    comun.tarea = {};

    /***Sección de métodos remotos***/
    comun.getAll = function() {
        return $http.get('/tareas')
            .success(function(data) {
                angular.copy(data, comun.tareas)

                return comun.tareas
            })
    }

    comun.add = function(tarea) {
        return $http.post('/tarea', tarea)
            .success(function(tarea) {
                comun.tareas.push(tarea);
            })
    }

    comun.update = function(tarea) {
        return $http.put('/tarea/' + tarea._id, tarea)
            .success(function(data) {
                var indice = comun.tareas.indexOf(tarea);
                comun.tareas[indice] = data;
            })
    }

    comun.delete = function(tarea) {
        return $http.delete('/tarea/' + tarea._id)
            .success(function() {
                var indice = comun.tareas.indexOf(tarea);
                comun.tareas.splice(indice, 1);
            })
    }

    return comun;
})


.controller('ctrlAlta', function($scope, $state, comun) {
    $scope.showAddBtn = true;
    $scope.showUpdateBtn = true;


    $scope.openAddModal = function() {
        $scope.tarea = "";
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
    };

    $scope.tarea = {}
        // $scope.tareas = [];

    comun.getAll();

    $scope.tareas = comun.tareas;

    $scope.prioridades = ['Normal', 'Importante', 'Urgente'];

    $scope.agregar = function() {
        comun.add({
            nombre: $scope.tarea.nombre,
            prioridad: parseInt($scope.tarea.prioridad),
            responsable: $scope.tarea.responsable
        })
        $scope.tarea.nombre = '';
        $scope.tarea.prioridad = '';
        $scope.tarea.responsable = '';
        $('#addModal').modal('hide');
    }

    $scope.masPrioridad = function(tarea) {
        tarea.prioridad += 1;
    }

    $scope.menosPrioridad = function(tarea) {
        tarea.prioridad -= 1;
    }

    $scope.eliminar = function(tarea) {
        comun.delete(tarea);
    }

    $scope.procesaObjeto = function(tarea) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        comun.tarea = tarea;
        $scope.tarea = comun.tarea;

        //$state.go('dashboard.editar');
    }
    $scope.actualizar = function() {
        comun.update(comun.tarea);
        $('#addModal').modal('hide');
    }

    $scope.eliminar = function() {
        comun.delete(comun.tarea);
        $('#addModal').modal('hide');
    }

})