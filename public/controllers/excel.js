angular.module('MyApp')
.factory('fRegistroE',function($http,$auth,toastr){
    var fRegistroE={};
    fRegistroE.electores=[];
    fRegistroE.elector={};
    fRegistroE.getAll = function() {
        return $http.get('/electores')
            .success(function(data) {
                angular.copy(data, fRegistroE.electores)
                return fRegistroE.electores;
            })
    }
    fRegistroE.add=function(elector,user){
      return $auth.signup(user)
      .then(function(){
         $http.post('/elector',elector)
        .success(function(data){
            toastr.clear();
            toastr.success('Elector registrado correctamente');
            //fRegistroE.Electores.push(data) 
        })
      })
      .catch(function (response) {
        toastr.clear();
        toastr.error(response.data.message);
    });
    }
    fRegistroE.sendmails=function(electores){
        return $http.post('/envcorreos',electores)
        .success(function(data){
            toastr.clear();
            toastr.success('correos enviados');
        })
    }
    fRegistroE.delete = function(elector) {
        return $http.delete('/elector/' + elector._id)
            .success(function() {
                var indice = fRegistroE.electores.indexOf(elector);
                fRegistroE.electores.splice(indice, 1);
            })
    }
     return fRegistroE;
})
.controller('CtrlExcel',function($scope,$state,$window,toastr, fRegistroE){
    $scope.user={};
    $scope.elector={};
    $scope.SelectFile = function (file) {
        $scope.SelectedFile = file;
        if(file!=null || file!=undefined){
            $scope.LeerExcel();
        } else {
            toastr.clear();
            toastr.warning("Seleccione una archivo porfavor");
        }
        
    };
    $scope.LeerExcel = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (regex.test($scope.SelectedFile.name.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        $scope.ProcessExcel(e.target.result);
                    };
                    reader.readAsBinaryString($scope.SelectedFile);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        $scope.ProcessExcel(data);
                    };
                    reader.readAsArrayBuffer($scope.SelectedFile);
                }
            } else {
                toastr.warning('This browser does not support HTML5.')
                $window.alert("This browser does not support HTML5.");
            }
        } else {
            toastr.warning('porfavor, seleccione un archiivo valido!');
            $window.alert("porfavor, seleccione un archiivo valido!");
        }
    };

    $scope.ProcessExcel = function (data) {
        toastr.success('leyendo libro Excel')
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];
        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
        //Display the data from Excel file in Table.
        $scope.$apply(function () {
            $scope.Electores = excelRows;
            $scope.IsVisible = true;
            //console.log($scope.Electores)
        });
    };

    $scope.enviarcorreos=function(){
        //console.log($scope.Electores)
        fRegistroE.sendmails($scope.Electores).then(function(response){
            
        })
    }

    $scope.Upload=function(){
        for(var i=0; i<$scope.Electores.length;i++){
            $scope.user.nombres=$scope.Electores[i].NOMBRES;
            $scope.user.dni=$scope.Electores[i].DNI;
            $scope.user.email=$scope.Electores[i].CORREO;
            $scope.user.tipo='Elector';
            $scope.user.password=$scope.Electores[i].DNI;
            $scope.elector.Dni=$scope.Electores[i].DNI;
            //$scope.elector.Escalafon=$scope.Electores[i].ESCALAFON;
            $scope.elector.Nombre=$scope.Electores[i].NOMBRES;
            $scope.elector.DFuncional=$scope.Electores[i].CARGO;
            $scope.elector.Correo=$scope.Electores[i].CORREO;
            fRegistroE.add($scope.elector,$scope.user)
            .then(function(response){
            })
            $scope.user={};
            $scope.elector={};
        }
    }

})