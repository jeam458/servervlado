angular.module('MyApp')
    .controller('DashboardCtrl', function ($scope, $auth, toastr,Account) {
        /**
         * Sidebar Toggle
         */
        $scope.mostrar=true;
        $scope.getProfile = function() {
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
                .catch(function(response) {
                    toastr.clear();
                    toastr.error(response.data.message, response.status);
                });      
        };
        
        var mobileView = 992;
        
        $scope.getWidth = function () {
            return window.innerWidth;
            
        };

        $scope.getProfile();
        
        

        $scope.$watch($scope.getWidth, function (newValue, oldValue) {
            if (newValue >= mobileView) {
                    $scope.toggle = true;
            } else {
                $scope.toggle = false;
            }

        });

        $scope.toggleSidebar = function () {
            $scope.toggle = !$scope.toggle;
        };

        window.onresize = function () {
            $scope.$apply();
        };

    });