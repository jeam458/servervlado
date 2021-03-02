angular.module('MyApp')
    .factory('fStockProductos', function($http) {
        var fStockProducto = {};
        fStockProducto.productos = [];
        fStockProducto.producto = {};
        fStockProducto.conteo = {};

        fStockProducto.getAll = function() {
            return $http.get('/stockproductos')
                .success(function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log(fStockProducto.productos);
                })
        }
        fStockProducto.getCount = function() {
            return $http.get('/stockproductosCount')
                .success(function(data) {
                    angular.copy(data, fStockProducto.conteo)
                    return fStockProducto.conteo;
                    //console.log(data);
                })
        }
        fStockProducto.getprodxsucursal = function(id) {
            return $http.get('/productoxsucursal/' + id)
                .success(function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos;
                })
        }
        fStockProducto.add = function(producto) {
            return $http.post('/stockproducto', producto)
                .success(function(producto) {
                    fStockProducto.productos.push(producto);
                })
        }
        fStockProducto.update = function(producto) {
            return $http.put('stockproducto/' + producto._id, producto)
                .success(function(data) {
                    var indice = fStockProducto.productos.indexOf(producto);
                    fStockProducto.productos[indice] = data;
                })
        }
        fStockProducto.transferencia = function(producto) {
            return $http.put('stockproducto1/' + producto._id, producto)
                .success(function(data) {
                    var indice = fStockProducto.productos.indexOf(producto);
                    fStockProducto.productos[indice] = data;
                })
        }
        fStockProducto.aceptar = function(producto) {
            return $http.put('stockproducto2/' + producto._id, producto)
                .success(function(data) {
                    var indice = fStockProducto.productos.indexOf(producto);
                    fStockProducto.productos[indice] = data;
                })
        }
        fStockProducto.enfechas = function(fechas) {
            return $http.get('stockproductoFechas/' + fechas.startDate + '/' + fechas.endDate + '/' + fechas.sucursal + '/' + fechas.proveedor, fechas).success(
                function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log("en fechas", data)
                }
            )
        }
        fStockProducto.enfechas1 = function(fechas) {
            return $http.get('stockproductoFechas1/' + fechas.startDate + '/' + fechas.endDate, fechas).success(
                function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log("en fechas", data)
                }
            )
        }
        fStockProducto.enfechas2 = function(fechas) {
            return $http.get('stockproductoFechas5/' + fechas.startDate + '/' + fechas.endDate + '/' + fechas.sucursal, fechas).success(
                function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log("en fechas", data)
                }
            )
        }
        fStockProducto.enfechas3 = function(fechas) {
            return $http.get('stockproductoFechas6/' + fechas.startDate + '/' + fechas.endDate + '/' + fechas.proveedor, fechas).success(
                function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log("en fechas", data)
                }
            )
        }
        fStockProducto.SucProveedor = function(datos) {
            return $http.get('stockproductoFechas2/' + datos.sucursal + '/' + datos.proveedor, datos).success(
                function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log("en fechas", data)
                }
            )
        }
        fStockProducto.Proveedorr = function(datos) {
            return $http.get('stockproductoFechas3/' + datos.proveedor, datos).success(
                function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log("en fechas", data)
                }
            )
        }
        fStockProducto.Sucursall = function(datos) {
            return $http.get('stockproductoFechas4/' + datos.sucursal, datos).success(
                function(data) {
                    angular.copy(data, fStockProducto.productos)
                    return fStockProducto.productos
                        //console.log("en fechas", data)
                }
            )
        }
        fStockProducto.delete = function(producto) {
            return $http.delete('/stockproducto/' + producto._id)
                .success(function() {
                    var indice = fStockProducto.productos.indexOf(producto);
                    fStockProducto.productos.splice(indice, 1);
                })
        }
        return fStockProducto;

    })
    .controller('CtrlStockProductos', function($scope, $state, fStockProductos, fProveedores, fSucursales,Account, tipocomun, fProductos, toastr) {
        $scope.editarprod = false;
        $scope.encabezado = "";
        $scope.encabProd = "";
        $scope.variosproductos = [];
        $scope.Descripciones = [];
        $scope.Descripcion = { Caracteristica: '', Descripcion: '' };
        $scope.producto = {};

        $scope.tipo_producto = {
            availableOptions: tipocomun.tipos,
            selectedOption: ''
        }
        $scope.openFilterStart = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = true;
        };
        $scope.openFilterVencimiento = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.OpenedVencimiento = true;
        };
        $scope.openFilterEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endOpened = true;
        };
        $scope.calculateStyle = function(test) {
            var style = {}
            if (test == '0') { style.color = 'green' } else if (test == '1') { style.color = 'orange' } else { style.color = 'blue' }
            return style;
        }

        $scope.estado_stock = {
            availableOptions: [
                { id: '0', name: 'Activo' },
                { id: '1', name: 'Transito' },
                { id: '2', name: 'Vendido' },
                { id: '3', name: 'De baja' }
            ],
            selectedOption: { id: '0', name: 'Activo' }
        }
        $scope.crearconsolidado = function() {
            //$scope.consolidado = fProductos.productos;
            for (var index = 0; index < fProductos.productos.length; index++) {
                var consolidado = {};
                consolidado._id = fProductos.productos[index]._id;
                consolidado.Codigo = fProductos.productos[index].Codigo;
                consolidado.Nombre = fProductos.productos[index].Nombre;
                consolidado.UMedida = fProductos.productos[index].UMedida;
                consolidado.stock = 0;
                consolidado.PV = 0;
                consolidado.PC = 0;
                consolidado.sucursales = [];
                //consolidado.productos = [];
                $scope.consolidado.push(consolidado);
            }
            $scope.stockconsolidado();
            $scope.totalItems1=$scope.consolidado.length;
            //console.log($scope.consolidado)
        }
        $scope.existe = function(array, sucursal) {
            var si;
            //console.log(array);
            //console.log(sucursal);
            var indice = array.indexOf(sucursal);
            //console.log(indice)
            if (indice != -1) {
                si = false
                return si;
            } else {
                si = true;
                return si;
            }
        }
        $scope.succ = function(id) {
            //console.log(id)
            var nombre;
            var contador = 0;
            for (index = 0; index < fSucursales.sucursales.length || contador == 1; index++) {
                var item = fSucursales.sucursales[index];
                if (id == item._id) {
                    contador = contador + 1;
                    nombre = fSucursales.sucursales[index].Nombre;
                    return nombre;
                }
            }
        }
        $scope.searchText;
        $scope.porprod = function(valor,cantidad) {
            $scope.searchText = valor;
            $scope.pageSize=cantidad;
            //console.log($scope.searchText);
        }
        $scope.modifcantidad=function(){
            if ($scope.searchText==""){
                $scope.pageSize=10;
            }
        }

        $scope.stockconsolidado = function() {
            for (var index = 0; index < $scope.stockproductos.length; index++) {
                for (var index1 = 0; index1 < $scope.consolidado.length; index1++) {
                    var elemento = $scope.stockproductos[index];
                    var suc = $scope.stockproductos[index].Sucursal;
                    if ($scope.stockproductos[index].Producto == $scope.consolidado[index1]._id) {
                        //$scope.consolidado[index1].productos.push(elemento);
                        if ($scope.consolidado[index1].sucursales.length == 0) {
                            //console.log(suc)
                            var nomm = $scope.succ(suc);
                            //console.log(nomm)
                            $scope.consolidado[index1].sucursales.push(nomm)
                        } else if ($scope.existe($scope.consolidado[index1].sucursales, $scope.succ(suc)) == true) {
                            var nomm = $scope.succ(suc);
                            $scope.consolidado[index1].sucursales.push(nomm)
                        }
                    }
                    if ($scope.stockproductos[index].Producto == $scope.consolidado[index1]._id && $scope.stockproductos[index].EstadoStock == 0 || $scope.stockproductos[index].EstadoStock == 1) {
                        $scope.consolidado[index1].PC = $scope.consolidado[index1].PC + $scope.stockproductos[index].PC;
                        $scope.consolidado[index1].PV = $scope.consolidado[index1].PV + $scope.stockproductos[index].PV;
                        $scope.consolidado[index1].stock = $scope.consolidado[index1].stock + 1;
                    }
                }
            }
            for (var indexn = 0; indexn < $scope.consolidado.length; indexn++) {
                if ($scope.consolidado[indexn].stock == 0) {
                    $scope.consolidado.splice(indexn, 1);
                }
            }
        }

        $scope.bloquear = function(valor) {
            if (valor == 2 || valor == 3) {
                return true;
            }
        }
        $scope.tipo_estado = {
            availableOptions: [
                { id: '0', name: 'Activo' },
                { id: '1', name: 'Inactivo' },
            ],
            selectedOption: { id: '0', name: 'Activo' } //This sets the default value of the select in the ui
        };
        $scope.select_producto = {
            availableOptions: fProductos.productos
        }
        $scope.select_proveedor = {
            availableOptions: fProveedores.proveedores
        }
        $scope.select_sucursal = {
            availableOptions: fSucursales.sucursales
        }
        $scope.tuproducto = function(producto) {
            //$scope.editarprod = true;
            //console.log(producto);
            var longitud = fProductos.productos.length;
            for (var index = 0; index < fProductos.productos.length; index++) {
                //var element = array[index];
                if (fProductos.productos[index]._id == producto) {
                    //console.log(fProductos.productos[index]);
                    $scope.stockproducto.Codigo = fProductos.productos[index].Codigo;
                    $scope.stockproducto.Nombre = fProductos.productos[index].Nombre;
                    $scope.stockproducto.UMedida = fProductos.productos[index].UMedida;
                    $scope.stockproducto.PC = fProductos.productos[index].PC;
                    $scope.stockproducto.PV = fProductos.productos[index].PV;
                }
            }
            $scope.nombreprov = function(id) {
                console.log(id);
            }
        };

        $scope.tuproducto1 = function(producto) {
            //console.log(producto);
            var longitud = fProductos.productos.length;
            for (var index = 0; index < fProductos.productos.length; index++) {
                //var element = array[index];
                if (fProductos.productos[index]._id == producto) {
                    //console.log(fProductos.productos[index]);
                    $scope.producto = fProductos.productos[index];
                    $scope.Descripciones = fProductos.productos[index].Descripcion;
                }
            }
            $scope.nombreprov = function(id) {
                console.log(id);
            }

        };
        $scope.tuproducto2 = function(producto) {
            $scope.seleccionar = false;
            $scope.caracteristicaa = false;
            //console.log(producto);
            var longitud = fProductos.productos.length;
            for (var index = 0; index < fProductos.productos.length; index++) {
                //var element = array[index];
                if (fProductos.productos[index]._id == producto) {
                    //console.log(fProductos.productos[index]);
                    $scope.producto = fProductos.productos[index];
                    $scope.Descripciones = fProductos.productos[index].Descripcion;
                }
            }
            $scope.nombreprov = function(id) {
                console.log(id);
            }

        };

        $scope.cabecera_stockproducto = ['Cod. Producto/Barra', 'Producto', 'Stock', 'U. medida', 'Estado', 'Fecha', 'Editar'];
        $scope.cabecera1 = ['Codigo', 'Producto', 'Stock', 'U. Medida', 'PC', 'PV', 'Ubicacion Sucursales'];
        $scope.stockproducto = {};
        //$scope.stockproducto.EstadoStock = parseInt($scope.estado_stock.selectedOption.id);
        $scope.addStockProducto = function() {
            //console.log($scope.variosproductos);
            if ($scope.stockproducto.Sucursal == undefined && $scope.stockproducto.Proveedor == undefined && $scope.variosproductos.length == 0) {
                toastr.warning("Si desea agregar stock llene los campos porfavor")
            } else {
                $scope.stockproducto.EstadoStock = parseInt($scope.estado_stock.selectedOption.id);
                //$scope.generarpdf();
                fStockProductos.getCount().then(function(response) {
                    $scope.conteo = fStockProductos.conteo.conteo;
                    //console.log($scope.conteo);
                    $scope.foradd($scope.conteo);
                })
            }
        };
        $scope.foradd = function(cont) {
            //console.log($scope.variosproductos);
            for (var index = 0; index < $scope.variosproductos.length; index++) {
                console.log($scope.variosproductos[index]);
                $scope.variosproductos[index].CodProducto = "P" + (cont + 1);
                fStockProductos.add($scope.variosproductos[index])
                    .then(function(response) {
                        $scope.isProfileLoading = true;
                        //toastr.clear();
                        toastr.success('stock agregado');
                        $scope.isProfileLoading = false;
                    })
                    .catch(function(response) {
                        $scope.isProfileLoading = false;
                        toastr.clear();
                        toastr.error(response.data, response.status);
                        //toastr.error(response.status);
                    });

                cont = cont + 1;
            }
            $scope.variosproductos = [];
        }

        function getBase64Image(img) {

            var canvas = document.createElement("canvas");

            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0);

            var dataURL = canvas.toDataURL("image/jpeg");

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

        }
        var img = new Image();

        img.onload = function() {
            var dataURI = getBase64Image(img);
            return dataURI;

        }
        $scope.generarpdfTodo = function() {
            var prod = $scope.consolidado;
            var doc = new jsPDF('l', 'pt');
            img.src = '../../icono.png';
            doc.addImage(img.onload(), 'JPEG', 35, 10, 20, 20);

            doc.setFontSize(20);
            doc.text(60, 28, "PRODUCTOS EN STOCK")
            doc.setFontSize(10);
            doc.text(35, 40, "");
            if ($scope.startDate == undefined && $scope.endDate == undefined) {
                doc.text(35, 45, "FECHA:" + $scope.convertDate(Date.now()))
            } else if ($scope.startDate != undefined && $scope.endDate != undefined) {
                doc.text(35, 45, "DESDE:" + $scope.convertDate($scope.startDate.toJSON()));
                doc.text(150, 45, "HASTA:" + $scope.convertDate($scope.endDate.toJSON()));
            }
            doc.text(300, 45, "CANTIDAD DE PRODUCTOS: " + prod.length);
            var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
            doc.autoTable(res.columns, res.data, {
                startY: 60
            });
            doc.save('stock.pdf');
        }

        $scope.generarpdfDetalle = function() {
            var doc = new jsPDF('l', 'pt');
            img.src = '../../icono.png';
            doc.addImage(img.onload(), 'JPEG', 35, 10, 20, 20);
            doc.setFontSize(20);
            doc.text(60, 28, "DETALLE DE PRODUCTOS")
            doc.setFontSize(10);
            doc.text(35, 40, "");
            if ($scope.startDate == undefined && $scope.endDate == undefined) {
                doc.text(35, 45, "FECHA:" + $scope.convertDate(Date.now()))
            } else if ($scope.startDate != undefined && $scope.endDate != undefined) {
                doc.text(35, 45, "DESDE:" + $scope.convertDate($scope.startDate.toJSON()));
                doc.text(150, 45, "HASTA:" + $scope.convertDate($scope.endDate.toJSON()));
            }
            var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
            doc.autoTable(res.columns, res.data, {
                startY: 60
            });
            var res1 = doc.autoTableHtmlToJson(document.getElementById("detalle-table"));
            res1.columns.splice(5, 2);
            doc.autoTable(res1.columns, res1.data, {
                startY: doc.autoTableEndPosY()
            });
            doc.save('stock.pdf');
        }

        $scope.convertDate = function(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
        }

        $scope.sucmostrar = function() {
            for (var i = 0; i < fSucursales.sucursales.length; i++) {
                if ($scope.stockproducto.Sucursal == fSucursales.sucursales[i]._id) {
                    return fSucursales.sucursales[i].Nombre;
                }
            }
        }

        
        $scope.generarpdf1 = function() {
            //console.log(prod)
            var prod = $scope.consolidado;
            var doc = new jsPDF('p', 'pt');
            /*titulo de la página*/
            //var img = new Image();
            //img.width = 80;
            //img.height = 80;
            img.src = '../../icono.png';
            doc.addImage(img.onload(), 'JPEG', 35, 10, 20, 20);
            doc.setFont("courier", "italic");
            doc.setFontSize(23);
            doc.text(55, 25, "SYS VENTAS CUSCO");
            doc.setFontSize(20);
            doc.text(55, 40, "STOCK DE PRODUCTOS")
            doc.setFontSize(10);
            doc.text(35, 44, "");
            doc.text(35, 50, "FECHA:" + $scope.convertDate(Date.now()))
            //doc.text(35, 45, "SUCURSAL: " + $scope.sucmostrar());
            doc.text(200, 50, "PRODUCTOS: " + prod.length);
            var col = [
                { title: "Codigo", dataKey: "Codigo" },
                { title: "Nombre", dataKey: "Nombre" },
                { title: "stock", dataKey: "stock" },
                { title: "PC", dataKey: "PC" },
                { title: "PV", dataKey: "PV" },
                {title:"Sucursales",dataKey:"sucursales"}
            ];
            var rows = [];
            //console.log(prod[0])
            for (var key in prod) {
                var temp = prod[key];
                rows.push(temp);
            }
            //console.log(rows)
            doc.autoTable(col, rows, {
                tableWidth: 'wrap',
                margin: { horizontal: 35, top: 55, letf: 2, right: 2, bottom: 2 },
                styles: { cellPadding: 1 },
                headerStyles: { rowHeight: 12, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'middle' },
                columnStyles: { Nombre: { columnWidth: 'relative' } },
            });
            doc.save('stockTotal.pdf');
            //window.open(doc.output('bloburl'))
        }

        $scope.generarpdf = function() {
            //console.log(prod)
            var prod = $scope.variosproductos;
            var doc = new jsPDF('');
            /*titulo de la página*/
            var img = new Image();
            img.width = 80;
            img.height = 80;
            img.src = '../../icono.png';
            doc.addImage(img, 'png', 10, 10);
            doc.setFont("courier", "italic");
            doc.setFontSize(23);
            doc.text(35, 20, "SYS VENTAS CUSCO");
            doc.setFontSize(20);
            doc.text(35, 28, "INGRESO DE PRODUCTOS")
            doc.setFontSize(10);
            doc.text(35, 40, "");
            doc.text(99, 40, "FECHA:" + $scope.convertDate(Date.now()))
            doc.text(35, 45, "SUCURSAL: " + $scope.sucmostrar());
            doc.text(99, 45, "CANTIDAD DE PRODUCTOS: " + prod.length);
            var col = [
                { title: "Cod. Barra", dataKey: "CodigoBarra" },
                { title: "Nombre", dataKey: "Nombre" },
                { title: "P. Compra", dataKey: "PC" },
                { title: "P. Venta", dataKey: "PV" }
            ];
            var rows = [];
            //console.log(prod[0])
            for (var key in prod) {
                var temp = prod[key];
                rows.push(temp);
            }
            //console.log(rows)
            doc.autoTable(col, rows, {
                tableWidth: 'wrap',
                margin: { horizontal: 15, top: 55, letf: 2, right: 2, bottom: 2 },
                styles: { cellPadding: 1 },
                headerStyles: { rowHeight: 12, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'middle' },
                columnStyles: { Nombre: { columnWidth: 'relative' } },
            });
            window.open(doc.output('bloburl'))
        }
        $scope.listporfechas = function(inicio, fin, sucursal, proveedor) {
            if (inicio == undefined && fin == undefined) {
                if (sucursal == "" && proveedor != "") {
                    var datos = { 'proveedor': proveedor }
                    fStockProductos.Proveedorr(datos).then(function(response) {
                        $scope.isProfileLoading = true;
                        $scope.stockproductos = fStockProductos.productos;
                        //console.log($scope.stockproductos)
                        $scope.isProfileLoading = false;
                        $scope.consolidado = [];
                        $scope.crearconsolidado();
                        toastr.success("datos actualizados")
                    })
                } else if (proveedor == "" && sucursal != "") {
                    var datos = { 'sucursal': sucursal }
                    fStockProductos.Sucursall(datos).then(function(response) {
                        $scope.isProfileLoading = true;
                        $scope.stockproductos = fStockProductos.productos;
                        //console.log($scope.stockproductos)
                        $scope.isProfileLoading = false;
                        $scope.consolidado = [];
                        $scope.crearconsolidado();
                        toastr.success("datos actualizados")
                    })
                } else if (proveedor != "" && sucursal != "") {
                    var datos = { 'sucursal': sucursal, 'proveedor': proveedor }
                    fStockProductos.SucProveedor(datos).then(function(response) {
                        $scope.isProfileLoading = true;
                        $scope.stockproductos = fStockProductos.productos;
                        //console.log($scope.stockproductos)
                        $scope.isProfileLoading = false;
                        $scope.consolidado = [];
                        $scope.crearconsolidado();
                        toastr.success("datos actualizados")
                    })

                }
            } else if (proveedor == "" && sucursal == "") {
                fin.setHours(23);
                fin.setMinutes(59);
                var fechas = { 'startDate': inicio.toJSON(), 'endDate': fin.toJSON() }
                    //console.log(fechas)
                fStockProductos.enfechas1(fechas).then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.stockproductos = fStockProductos.productos;
                    //console.log($scope.stockproductos)
                    $scope.isProfileLoading = false;
                    $scope.consolidado = [];
                    $scope.crearconsolidado();
                    toastr.success("datos actualizados")
                })

            } else if (proveedor == "" && sucursal != "") {

                fin.setHours(23);
                fin.setMinutes(59);
                var fechas = { 'startDate': inicio.toJSON(), 'endDate': fin.toJSON(), 'sucursal': sucursal }
                    //console.log(fechas)
                fStockProductos.enfechas2(fechas).then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.stockproductos = fStockProductos.productos;
                    //console.log($scope.stockproductos)
                    $scope.isProfileLoading = false;
                    $scope.consolidado = [];
                    $scope.crearconsolidado();
                    toastr.success("datos actualizados")
                })

            } else if (proveedor != "" && sucursal == "") {
                fin.setHours(23);
                fin.setMinutes(59);
                var fechas = { 'startDate': inicio.toJSON(), 'endDate': fin.toJSON(), 'proveedor': proveedor }
                    //console.log(fechas)
                fStockProductos.enfechas3(fechas).then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.stockproductos = fStockProductos.productos;
                    //console.log($scope.stockproductos)
                    $scope.isProfileLoading = false;
                    $scope.consolidado = [];
                    $scope.crearconsolidado();
                    toastr.success("datos actualizados")
                })

            } else if (inicio != undefined && fin != undefined && proveedor != "" && sucursal != "") {

                fin.setHours(23);
                fin.setMinutes(59);
                var fechas = { 'startDate': inicio.toJSON(), 'endDate': fin.toJSON(), 'sucursal': sucursal, 'proveedor': proveedor }
                    //console.log(fechas)
                fStockProductos.enfechas(fechas).then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.stockproductos = fStockProductos.productos;
                    //console.log($scope.stockproductos)
                    $scope.isProfileLoading = false;
                    $scope.consolidado = [];
                    $scope.crearconsolidado();
                    toastr.success("datos actualizados")
                })



            }
        }
        $scope.mostrar=true;
        $scope.listStockProducto = function() {
            tipocomun.getAll();
            fProductos.getAll();
            fProveedores.getAll();
            fSucursales.getAll();
            Account.getProfile()
                .then(function(response) {
                    $scope.user = response.data;
                    //console.log($scope.user);
                    $scope.isProfileLoading = false;
                    if($scope.user.tipo=="administrador"){
                        $scope.mostrar=true;
                    }else if($scope.user.tipo=="vendedor"){
                        $scope.mostrar=false;
                    }
                })
            fStockProductos.getAll()
                .then(function(response) {
                    $scope.Sucursal1 = "";
                    $scope.Proveedor1 = "";
                    $scope.startDate = undefined;
                    $scope.endDate = undefined;
                    $scope.isProfileLoading = true;
                    $scope.stockproductos = fStockProductos.productos;
                    $scope.totalItems = $scope.stockproductos.length;
                    //console.log($scope.stockproductos)
                    $scope.isProfileLoading = false;
                    $scope.consolidado = [];
                    $scope.crearconsolidado();
                    toastr.success("datos actualizados")
                })
                .finally(function() {})
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });

        };
        $scope.updStockproducto = function() {
            $scope.stockproducto.EstadoStock = parseInt($scope.estado_stock.selectedOption.id);
            fStockProductos.update($scope.stockproducto)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.success('Stock Actualizado');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        $scope.delStockproducto = function(stockproducto) {
            fStockProductos.delete(stockproducto)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.warning('Stock Eliminado');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        // funcionde angular
        $scope.actualizar = function(producto) {
            $scope.stockproducto = producto;
            //console.log($scope.stockproducto);
            $scope.estado_stock.selectedOption = $scope.estado_stock.availableOptions[producto.EstadoStock];
            $scope.encabProd = "CAMPOS EDITAR DE: " + $scope.stockproducto.Nombre;
            $scope.showAddBtn = false;
            $scope.showUpdateBtn1 = false;
            $scope.showCancelBtn1 = false;
            $scope.showtabla = false;
            $scope.booladd = false;
            $scope.boolupd = true;
            $scope.encabezado = "PRODUCTO: " + $scope.stockproducto.Nombre;
        };
        $scope.agregar = function() {
            $scope.Descripciones = [];
            $scope.stockproducto = {};
            $scope.stockproducto.Stock = 1;
            //$scope.stockproducto.CodProducto = "P" + (fStockProductos.productos.length + 1);
            $scope.showAddBtn1 = true;
            $scope.showUpdateBtn1 = false;
            $scope.showCancelBtn1 = true;
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
            $scope.showCancelBtn = true;
            $scope.showtabla = true;
            $scope.encabezado = "AGREGAR NUEVOS PRODUCTOS";
            $scope.encabProd = "AGREGAR PRODUCTO Y/O PRODUCTOS";
            $scope.boolupd = false;
            $scope.booladd = true;
        };
        $scope.addProducto1 = function(producto) {
            if ($scope.stockproducto.Sucursal != null || $scope.stockproducto.Proveedor) {
                $scope.stockproducto.EstadoStock = parseInt($scope.estado_stock.selectedOption.id);
                $scope.stockproducto.Cantidad = 1;
                $scope.stockproducto.CodProducto = "P";
                $scope.variosproductos.push(producto);
                //console.log($scope.variosproductos);
                $scope.sucursal1 = $scope.stockproducto.Sucursal;
                $scope.Proveedor11 = $scope.stockproducto.Proveedor;
                toastr.success('Producto agregado al stock');
                $scope.stockproducto = {};
                $scope.stockproducto.Sucursal = $scope.sucursal1;
                $scope.stockproducto.Proveedor = $scope.Proveedor11;
                $scope.stockproducto.Stock = 1;

            } else {
                toastr.warning('Seleccione Sucursal y/o proveedor');
            }
        }
        $scope.cancelar1 = function() {
            toastr.error('proceso cancelado');
            $scope.stockproducto = {};
        }
        $scope.eliminar1 = function(producto) {
            var indice = $scope.variosproductos.indexOf(producto);
            $scope.variosproductos.splice(indice, 1);
            $scope.stockproducto = {};
            $scope.stockproducto.Sucursal = $scope.sucursal1;
            $scope.stockproducto.Proveedor = $scope.Proveedor11;
            $scope.stockproducto.Stock = 1;
            $scope.showAddBtn1 = true;
            $scope.showUpdateBtn1 = false;
            toastr.warning('producto eliminado');
        };
        $scope.procesaProd1 = function(producto) {
            //$scope.showAddBtn = false;
            //$scope.showUpdateBtn = true;
            $scope.stockproducto = producto;
        }
        $scope.procesaProd = function(producto) {
            $scope.showAddBtn1 = false;
            $scope.showUpdateBtn1 = true;
            $scope.stockproducto = producto;
        }
        $scope.modificar1 = function(producto) {
            var indice = $scope.variosproductos.indexOf(producto);
            $scope.variosproductos[indice] = producto;
            $scope.stockproducto = {};
            $scope.stockproducto.Sucursal = $scope.sucursal1;
            $scope.stockproducto.Proveedor = $scope.Proveedor11;
            $scope.stockproducto.Stock = 1;
            $scope.showAddBtn1 = true;
            $scope.showUpdateBtn1 = false;
            toastr.success("se modificó producto");
        }
        $scope.reiniciar = function() {
            $scope.stockproductos = fStockProductos.productos;
            $scope.sucursal1 = "";
            $scope.Proveedor1 = "";
            $scope.searchText = "";

        }

        /*inicio agregar productos*/

        $scope.producto.tipo = $scope.tipo_producto.selectedOption;
        $scope.producto.Estado = $scope.tipo_estado.selectedOption;
        //$scope.producto.tipo = { _id: '0', nombre: 'Seleccione Categoria' };
        $scope.addinicio = function() {
            $scope.seleccionar = true;
            $scope.caracteristicaa = true;
            $scope.producto = {};
            $scope.Descripciones = [];
        }
        $scope.addProducto = function() {
            delete $scope.producto._id;
            $scope.producto.Estado = parseInt($scope.tipo_estado.selectedOption.id);
            $scope.producto.Descripcion = $scope.Descripciones;
            //console.log($scope.producto);

            fProductos.add($scope.producto)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.clear();
                    toastr.success('Producto agregado, porfavor seleccionelo para el stock');
                    $scope.isProfileLoading = false;
                    fProductos.getAll();
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


        /*fin agregar productos */

        /*inico--procesos en descripciones*/

        $scope.adddescripcion = function(descripcion) {
            $scope.Descripciones.push(descripcion);
            toastr.success('Descripción agregada');
            $scope.Descripcion = {};
        };
        $scope.cancelar11 = function() {
            toastr.error('proceso cancelado');
            $scope.producto = {};
            $scope.Descripciones = [];
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

        //$scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.pageSize1 = 5;

       $scope.predicate = 'Nombre';  
       $scope.reverse = false;  
       $scope.currentPage = 1;  
       $scope.currentPage1 = 1; 
       $scope.order = function (predicate) {  
         $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;  
         $scope.predicate = predicate;  
       }; 

       //$scope.totalItems = $scope.stockproductos.length;  
       $scope.numPerPage = 10;  
       $scope.paginate = function (value) {  
         var begin, end, index;  
         begin = ($scope.currentPage - 1) * $scope.numPerPage;  
         end = begin + $scope.numPerPage;  
         index = $scope.stockproductos.indexOf(value); 
         return (begin <= index && index < end);  
       };
       

        /*fin--procesos en descripciones */

        $scope.listStockProducto();

        $('body').on('hidden.bs.modal', function() {
            if ($('.modal.in').length > 0) {
                $('body').addClass('modal-open');
            }
        });


    });