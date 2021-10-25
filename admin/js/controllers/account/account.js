Royo.controller('AccountCtrl', ['$scope', '$rootScope', 'factories',
  function ($scope, $rootScope, factories) {
    $rootScope.active_account_tab = factories.getSettings().screenFlow[0].is_single_vendor == 1 ? 3 : 1;

    console.log($rootScope.active_account_tab)
    $scope.changeTab = function(tab) {
      $rootScope.active_account_tab = tab;
    }
  }]);