Royo.controller('RatingsCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
        $rootScope.active_rating_tab = 1;

        $scope.changeTab = function (tab) {
            $rootScope.active_rating_tab = tab;
        }
    }]);
