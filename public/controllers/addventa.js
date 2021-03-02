angular.module('MyApp')
.controller('CtrlAddVentas',function($scope,$http,$state,fStockProductos,fVentas,tipocomun,fClientes,Account,fProveedores,fSucursales,fProductos,toastr){
    $scope.encabezado = "";
    $scope.encabProd = "";
    $scope.variosproductos = [];
    $scope.venta1 = { CodigoBarra: Number, Nombre: String, Cantidad: Number, UMedida: String, PrecioUnitario: Number, PrecioTotal: Number }
    $scope.calculateStyle = function(test) {
        var style = {}
        if (test == '0') { style.color = 'green' } else if (test == '1') { style.color = 'orange' } else { style.color = 'blue' }
        return style;
    }
    $scope.tipo_pago = {
        availableOptions: [
            { id: '0', name: 'Efectivo' },
            { id: '1', name: 'transferencia bancaria' },
            { id: '2', name: 'Crédito' }
        ],
        selectedOption: { id: '0', name: 'Efectivo' }
    }
    $scope.estado_stock = {
        availableOptions: [
            { id: '0', name: 'Confirmado' },
            { id: '1', name: 'Por Confirmar' },
            { id: '2', name: 'Vendido' },
            { id: '3', name: 'De baja' }
        ],
        selectedOption: { id: '0', name: 'Confirmado' }
    }
    $scope.estado_venta = {
        availableOptions: [
            { id: '0', name: 'Venta' },
            { id: '1', name: 'Cotización' },
        ],
        selectedOption: { id: '0', name: 'Venta' }
    }
    $scope.select_cliente = {
        availableOptions: fClientes.clientes
    }
    $scope.select_producto = {
        availableOptions: fProductos.productos
    }
    $scope.select_proveedor = {
        availableOptions: fProveedores.proveedores
    }

    $scope.select_sucursal = {
        availableOptions: fSucursales.sucursales
    }
    
    $scope.ocultar = function(valor, id) {
        if (valor == "0") {
            if ($scope.existe(id) == true) {
                return true
            }
        }
        if (valor == "1" || valor == "2" || valor == "3") {
            return true;
        }
    }
    $scope.tusucursal = function(sucursal) {
        for (var index = 0; index < fSucursales.sucursales.length; index++) {
            if (fSucursales.sucursales[index]._id == sucursal) {
                $scope.venta.NombreSucursal = fSucursales.sucursales[index].Nombre;
            }
        }
    }
    $scope.tucliente = function(cliente) {
        for (var index = 0; index < fClientes.clientes.length; index++) {
            if (fClientes.clientes[index]._id == cliente) {
                console.log(fClientes.clientes[index]);
                $scope.venta.NombreCliente = fClientes.clientes[index].Nombre + ' ' + fClientes.clientes[index].AP + ' ' + fClientes.clientes[index].AM;
                $scope.venta.Dni = fClientes.clientes[index].Dni;
                $scope.venta.RUC = fClientes.clientes[index].Ruc;
                $scope.venta.Telefono = fClientes.clientes[index].Celular;
                $scope.venta.Email = fClientes.clientes[index].Correo;
                console.log($scope.venta)
            }
        }
    }

    $scope.cabecera_stockproducto = ['Nro', 'Fecha', 'Cliente', 'Vendedor', 'Sucursal', 'Estado', 'Total', 'Acciones'];
    $scope.venta = {};

    $scope.tipo_persona = {
        availableOptions: [
            { id: '0', name: 'Natural' },
            { id: '1', name: 'Jurídica' },
            { id: '2', name: 'Natural con RUC' }
        ],
        selectedOption: { id: '0', name: 'Natural' }
    }
    $scope.cliente = {};
    $scope.addinicio = function() {
        $scope.tipo_persona.selectedOption = { id: '0', name: 'Natural' }
        $scope.changeCliente();
        $scope.booladd = true;
        $scope.boolupd = false;
    }
    $scope.personaa = function(dni) {
        if (dni != null) {
            var dnii = dni.toString();
            if (dnii.length == 8 && $scope.validate_pe_doc("1", dnii)) {
                $http.get('Dni/' + dni, dni).success(function(data) {
                    $scope.cliente.Nombre = data.name;
                    $scope.cliente.AP = data.paternal_surname;
                    $scope.cliente.AM = data.maternal_surname;
                    if (parseInt($scope.tipo_persona.selectedOption.id) == 2) {
                        $scope.cliente.Ruc = parseInt('10' + dni.toString() + data.check_digit);
                        //console.log($scope.cliente.Ruc)
                    } else if (parseInt($scope.tipo_persona.selectedOption.id) == 0) {
                        $scope.cliente.Ruc = null;
                    }
                })
            } else if (dnii.length == 0 || dnii.length < 8) {
                console.log("esperando")
            }
        }
    }

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

    $scope.juridico = function(ruc) {
        if (ruc != null) {
            var rucc = ruc.toString();
            //$scope.validate_pe_doc("6", rucc);
            if (rucc.length == 11 && $scope.validate_pe_doc("6", rucc)) {
                $http.get('Ruc/' + ruc, ruc).success(function(data) {
                    console.log(data);
                    $scope.cliente.Nombre = data.name;
                    $scope.cliente.Gerente = data.representatives[0].name;
                    $scope.cliente.Direccion = data.street;
                    if (parseInt($scope.tipo_persona.selectedOption.id) == 1) {
                        $scope.cliente.AP = null;
                        $scope.cliente.AM = null;
                    }
                })
            }
        }
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

    $scope.generarpdf = function() {
        var prod = $scope.venta;
        var doc = new jsPDF('p', 'pt');
        img.src = '../../icono.png';
        doc.addImage(img.onload(), 'JPEG', 40, 10, 20, 20);
        doc.setFontSize(23);
        doc.text(65, 30, "SYS VENTAS CUSCO");
        doc.setFontSize(20);
        doc.text(65, 58, "VENTA NRO: " + prod.NroFactura)
        doc.setFontSize(10);
        doc.text(40, 80, "DATOS");
        doc.text(305, 80, "FECHA:" + prod.fecha);
        doc.text(40, 95, "VENDEDOR: " + prod.NombreVendedor);
        doc.text(305, 95, "SUCURSAL: " + prod.NombreSucursal);
        doc.text(40, 110, "NOMBRE CLIENTE: " + prod.NombreCliente);
        doc.text(305, 110, "DNI: " + prod.Dni)

        var res1 = doc.autoTableHtmlToJson(document.getElementById("tableVenta"));
        res1.columns.splice(5, 1);
        doc.autoTable(res1.columns, res1.data, {
            startY: 120
        });
        doc.text(400, doc.autoTableEndPosY() + 30, "TOTAL A PAGAR: " + prod.Total)
        doc.save('venta.pdf');
    }


    $scope.addCliente = function() {
        $scope.cliente.tipo = parseInt($scope.tipo_persona.selectedOption.id);
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
    $scope.venta.TipoPago = parseInt($scope.tipo_pago.selectedOption.id);
    $scope.venta.Estado = parseInt($scope.estado_venta.selectedOption.id);
    $scope.addVenta = function() {
        $scope.venta.TipoPago = parseInt($scope.tipo_pago.selectedOption.id);
        $scope.venta.Estado = parseInt($scope.estado_venta.selectedOption.id);
        $scope.venta.NroFactura = fVentas.ventas.length + 1;
        $scope.venta.Productos = $scope.variosproductos;
        console.log($scope.venta.Estado)
        if (parseInt($scope.estado_venta.selectedOption.id) == 0) {
            for (var index = 0; index < $scope.variosproductos.length; index++) {
                var prod = {};
                prod._id = $scope.variosproductos[index].Codigo;
                prod.EstadoStock = "2";
                console.log(prod)
                fStockProductos.transferencia(prod);
            }
        }
        console.log($scope.venta);
        fVentas.add($scope.venta);
        $scope.booladd=false;
        //$scope.showAddBtn = true;
        toastr.success('Venta realizada');
        //$scope.variosproductos = [];
    };
    $scope.listStockProducto = function() {
        tipocomun.getAll();
        fProductos.getAll();
        fClientes.getAll();
        fSucursales.getAll();
        Account.getProfile()
            .then(function(response) {
                $scope.user = response.data;
                $scope.venta.IdVendedor = $scope.user._id;
                $scope.venta.NombreVendedor = $scope.user.nombres + ' ' + $scope.user.apellidos;
            })

        fStockProductos.getAll()
            .then(function(response) {
                $scope.isProfileLoading = true;
                $scope.stockproductos=[];
                console.log($scope.stockproductos);
                $scope.stockproductos = fStockProductos.productos;
                $scope.totalItems = $scope.stockproductos.length;
                console.log($scope.stockproductos);
                $scope.isProfileLoading = false;
            })
            .finally(function() {

            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
        fVentas.getAll()
            .then(function(response) {
                $scope.isProfileLoading = true;
                $scope.ventas = fVentas.ventas;
                console.log(fVentas.ventas)
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
    $scope.cancelar = function() {
        $scope.variosproductos = [];
        $scope.venta = {};
        //toastr.warning('Proceso cancelado');
    }
    $scope.updVentaproducto = function() {
        $scope.venta.TipoPago = parseInt($scope.tipo_pago.selectedOption.id);
        $scope.venta.Estado = parseInt($scope.estado_venta.selectedOption.id);
        $scope.venta.Productos = $scope.variosproductos;
        console.log($scope.venta);
        fVentas.update($scope.venta)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.success('Venta Actualizada');
                $scope.isProfileLoading = false;
            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };
    $scope.delventaproducto = function(producto) {
        fVentas.delete(producto)
            .then(function(response) {
                $scope.isProfileLoading = true;
                toastr.warning('Venta Eliminada');
                $scope.isProfileLoading = false;
            })
            .catch(function(response) {
                $scope.isProfileLoading = false;
                toastr.clear();
                toastr.error(response.data.message, response.status);
            });
    };
    // funcion de angular
    $scope.actualizar = function(producto) {
        $scope.venta = producto;
        console.log($scope.venta);
        $scope.tipo_pago.selectedOption = $scope.tipo_pago.availableOptions[producto.TipoPago];
        $scope.estado_venta.selectedOption = $scope.estado_venta.availableOptions[producto.Estado];
        $scope.encabProd = "PRODUCTOS A SELECCIONAR";
        $scope.variosproductos = producto.Productos;
        console.log($scope.variosproductos)
        $scope.showtabla = true;
        $scope.booladd = false;
        $scope.boolupd = true;
        $scope.encabezado = "VENTA: " + $scope.venta.NroFactura;
    };
    $scope.agregar = function() {
        $scope.venta = {};
        $scope.variosproductos = [];
        $scope.listStockProducto();

        $scope.venta.Total = 0;
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        $scope.showCancelBtn = true;
        $scope.showtabla = true;
        $scope.encabezado = "NUEVA VENTA";
        $scope.encabProd = "AGREGAR PRODUCTO Y/O PRODUCTOS";
        $scope.boolupd = false;
        $scope.booladd = true;
    };
    $scope.eliminar = function(producto) {
        $scope.venta.Total = $scope.venta.Total - producto.PrecioTotal;
        var indice = $scope.variosproductos.indexOf(producto);
        $scope.variosproductos.splice(indice, 1);

        $scope.venta1 = {};
        toastr.warning('producto eliminado');
    };

    $scope.variacantidad = function(producto, cantidad) {
        if (cantidad <= producto.Stock) {
            toastr.success('Cantidad correcta');
        } else if (cantidad > producto.Stock) {
            toastr.warning('Agregue una cantidad menos al Stock');
        }
    }
    $scope.bloquear = function(producto) {
        if (producto.Stock == 1) {
            return true;
        }
    }
    $scope.modifprecio = function() {
        $scope.venta.Total = 0;
        for (var index = 0; index < $scope.variosproductos.length; index++) {
            var item = $scope.variosproductos[index];
            $scope.venta.Total = $scope.variosproductos[index].PrecioTotal + $scope.venta.Total;
        }
    }
    $scope.existe = function(id) {
        var si;
        if ($scope.variosproductos.length != 0) {
            for (var index1 = 0; index1 < $scope.variosproductos.length; index1++) {
                if ($scope.variosproductos[index1].Codigo == id) {
                    si = true;

                    break;
                }
            }
            return si;
        }
    }
    $scope.procesaProd = function(producto) {
        console.log(producto)
        $scope.venta1.Codigo = producto._id;
        $scope.venta1.CodProducto = producto.CodProducto;
        $scope.venta1.CodigoBarra = producto.CodigoBarra;
        $scope.venta1.Nombre = producto.Nombre;
        $scope.venta1.UMedida = producto.UMedida;
        $scope.venta1.PrecioUnitario = producto.PV;
        $scope.venta1.Cantidad = producto.Cantidad;
        $scope.venta1.PrecioTotal = $scope.venta1.PrecioUnitario * $scope.venta1.Cantidad;
        $scope.variosproductos.push($scope.venta1);
        $scope.venta.Total = $scope.venta.Total + $scope.venta1.PrecioTotal;

        $scope.venta1 = {};
        console.log($scope.variosproductos);
        toastr.success('Producto agregado');
    }

    $scope.vuelto = function(pago) {
        $scope.vueltoo = pago - $scope.venta.Total;
    }

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
    
    $scope.predicate = 'name';  
       $scope.reverse = true;  
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

    







    $scope.agregar();
    //$scope.listStockProducto();


    $('#addModal').click(function(e) {
        e.preventDefault();
        //addImage(5);
        //$('#addModal').modal('hide');
        $(this).tab('show')
            //return false;
    })


    $('body').on('hidden.bs.modal', function() {
        if ($('.modal.in').length > 0) {
            $('body').addClass('modal-open');
        }
    });

    //$('.selectpicker').selectpicker();


});