angular.module('MyApp')
    .controller('CtrlReportes', function($scope, $state, fStockProductos, fVentas, Account, fProveedores, fSucursales, fProductos, toastr) {
        $scope.mostrar = false;

        $scope.listartodo = function() {
            fProductos.getAll()
                .then(function(response) {
                    $scope.productos = fProductos.productos;
                })
            Account.getProfile()
                .then(function(response) {
                    $scope.user = response.data;
                })
            fVentas.getAll()
                .then(function(response) {
                    $scope.ventas = fVentas.ventas;
                })
            fProveedores.getAll()
                .then(function(response) {
                    $scope.proveedores = fProveedores.proveedores;
                })
            fSucursales.getAll()
                .then(function(response) {
                    $scope.sucursales = fSucursales.sucursales;
                })
            fStockProductos.getAll()
                .then(function(response) {

                })
        }
        $scope.select_sucursal = {
            availableOptions: fSucursales.sucursales
        }
        $scope.select_producto = {
            availableOptions: fProductos.productos
        }
        $scope.cabecera_stockproducto = ['Codigo Barra', 'Fecha', 'Producto', 'Stock', ' U. Medida'];
        $scope.stocks = [];
        $scope.stockxsuc = function(id) {

            $scope.mostrar = true;
            var cont1 = 0,
                cont2 = 0,
                cont3 = 0;
            fStockProductos.getprodxsucursal(id)
                .then(function(response) {
                    $scope.stocks = response.data;
                    $scope.pastelstock(cont1, cont2, cont3);
                    console.log(response.data);
                    console.log(fStockProductos.productos);
                })
        }
        $scope.pastelstock = function(cont1, cont2, cont3) {
            for (var indice = 0; indice < $scope.stocks.length; indice++) {
                if ($scope.stocks[indice].EstadoStock == 0) {
                    cont1 = cont1 + 1;
                }
            }
            for (var indice = 0; indice < $scope.stocks.length; indice++) {
                if ($scope.stocks[indice].EstadoStock == 1) {
                    cont2 = cont2 + 1;
                }
            }
            for (var indice = 0; indice < $scope.stocks.length; indice++) {
                if ($scope.stocks[indice].EstadoStock == 2) {
                    cont3 = cont3 + 1;
                }
            }

            $scope.myJson = {
                globals: {
                    shadow: false,
                    fontFamily: "Verdana",
                    fontWeight: "100"
                },
                type: "pie",
                backgroundColor: "#fff",
                legend: {
                    layout: "x5",
                    position: "-20%",
                    borderColor: "transparent",
                    marker: {
                        borderRadius: 10,
                        borderColor: "transparent"
                    }
                },
                tooltip: {
                    text: "%v productos"
                },
                plot: {
                    refAngle: "-90",
                    borderWidth: "0px",
                    valueBox: {
                        placement: "in",
                        text: "%npv %",
                        fontSize: "15px",
                        textAlpha: 1,
                    }
                },
                series: [{
                    text: "Productos activos",
                    values: [cont1],
                    backgroundColor: "#28C2D1",
                }, {
                    text: "Productos por Confirmar",
                    values: [cont2],
                    backgroundColor: "#F1C795 #feebd2"
                }, {
                    text: "Productos Vendidos",
                    values: [cont3],
                    backgroundColor: "#FDAA97 #FC9B87"
                }]
            };
        }



        $scope.listartodo();
    })