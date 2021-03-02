angular.module('MyApp')
.factory('fPartidos',function($http){
    var fPartidos={};
    fPartidos.partidos=[];
    fPartidos.partido={};
    fPartidos.getAll=function(){
        return $http.get('/partidos')
        .success(function(data){
            angular.copy(data,fPartidos.partidos);
        })
    }
    fPartidos.add=function(partido){
        return $http.post('/partido',partido)
        .success(function(){
           fPartidos.partidos.push(partido);
        })
    }
    fPartidos.update= function(partido){
        return $http.put('/partido/'+partido._id,partido)
        .success(function(data){
            var indice= fPartidos.partidos.indexOf(partido);
            fPartidos.partidos[indice]=data;
        })
    }
    fPartidos.delete= function(partido){
        return $http.delete('/partido/'+partido._id)
        .success(function(){
            var indice= fPartidos.partidos.indexOf(partido);
            fPartidos.partidos.splice(indice, 1);
        })
    }
    return fPartidos;
})

.controller('CtrlPartido',function($scope,$http,$state,fPartidos,toastr,FileUploader){
    
    $scope.uploader = new FileUploader();
    var uploadURL = '';
    $scope.mostrarImg = false;

    $scope.encabezado="";
    $scope.partido={};
    $scope.partidos=[];
    $scope.Loading = true;
    $scope.cabecera_partido = ['Nombre', 'Descripcion', 'Fecha', 'Editar', 'Eliminar'];
    $scope.addPartido= function(){
        $scope.partido.Integrantes=$scope.integrantes;
        fPartidos.add($scope.partido)
        .then(function(response) {
            $scope.Loading = true;
            toastr.clear();
            toastr.success('Partido agregado');
            $scope.listPartido();
            $scope.partido={};
            $scope.Loading = false;
        })
        .catch(function(response) {
            $scope.Loading = false;
            toastr.clear();
            //toastr.error(response.data.message, response.status);
            toastr.error(response.status, response.data.message);
        });
    }
    $scope.listPartido=function(){
        fPartidos.getAll()
        .then(function(response) {
            $scope.Loading = true;
            console.log(fPartidos.partidos);
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
    $scope.updPartido = function() {
        $scope.partido.Integrantes=$scope.integrantes;
        fPartidos.update($scope.partido)
            .then(function(response) {
                $scope.Loading = true;
                toastr.success('Partido Actualizado');
                $scope.Loading = false;
            })
            .catch(function(response) {
                $scope.Loading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };

    $scope.delPartido=function(partido){
        fPartidos.delete(partido)
            .then(function(response) {
                $scope.Loading = true;
                toastr.warning('Partido Eliminado');
                $scope.Loading = false;
            })
            .catch(function(response) {
                $scope.Loading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
        
    }
    function descargar(id) {
        $http.get('/descargar/' + id, { responseType: 'arraybuffer' })
            .success(function(data) {
                var arrayBufferView = new Uint8Array(data);
                var file = new Blob([arrayBufferView], { type: 'image/jpeg' });
                var urlCreator = window.URL || window.webkitUrl;
                var imageUrl = urlCreator.createObjectURL(file);
                //var img = document.querySelector("#photo");
                //img.src = imageUrl;
                $scope.imageen = imageUrl;
                //var fileURL = URL.createObjectURL(file);
                //$scope.imageen = $sce.trustAsResourceUrl(fileURL);
            })
    }

    //funciones para jalar datos
    $scope.actualizar = function(partido) {
        $scope.partido = partido;
        $scope.integrantes=partido.Integrantes;
        console.log($scope.partido);
        uploadURL = '/upload/' + partido._id;

            $scope.uploadOptions = {
                queueLimit: 1,
                autoUpload: true,
                url: uploadURL
            }
            if (partido.Fotos[0] != "") {
                $scope.mostrarImg = true;
                descargar(partido.Fotos[0]);
            } else {
                $scope.mostrarImg = true;
                $scope.imageen = null;
            }
        //$scope.tipo_persona.selectedOption = $scope.tipo_persona.availableOptions[cliente.tipo];
        //$scope.changeCliente();
        $scope.booladd = false;
        $scope.boolupd = true;
        $scope.encabezado = "Partido: " + $scope.partido.Nombre;
    };
    $scope.agregar = function() {
        $scope.encabezado = "Agregar Nuevo Partido";
        //$scope.tipo_persona.selectedOption = { id: '0', name: 'Natural' };
        $scope.partido = {};
        //$scope.changeCliente();
        $scope.boolupd = false;
        $scope.booladd = true;
    };

    $scope.addinicio = function() {
        toastr.clear();
        toastr.success('Ingrese el nro de dni del integrante, el sistema completara los campos, sea paciente gracias!');
        //$scope.tipo_persona.selectedOption = { id: '0', name: 'Natural' }
        //$scope.changeCliente();
        $scope.booladd = true;
        $scope.boolupd = false;
    }
    $scope.integrantes=[];
    $scope.integrante={};
    $scope.addIntegrante=function(integrante){
        $scope.integrantes.push(integrante);
        $scope.integrante={};
        toastr.success('integrante agregado');
    }
    $scope.dellIntegrante=function(integrante){
        var indice= $scope.integrantes.indexOf(integrante);
        $scope.integrantes.splice(indice,1);
        toastr.warning("integrante eliminado")
    }

    $('#addModal').click(function(e) {
        e.preventDefault();
        //addImage(5);
        //$('#addModal').modal('hide');
        $(this).tab('show')
            //return false;
    })


    //validacion de documento
    $scope.validate_pe_doc = function(doc_type, doc_number) {
        if (!doc_type || !doc_number) {
            toastr.warning("ingresar Nro de Ruc/Dni")
            return false;
        }
        if (doc_number.length == 8 && doc_type == '1') {
            toastr.success("Dni valido")
            return true;
        } else if (doc_number.length == 11 && doc_type == '6') {
            var vat = doc_number;
            var factor = '5432765432';
            var sum = 0;
            var dig_check = false;
            if (vat.length != 11) {
                toastr.warning("Ingrese un Ruc valido")
                return false;
            }
            try {
                parseInt(vat)
            } catch (err) {

                return false;
            }

            for (var i = 0; i < factor.length; i++) {
                sum += parseInt(factor[i]) * parseInt(vat[i]);
            }

            var subtraction = 11 - (sum % 11);
            if (subtraction == 10) {
                dig_check = 0;
            } else if (subtraction == 11) {
                dig_check = 1;
            } else {
                dig_check = subtraction;
            }

            if (parseInt(vat[10]) != dig_check) {
                toastr.warning("Ingrese un Ruc valido")
                return false;
            }
            toastr.success("Ruc valido")
            return true;
        } else {
            toastr.warning("Ruc/Dni no valido")
            return false;
        }
    }


    //get datos de persona
    $scope.personaa = function(dni) {
        if (dni != null) {
            var dnii = dni.toString();
            if (dnii.length == 8 && $scope.validate_pe_doc("1", dnii)) {
                $http.get('Dni/' + dni, dni).success(function(data) {
                    $scope.integrante.Nombre = data.name;
                    $scope.integrante.AP = data.paternal_surname;
                    $scope.integrante.AM = data.maternal_surname;
                })
            } else if (dnii.length == 0 || dnii.length < 8) {
                console.log("esperando")
            }
        }
    }


    $scope.subir = function() {
        if (!$scope.uploader.queue[0]) return;
        $scope.uploader.queue[0].upload();
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
            toastr.success('Imagen agregada');
            //$scope.productos = [];
            $scope.listProducto();
            toastr.success('data actualizada');
        };
    }

    $scope.setFile = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
                $scope.imageen = event.target.result
                $scope.$apply()

            }
            // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
    }

})
