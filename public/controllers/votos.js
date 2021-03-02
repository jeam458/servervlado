angular.module('MyApp')
.factory('fVotos',function($http){
    var fVotos={};
    fVotos.votos=[];
    fVotos.voto={};
    fVotos.getAll=function(){
        return $http.get('/votos')
        .success(function(data){
            angular.copy(data,fvotos.votos);
        })
    }
    fVotos.add= function(voto){
        return $http.post('/voto',voto)
        .success(function(voto){
            fVotos.votos.push(voto);
        })
    }
    fVotos.delete=function(voto){
        return $http.delete('/voto/'+voto._id)
        .success(function(){
            var indice = fVotos.votos.indexOf(voto);
            fVotos.votos.splice(indice,1);
        })
    }
    
    return fVotos;
})
.controller('CtrlVoto',function($scope,fVotos,toastr,fPartidos,Account,$location){
    $scope.encabezado="";
    $scope.voto={};
    $scope.partidos=[];
    $scope.listPartido=function(){
        Account.getProfile()
                .then(function(response) {
                    $scope.user = response.data;
                    $scope.voto.IdVotante = $scope.user._id;
                })
        fPartidos.getAll()
        .then(function(response) {
            $scope.Loading = true;
            //console.log(fPartidos.partidos);
            $scope.partidos = fPartidos.partidos;
            $scope.Loading = false;
        })
        .finally(function() {

        })
        .catch(function(response) {
            $scope.Loading = false;
            toastr.clear();
            toastr.error(response.data.message, response.status);
        });
    }
    $scope.listPartido();
    $scope.mostrarInfo = function(partido) {
        $scope.partido = partido;
        $scope.integrantes=partido.Integrantes;
        $scope.booladd = false;
        $scope.boolupd = true;
        $scope.encabezado = "Partido: " + $scope.partido.Nombre;
    };
    $scope.verificarVoto = function(partido) {
        $scope.partido = partido;
        $scope.voto.eleccion = partido._id;
        $scope.booladd = false;
        $scope.boolupd = true;
        $scope.encabezado = "Elegiste a: " + $scope.partido.Nombre;
    };
    $scope.addVoto= function(){
        fVotos.add($scope.voto)
        .then(function(response){
            $scope.Loading=true;
            toastr.clear();
            toastr.success('voto registrado, muchas gracias!');
            $scope.Loading = false;
            $location.path("/logout");
        })
        .catch(function(response) {
            $scope.Loading = false;
            toastr.clear();
            //toastr.error(response.data.message, response.status);
            toastr.error(response.status, response.data.message);
        });
    }
    /*$scope.listVotos = function() {
        fVotos.getAll()
            .then(function(response) {
                $scope.Loading = true;
                $scope.votos = fVotos.votos;
                $scope.Loading = false;
            })
            .finally(function() {

            })
            .catch(function(response) {
                $scope.Loading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };
    $scope.delVoto=function(voto){
        console.log(voto);
        fVotos.delete(voto)
            .then(function(response) {
                $scope.Loading = true;
                toastr.warning('Voto Eliminado');
                $scope.Loading = false;
            })
            .catch(function(response) {
                $scope.Loading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    }*/
})

