angular.module('MyApp')
    .factory('fProductos', function($http) {
        var fProducto = {};
        fProducto.productos = [];
        fProducto.producto = {};

        fProducto.getAll = function() {
            return $http.get('/productos')
                .success(function(data) {
                    angular.copy(data, fProducto.productos)
                    return fProducto.productos
                    console.log(fProducto.productos);
                })
        }
        fProducto.add = function(producto) {
            return $http.post('/producto', producto)
                .success(function(producto) {
                    fProducto.productos.push(producto);
                })
        }
        fProducto.update = function(producto) {
            return $http.put('/producto/' + producto._id, producto)
                .success(function(data) {
                    var indice = fProducto.productos.indexOf(producto);
                    fProducto.productos[indice] = data;
                })
        }

        fProducto.delete = function(producto) {
            return $http.delete('/producto/' + producto._id)
                .success(function() {
                    var indice = fProducto.productos.indexOf(producto);
                    fProducto.productos.splice(indice, 1);
                })
        }
        return fProducto;
    })
    .controller('CtrlProducto', function($http, $scope, $state, fProductos, tipocomun, fProveedores, fSucursales, toastr, FileUploader) {
        $scope.uploader = new FileUploader();
        var uploadURL = '';
        $scope.mostrarImg = false;

        $scope.Descripciones = [];
        $scope.Descripcion = { Caracteristica: '', Descripcion: '' };
        $scope.encabezado = "";

        $scope.tipo_producto = {
            availableOptions: tipocomun.tipos,
            selectedOption: ''
        }
        $scope.tipo_estado = {
            availableOptions: [
                { id: '0', name: 'Activo' },
                { id: '1', name: 'Inactivo' },
            ],
            selectedOption: { id: '0', name: 'Activo' } //This sets the default value of the select in the ui
        };

        $scope.cabecera_producto = ['Nombre', 'U. medida', 'P. Compra', 'P. Venta', 'Estado', 'Fecha', 'Editar', 'Eliminar'];
        $scope.producto = [];
        $scope.producto.tipo = $scope.tipo_producto.selectedOption;
        $scope.producto.Estado = $scope.tipo_estado.selectedOption;
        //$scope.producto.tipo = { _id: '0', nombre: 'Seleccione Categoria' };
        $scope.addProducto = function() {
            $scope.producto.Estado = parseInt($scope.tipo_estado.selectedOption.id);
            $scope.producto.Descripcion = $scope.Descripciones;
            $scope.imagen = "";
            console.log($scope.producto);
            fProductos.add($scope.producto)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.clear();
                    toastr.success('Producto agregado');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    //toastr.error(response.data.message, response.status);
                    toastr.error(response.status, response.data.message);
                });
        };
        $scope.listProducto = function() {
            tipocomun.getAll();
            console.log(tipocomun.tipos);
            //fProveedores.getAll();
            //console.log(fProveedores.proveedores);
            //fSucursales.getAll();
            //console.log(fSucursales.sucursales);
            fProductos.getAll()
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.productos = fProductos.productos;
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
        $scope.updProducto = function() {
            $scope.producto.Estado = parseInt($scope.tipo_estado.selectedOption.id);
            $scope.producto.Descripcion = $scope.Descripciones;
            fProductos.update($scope.producto)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.success('Producto Actualizado');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        $scope.delProducto = function(producto) {
            fProductos.delete(producto)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.warning('Producto Eliminado');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };

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
        // funcionde angular
        $scope.actualizar = function(producto) {
            uploadURL = '/upload/' + producto._id;

            $scope.uploadOptions = {
                queueLimit: 1,
                autoUpload: true,
                url: uploadURL
            }
            if (producto.imagen != "") {
                $scope.mostrarImg = true;
                descargar(producto.imagen);
            } else {
                $scope.mostrarImg = true;
                $scope.imageen = null;
            }
            fProductos.producto = producto;
            $scope.producto = producto;
            console.log($scope.producto);

            $scope.tipo_estado.selectedOption = $scope.tipo_estado.availableOptions[producto.Estado];
            $scope.Descripciones = producto.Descripcion;
            //$scope.changeSucursal();
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
            $scope.booladd = false;
            $scope.boolupd = true;
            $scope.encabezado = "PRODUCTO: " + $scope.producto.Nombre;
        };
        $scope.agregar = function() {
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
            $scope.encabezado = "AGREGAR NUEVO PRODUCTO";
            // $scope.tipo_sucursal.selectedOption = { id: '0', name: 'Almacen' };
            $scope.producto = {};
            $scope.Descripciones = [];
            $scope.mostrarImg = false;
            $scope.imageen = null;
            //$scope.changeSucursal();
            $scope.boolupd = false;
            $scope.booladd = true;
        };
        $scope.adddescripcion = function(descripcion) {
            $scope.Descripciones.push(descripcion);
            toastr.success('Descripción agregada');
            $scope.Descripcion = {};
        };
        $scope.cancelar = function() {
            toastr.error('proceso cancelado');
            $scope.Descripcion = {};
        };
        $scope.eliminar = function(descripcion) {
            var indice = $scope.Descripciones.indexOf(descripcion);
            $scope.Descripciones.splice(indice, 1);
            $scope.Descripcion = {};
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
            toastr.warning('descripcion eliminada');
        };
        $scope.procesacaract = function(descripcion) {
            $scope.showAddBtn = false;
            $scope.showUpdateBtn = true;
            $scope.Descripcion = descripcion;
        };
        $scope.modificar = function(descripcion) {
            var indice = $scope.Descripciones.indexOf(descripcion);
            $scope.Descripciones[indice] = descripcion;
            $scope.Descripcion = {};
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
            toastr.success("se modificó descripción");
        };


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

        $scope.listProducto();


    });