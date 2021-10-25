Royo.controller('paymentSuccessCtrl', ['$scope', 'services', '$stateParams', 'API', 'constants', '$rootScope', '$location',
    function ($scope, services, $stateParams, API, constants, $rootScope, $location) {

        $scope.selectedPlan = {}
        $scope.payment_source
        var purchasePlan = function() {

            const params = {
                plan_id: $scope.selectedPlan.id,
                current_period_start: new Date().getTime().toString(),
                current_period_end: new Date(moment().add(1, $scope.selectedPlan.type)).getTime().toString(),
                payment_source: $scope.payment_source,
                supplier_id: $rootScope.active_supplier_id,
                reciept_url: $scope.payment_source == 'knet' ? $scope.urlData.tranid : $scope.urlData.ref_id
            }

            services.POST_DATA(params, API.SUPPLIER_BUY_SUBSCRIPTION, function (response) {
                if(response && response.data) {
                    localStorage.removeItem('selectedPlan')
                    localStorage.removeItem('selectedPaymentSource')
                }

            })
        }

        if ($stateParams) {
            let data = {
                ...$location.search()
            }
            $scope.urlData = data
            console.log($scope.urlData)
            $scope.selectedPlan = localStorage.getItem('selectedPlan')
            $scope.payment_source = JSON.parse(localStorage.getItem('selectedPaymentSource'))

            if($scope.selectedPlan) {
                $scope.selectedPlan = JSON.parse($scope.selectedPlan)
            }
            // purchasePlan()

        }


    }])