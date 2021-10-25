Royo.controller('StatementAccountPayableCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', '$window',
  function ($scope, $rootScope, constants, services, API, pagerService, $window) {

    $rootScope.active_account_tab = 1;

    $scope.filter = {
      supplier: '',
      startDate: '',
      endDate: ''
    };
    $scope.suppliers = [];
    $scope.statement_data = [];
    $scope.selected_supplier;
    $scope.dataLoaded = false;
    $scope.search = '';
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.count = 0;

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

    var getAccountStatementData = function (page) {

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 41;
      param_data.supplier = $scope.filter.supplier;
      if ($scope.filter.startDate) {
        param_data.startDate = $scope.filter.startDate;
      }
      if ($scope.filter.endDate) {
        param_data.endDate = $scope.filter.endDate;
      }
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.search = ($scope.search).trim() ? $scope.search : '';
           
      if(!!localStorage.getItem('data_country')){
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }
      $scope.dataLoaded = false;

      services.POST_DATA(param_data, API.ACCOUNT_STATEMENT_LIST(), function (response) {
        let data = response.data;
        $scope.statement_data = data.statement;
        $scope.count = data.count;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });
    };

    //Call Get Home Page Data Service
    var getHomeData = function () {
      let params = {
        limit: 0,
        offset: 0,
        is_active: 1,
        search: '',
        is_desc: 0,
        order_by: 0
      }
            
      if(!!localStorage.getItem('data_country')){
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }

      services.GET_DATA(params, API.AGENT_SUPPLIER_LISTING, function (response) {
        $scope.suppliers = response.data.suppliersList;
        if ($scope.suppliers.length != 0) {
          getAccountStatementData(1);
        }
      });
    };

    $scope.searchOrder = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.skip = 0;
        getAccountStatementData(1);
      }
    }

    if ($rootScope.profile === 'ADMIN') {
      getHomeData();
    } else {
      $scope.filter.supplier = $rootScope.active_supplier_id;
      getAccountStatementData(1);
    }

    $scope.changeSupplier = function (supplier) {
      $scope.filter.supplier = supplier.id;
    }

    $scope.resetFilter = function () {
      $window.location.reload();
    };

    $scope.selectFilter = function () {
      $scope.skip = 0;
      getAccountStatementData(1);
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getAccountStatementData(page);
    }

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 41;
      param_data.supplier = $scope.filter.supplier;
      if ($scope.filter.startDate) {
        param_data.startDate = $scope.filter.startDate;
      }
      if ($scope.filter.endDate) {
        param_data.endDate = $scope.filter.endDate;
      }
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.search = ($scope.search).trim() ? $scope.search : '';
      param_data.is_download = 1;
               
      if(!!localStorage.getItem('data_country')){
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }
      services.POST_DATA(param_data, API.ACCOUNT_STATEMENT_LIST(), function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'statement');
      });
    };

  }]);
