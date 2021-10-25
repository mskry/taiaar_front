Royo.controller('SalesRecordCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories', '$window',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories, $window) {


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.salesRecordList = [];
        $scope.dataLoaded = false;
        $scope.totalAmount = 0
        $scope.totalRefundableAmount = 0

        $scope.selectedOrderWeight = {};
        $scope.is_updating = false;
        $scope.selected_supplier = {}
        $scope.filter = {
            supplier: '',
            startDate: '',
            endDate: ''
        };

        var datepicker = function () {
            setTimeout(() => {
              var picker = new Lightpick({
                field: document.getElementById("datepicker_statement"),
                singleDate: false,
                onSelect: function (start, end) {
                  if (start && end) {
                    $scope.filter.startDate = start.format('YYYY-MM-DD');
                    $scope.filter.endDate = end.format('YYYY-MM-DD');
                  }
                }
              });
            }, 500);
          }
          datepicker();

          
        var getDailySalesRecord = function (page) {
            var param_data = {
                limit: 20,
                skip: 0,
                date: moment(new Date()).format("YYYY-MM-DD"),
                is_download: 0
            }
            if ($scope.filter.supplier) {
                param_data.supplier_id = $scope.filter.supplier
            }
            $scope.dataLoaded = false;

            services.GET_DATA(param_data, API.DAILY_SALES_RECORD(), function (response) {
                if (response) {
                    $scope.totalAmount = 0
                    $scope.totalRefundableAmount = 0
                    $scope.salesRecordList = response.data.list;
                    // $scope.salesRecordList.forEach(order => {
                    //     $scope.totalAmount = $scope.totalAmount + order.net_amount
                    //     if (order.status == 8) {
                    //         $scope.totalRefundableAmount = $scope.totalRefundableAmount + order.net_amount
                    //     }
                    // })

                    $scope.totalAmount = response.data.total_receivable_amount
                    $scope.totalRefundableAmount = response.data.total_refundable_amount
                    $scope.balanceAmount = response.data.balance_amount
                    $scope.count = response.data.count;
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                    $scope.dataLoaded = true;
                }
            });

        }
        if($rootScope.profile === 'SUPPLIER') {
            getDailySalesRecord(1);
        }

        var getHomeData = function () {
            let params = {
                limit: 0,
                offset: 0,
                is_active: 1,
                search: '',
                is_desc: 0,
                order_by: 0,
            }

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                params.country_code = country_data[0];
                params.country_code_type = country_data[1];
            }
            services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
                $scope.suppliers = response.data.suppliersList;
                $scope.filter.supplier = $scope.suppliers[0].id;
                $scope.selected_supplier = $scope.suppliers[0]
            getDailySalesRecord(1);

            });
        };

        if ($rootScope.profile === 'ADMIN') {
            getHomeData();
        }

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getDailySalesRecord(page);
        }


        $scope.downloadCSV = function () {
            var param_data = {
                limit: 20,
                skip: 0,
                date: moment(new Date()).format("YYYY-MM-DD"),
                is_download: 1
            }
            $scope.dataLoaded = false;
            services.GET_DATA(param_data, API.DAILY_SALES_RECORD, function (response) {
                let dwnld_link = response.data.csvFileLink ? response.data.csvFileLink : response.data.list;
                services.DOWNLOAD_CSV(dwnld_link, 'sales');
            });
        };

        $scope.changeSupplier = function (supplier) {
            $scope.filter.supplier = supplier.id;
        }
        $scope.resetFilter = function () {
            $window.location.reload();
        };


        $scope.selectFilter = function () {
            $scope.skip = 0;
            getDailySalesRecord(1);
        };

    }
]);