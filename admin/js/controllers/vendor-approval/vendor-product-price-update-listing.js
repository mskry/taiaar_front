Royo.controller('VendorProductPriceUpdateListingCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.vendorUpdateList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';
        $scope.selectedProduct = {}

        $scope.selectedOrderWeight = {};
        $scope.is_updating = false;

        var getProductPriceUpdateList = function (page) {
            $stateParams
            var data = {
                limit: $scope.limit,
                skip: $scope.skip
            };
            var api = API.PRODUCT_PRICE_UPDATION_REQUESTS;
            // if ($stateParams.productId) {
            //     data['product_id'] = $stateParams.productId;
            //     api = API.PRODUCT_UPDATION_REQUESTS_BY_PRODUCT_ID;
            // }
            $scope.dataLoaded = false;
            services.GET_DATA(data, api, function (response) {
                $scope.vendorUpdateList = response.data.list;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getProductPriceUpdateList(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getProductUpdateList(page);
        }


        $scope.approveRejectUpdation = function (data, status) {
            var obj = {
                updationRequestId: data.id,
                update_request_approved: status
            }
            services.POST_DATA(obj, API.APPROVE_PRICE_UPDATION_REQUEST, function (response) {
                getProductPriceUpdateList(1);
                $scope.message = 'Updation Request Approved';
            $("#view_price_change_diff").modal('hide');
                services.SUCCESS_MODAL(true);
                $scope.dataLoaded = true;
            });
        }
        $scope.refresh = function() {
            $scope.skip = 0;
            $scope.currentPage = 1;
            getProductPriceUpdateList(1);
        }

        $scope.viewChanges = function(product) {
            $scope.selectedProduct = product
            $("#view_price_change_diff").modal('show');
        }


    }]);
