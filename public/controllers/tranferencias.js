angular.module('MyApp')
    .factory('fTransferencias', function($http) {
        var fTransferencia = {};
        fTransferencia.transferencias = [];
        fTransferencia.transferencia = {};
        fTransferencia.conteo = {};
        fTransferencia.getAll = function() {
            return $http.get('/transferencias')
                .success(function(data) {
                    angular.copy(data, fTransferencia.transferencias)
                    return fTransferencia.transferencias
                        //console.log(fTransferencia.transferencias)
                })
        }
        fTransferencia.getCount = function() {
            return $http.get('/transferenciasCount')
                .success(function(data) {
                    angular.copy(data, fTransferencia.conteo)
                    return fTransferencia.conteo
                })
        }
        fTransferencia.add = function(transferencia) {
            return $http.post('transferencia', transferencia)
                .success(function(transferencia) {
                    fTransferencia.transferencias.push(transferencia);
                })
        }
        fTransferencia.update = function(transferencia) {
            return $http.put('transferencia/' + transferencia._id, transferencia)
                .success(function(data) {
                    var indice = fTransferencia.transferencias.indexOf(transferencia);
                    fTransferencia.transferencias[indice] = data;
                })
        }
        fTransferencia.recibido = function(transferencia) {
            return $http.put('transferencia1/' + transferencia._id, transferencia)
                .success(function(data) {
                    var indice = fTransferencia.transferencias.indexOf(transferencia);
                    fTransferencia.transferencias[indice] = data;
                })
        }
        fTransferencia.aceptados = function(transferencia) {
            return $http.put('transferencia2/' + transferencia._id, transferencia)
                .success(function(data) {
                    var indice = fTransferencia.transferencias.indexOf(transferencia);
                    fTransferencia.transferencias[indice] = data;
                })
        }
        fTransferencia.pedido = function(transferencia) {
            return $http.put('transferencia3/' + transferencia._id, transferencia)
                .success(function(data) {
                    var indice = fTransferencia.transferencias.indexOf(transferencia);
                    fTransferencia.transferencias[indice] = data;
                })
        }
        fTransferencia.delete = function(transferencia) {
            return $http.delete('/transferencia/' + transferencia._id)
                .success(function() {
                    var indice = fTransferencia.transferencias.indexOf(transferencia);
                    fTransferencia.transferencias.splice(indice, 1);
                })
        }
        return fTransferencia;

    })
    .controller('CtrlTransferencias', function($scope, $state, fTransferencias, fStockProductos, Account, fProveedores, fSucursales, fProductos, toastr) {
        $scope.variosproductos = [];
        $scope.transferencia1 = { Producto: String, CodProducto: String, CodigoBarra: String, Nombre: String, UMedida: String, EstadoStock: String }
        $scope.cabecera = ['Transferencia', 'Fecha', 'Sucursales', 'Emisor', 'Receptor', 'Estado', 'Acciones'];
        $scope.estado_stock = {
            availableOptions: [
                { id: '0', name: 'Confirmado' },
                { id: '1', name: 'Por Confirmar' },
                { id: '2', name: 'Vendido' },
                { id: '3', name: 'De baja' }
            ],
            selectedOption: { id: '0', name: 'Confirmado' }
        }
        $scope.calculateStyle = function(test) {
            var style = {}
            if (test == '0') { style.color = 'green' } else if (test == '1') { style.color = 'orange' } else { style.color = 'blue' }
            return style;
        }
        $scope.ocultar = function(valor) {
            if (valor == "1" || valor == "2" || valor == "3") {
                return true
            }
        }
        $scope.estado_transferencia = {
            availableOptions: [
                { id: '0', name: 'Enviado' },
                { id: '1', name: 'Recibido' },
                { id: '2', name: 'Verificado' },
                { id: '3', name: 'En Petición' }
            ],
            selectedOption: { id: '0', name: 'Enviado' }
        }
        $scope.select_sucursal = {
            availableOptions: fSucursales.sucursales
        }
        $scope.sucnombre1 = function(id) {
            for (var index = 0; index < fSucursales.sucursales.length; index++) {
                if (fSucursales.sucursales[index]._id == id) {
                    $scope.transferencia.Suc1Nombre = fSucursales.sucursales[index].Nombre;
                }
            }
        }
        $scope.sucnombre2 = function(id) {
            for (var index = 0; index < fSucursales.sucursales.length; index++) {
                if (fSucursales.sucursales[index]._id == id) {
                    $scope.transferencia.Suc2Nombre = fSucursales.sucursales[index].Nombre;
                }
            }
        }
        $scope.EmisorNombre = function(id) {
            for (var index = 0; index < $scope.usuarios.length; index++) {
                if ($scope.usuarios[index]._id == id) {
                    $scope.transferencia.NombreEmisor = $scope.usuarios[index].nombres + ' ' + $scope.usuarios[index].apellidos;
                }
            }
        }
        $scope.ReceptorNombre = function(id) {
            for (var index = 0; index < $scope.usuarios.length; index++) {
                if ($scope.usuarios[index]._id == id) {
                    $scope.transferencia.NombreReceptor = $scope.usuarios[index].nombres + ' ' + $scope.usuarios[index].apellidos;
                }
            }
        }
        $scope.transferencia = {};
        $scope.addTransferencia = function() {
            fTransferencias.getCount().then(function(response) {
                $scope.conteo = fTransferencias.conteo.conteo;
                $scope.foradd($scope.conteo);
            })

        };
        $scope.foradd = function(cont) {
            $scope.transferencia.fecha2 = Date.now();
            $scope.transferencia.fecha3 = Date.now();
            $scope.transferencia.CodTransferencia = "T" + (cont + 1);
            $scope.transferencia.Transferidos = $scope.variosproductos;

            fTransferencias.add($scope.transferencia);
            for (var index = 0; index < $scope.variosproductos.length; index++) {
                var prod = {};
                prod._id = $scope.variosproductos[index].Producto;
                prod.EstadoStock = $scope.variosproductos[index].EstadoStock;

                fStockProductos.transferencia(prod);
            }
            toastr.success('Transferencia realizada');
            $scope.pushnotification($scope.transferencia.CodTransferencia, $scope.transferencia.Suc1Nombre, $scope.transferencia.Suc2Nombre, $scope.transferencia.NombreEmisor, $scope.transferencia.NombreReceptor);
            $scope.transferencia = {};
        }
        $scope.confirmados = function() {
            var transferidos = {};
            transferidos._id = $scope.transferencia._id;
            transferidos.Transferidos = $scope.variosproductos;
            transferidos.Estado = parseInt(2);
            fTransferencias.aceptados(transferidos);

            for (var index = 0; index < $scope.variosproductos.length; index++) {
                var prod = {};
                prod._id = $scope.variosproductos[index].Producto;
                prod.EstadoStock = $scope.variosproductos[index].EstadoStock;
                prod.Sucursal = $scope.transferencia.Sucursal2;
                console.log(prod);
                fStockProductos.aceptar(prod);
            }
            toastr.success('Confirmación realizada')
            $scope.listTransferencias();
        }
        $scope.pushnotification = function(nro, desde, hasta, usuario1, usuario2) {

            if (!("Notification" in window)) {
                toastr.warning("este navegador no es compatible con notificaciones de escritorio")
            } else if (Notification.permission === "granted") {
                var options = {
                    body: "la transferencia " + nro + " fue enviada desde, " + desde + " hasta " + hasta + " por: " + usuario1 + "para: " + usuario2,
                    icon: "../../icono.png",
                    dir: "ltr"
                };
                var notification = new Notification("Hola", options);
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function(permission) {
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }
                    if (permission === "granted") {
                        var options = {
                            body: "la transferencia" + nro + "fue enviada desde," + desde + " hasta " + hasta + " por: " + usuario1 + "para: " + usuario2,
                            icon: "../../icono.png",
                            dir: "ltr"
                        };
                        var notification = new Notification("hi there", options);
                    }
                })
            }
        }
        $scope.confirmaar = function(producto) {
            $scope.transferencia = producto;
            console.log($scope.transferencia)
                //$scope.tipo_pago.selectedOption = $scope.tipo_pago.availableOptions[producto.TipoPago];
                //$scope.estado_venta.selectedOption = $scope.estado_venta.availableOptions[producto.Estado];
            $scope.encabProd = "PRODUCTOS A SELECCIONAR";
            $scope.variosproductos = producto.Transferidos;
            $scope.showtabla = true;
            $scope.booladd = false;
            $scope.boolupd = false;
            $scope.boolconf = true;
            $scope.encabezado = "TRANSFERENCIA: " + $scope.transferencia.CodTransferencia;
        }
        $scope.actualizar = function(producto) {
            $scope.transferencia = producto;
            console.log($scope.transferencia)
                //$scope.tipo_pago.selectedOption = $scope.tipo_pago.availableOptions[producto.TipoPago];
                //$scope.estado_venta.selectedOption = $scope.estado_venta.availableOptions[producto.Estado];
            $scope.encabProd = "PRODUCTOS A SELECCIONAR";
            $scope.variosproductos = producto.Transferidos;
            $scope.showtabla = true;
            $scope.booladd = false;
            $scope.boolupd = true;
            $scope.boolconf = false;
            $scope.encabezado = "TRANSFERENCIA: " + $scope.transferencia.CodTransferencia;
        };
        $scope.updTransferenciaproducto = function() {
            $scope.transferencia.Estado = parseInt($scope.estado_transferencia.selectedOption.id);
            $scope.transferencia.Transferidos = $scope.variosproductos;
            fTransferencias.update($scope.transferencia)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.success('Transferencia Actualizada');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        $scope.mostraraceptar = function(prod) {
            if (prod.Estado == 1) {
                return false;
            } else if (prod.Estado == 0) {
                return true;
            } else if (prod.Estado == 2) {
                return false;
            } else if (prod.Estado == 3) {
                return true;
            }
        }
        $scope.udprecibidoprod = function(producto) {
            if (producto.Estado == 0) {
                producto.Estado = parseInt(1);
                producto.fecha2 = Date.now();
                fTransferencias.recibido(producto)
                    .then(function(response) {
                        $scope.isProfileLoading = true;
                        toastr.success('Transferencia aceptada');
                        $scope.generarpdf(producto);
                        $scope.isProfileLoading = false;
                    })
                $scope.confirmaar(producto);
                $('#addModal').modal('show');
            } else if (producto.Estado == 3) {
                producto.Estado = parseInt(0);
                producto.fecha3 = Date.now();
                fTransferencias.pedido(producto)
                    .then(function(response) {
                        $scope.isProfileLoading = true;
                        toastr.success('Pedido aceptado y enviado');
                        $scope.isProfileLoading = false;
                    })
            }

        }
        $scope.elementorecibido = function(producto) {
            producto.EstadoStock = parseInt(0);
        }
        $scope.mostraraceptados = function(prod) {
            if (prod.EstadoStock == 1) {
                return true;
            } else if (prod.EstadoStock == 0) {
                return false;
            } else if (prod.EstadoStock == 2) {
                return false;
            }
        }
        $scope.deltransferenciaproducto = function(producto) {
            fTransferencias.delete(producto)
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    toastr.warning('Transferencia Eliminada');
                    $scope.isProfileLoading = false;
                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
        };
        $scope.agregar = function() {
            $scope.transferencia = {};
            $scope.variosproductos = [];
            $scope.listTransferencias();
            $scope.transferencia.Estado = parseInt($scope.estado_transferencia.selectedOption.id);
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
            $scope.showCancelBtn = true;
            $scope.showtabla = true;
            $scope.encabezado = "NUEVA TRANSFERENCIA";
            $scope.encabProd = "AGREGAR PRODUCTO Y/O PRODUCTOS";
            $scope.boolupd = false;
            $scope.booladd = true;
            $scope.boolconf = false;
        };
        $scope.agregarpedido = function() {
            $scope.transferencia = {};
            $scope.variosproductos = [];
            $scope.listTransferencias();
            $scope.transferencia.Estado = parseInt(3);
            $scope.showAddBtn = true;
            $scope.showUpdateBtn = false;
            $scope.showCancelBtn = true;
            $scope.showtabla = true;
            $scope.encabezado = "NUEVO PEDIDO";
            $scope.encabProd = "AGREGAR PRODUCTO Y/O PRODUCTOS";
            $scope.boolupd = false;
            $scope.booladd = true;
            $scope.boolconf = false;
        };

        $scope.listTransferencias = function() {
            Account.getAll()
                .then(function(response) {
                    $scope.usuarios = response.data;
                    $scope.select_usuario = {
                        availableOptions: $scope.usuarios
                    }
                })
            fProductos.getAll();
            fSucursales.getAll();
            fTransferencias.getAll()
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.transferencias = fTransferencias.transferencias;
                    $scope.totalItems1=$scope.transferencias.length;
                    console.log($scope.transferencias)
                    $scope.isProfileLoading = false;
                })
                .finally(function() {

                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toast.clear();
                    toast.error(response.data.message, response.status)
                })
            fStockProductos.getAll()
                .then(function(response) {
                    $scope.isProfileLoading = true;
                    $scope.stockproductos = fStockProductos.productos;
                    $scope.totalItems=$scope.stockproductos.length;
                    $scope.isProfileLoading = false;
                })
                .finally(function() {

                })
                .catch(function(response) {
                    $scope.isProfileLoading = false;
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });
            toastr.success("Datos actualizados");
        };
        $scope.listTransferencias();

        $scope.convertDate = function(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
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

        $scope.generarpdf = function(prod) {
            console.log(prod)
            var doc = new jsPDF('p', 'pt');
            img.src = '../../icono.png';
            doc.addImage(img.onload(), 'JPEG', 35, 10, 20, 20);
            doc.setFontSize(23);
            doc.text(60, 30, "SYS VENTAS CUSCO");
            doc.setFontSize(20);
            doc.text(60, 58, "TRANSFERENCIA NRO: " + prod.CodTransferencia)
            doc.setFontSize(10);
            doc.text(35, 80, "SUCURSALES Y RESPONSABLES");
            doc.text(300, 80, "FECHA:" + $scope.convertDate(Date.now()))
            doc.text(35, 95, "SUCURSAL EMISORA: " + prod.Suc1Nombre);
            doc.text(300, 95, "RESPONSABLE: " + prod.NombreEmisor);
            doc.text(35, 110, "SUCURSAL RECEPTORA: " + prod.Suc2Nombre);
            doc.text(300, 110, "RESPONSABLE: " + prod.NombreReceptor)
            var col = [{ title: "Cod. Producto", dataKey: "CodProducto" },
                { title: "Cod. Barra", dataKey: "CodigoBarra" },
                { title: "Nombre", dataKey: "Nombre" }
            ];
            var rows = [];
            console.log(prod.Transferidos[0])

            for (var key in prod.Transferidos) {
                var temp = prod.Transferidos[key];
                rows.push(temp);
            }
            console.log(rows)
            doc.autoTable(col, rows, {
                tableWidth: 'auto',
                margin: { horizontal: 35, top: 150, letf: 3, right: 3, bottom: 3 },
                styles: { cellPadding: 2 },
                headerStyles: { rowHeight: 20, fontSize: 12 },
                bodyStyles: { rowHeight: 20, fontSize: 12, valign: 'middle' },
                columnStyles: { Nombre: { columnWidth: 'relative' } },
            });
            doc.save('transferencia.pdf');
            //window.open(doc.output('bloburl'))
        }



        $scope.procesaProd = function(producto) {
            $scope.transferencia1.Producto = producto._id;
            $scope.transferencia1.CodProducto = producto.CodProducto;
            $scope.transferencia1.CodigoBarra = producto.CodigoBarra;
            $scope.transferencia1.Nombre = producto.Nombre;
            $scope.transferencia1.UMedida = producto.UMedida;
            $scope.transferencia1.EstadoStock = 1;
            console.log($scope.variosproductos);
            console.log(producto);
            var hay = buscadorcont(producto);
            console.log(hay);

            if (hay == 0) {
                $scope.variosproductos.push($scope.transferencia1);
                $scope.transferencia1 = {};
                console.log($scope.variosproductos);
                toastr.success('Producto agregado');
            } else { toastr.warning('No puede agregar 2 veces el mismo producto'); }
        }
        $scope.cancelar = function() {
            $scope.variosproductos = [];
            $scope.transferencia = {};
            toastr.warning('Proceso cancelado');
        }

        function buscadorcont(prod) {
            var contadorr = 0;
            for (var index = 0; index < $scope.variosproductos.length; index++) {
                if (prod.CodProducto == $scope.variosproductos[index].CodProducto) {
                    contadorr = contadorr + 1;
                }
            }
            return contadorr;
        }

        $scope.eliminar = function(producto) {
            var indice = $scope.variosproductos.indexOf(producto);
            $scope.variosproductos.splice(indice, 1);

            $scope.transferencia1 = {};
            toastr.warning('producto eliminado');
        };

        $scope.bloquear = function(producto) {
            if (producto.Stock == 1) {
                return true;
            }
        }
        $('#addModal').click(function(e) {
            e.preventDefault();
            //addImage(5);
            //$('#addModal').modal('hide');
            $(this).tab('show')
                //return false;
        })

        $scope.currentPage = 1;
        $scope.currentPage1 = 1;
        $scope.pageSize = 10;
        $scope.pageChangeHandler = function(num) {
            console.log('' + num);
        };

       $scope.predicate = 'CodProducto';  
       $scope.reverse = false;  
       $scope.currentPage = 1;  
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

        $('body').on('hidden.bs.modal', function() {
            if ($('.modal.in').length > 0) {
                $('body').addClass('modal-open');
            }
        });

    })