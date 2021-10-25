Royo.controller('AgentLoyalityCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {

        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.agentLoyalityList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';
        $scope.agent_loyality = {
            description: '',
            name: '',
            commission: '',
            image: '',
            id: 0
        }

        $scope.selectedAgentLoyality = {};
        $scope.is_updating = false;

        var getAgentLoyalityList = function (page) {
            var data = {
                limit: $scope.limit,
                offset: $scope.skip
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.AGENT_LOYALITY_LIST, function (response) {
                $scope.agentLoyalityList = response.data.levelData;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getAgentLoyalityList(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getAgentLoyalityList(page);
        }





        $scope.file_to_upload_for_image = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadImage(File[0], function (err, imageUrl) {
                                $scope.agent_loyality.image = imageUrl;
                            })
                        });
                    }
                } else {
                    factories.invalidDataPop("Image size must be less than 1mb");
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };
        $scope.uploadImage = function (file, callback) {     // Get Image Url
            if (!file) {
                return callback(null, file)
            }

            const data = {
                'file': file
            }

            services.POST_FORM_DATA(data, API.UPLOAD_IMAGE, (response) => {
                if (response && response.data) {
                    return callback(null, response.data)
                }
            })
        }


        $scope.changeView = function () {
            emptyModel();
        }


        $scope.addAgentLoyality = function (addAgentLoyalityForm) {
            debugger
            if (addAgentLoyalityForm.$invalid) return;
            var addParams = {};
            addParams.name = $scope.agent_loyality.name;
            addParams.description = $scope.agent_loyality.description;
            addParams.commission = $scope.agent_loyality.commission;
            addParams.image = $scope.agent_loyality.image;

            if ($scope.is_updating) {
                addParams.id = $scope.selectedAgentLoyality.id;
                updateAgentLoyality(addParams, addAgentLoyalityForm);
            }
            else {
                createAgentLoyality(addParams, addAgentLoyalityForm);
            }


        }

        var createAgentLoyality = function (addParams, form) {
            services.POST_DATA(addParams, API.AGENT_LOYALITY_CREATE, function (response) {
                afterSave(form);
            });
        }
        var updateAgentLoyality = function (addParams, form) {
            debugger
            services.POST_DATA(addParams, API.AGENT_LOYALITY_UPDATE, function (response) {
                afterSave(form);
            });
        }

        var afterSave = function (form) {
            $scope.is_updating = false;
            $scope.dataLoaded = true;
            $("#addAgentLoyalityRef").modal('hide');
            getAgentLoyalityList(1);
            $scope.message = `Agent loyality has been saved!`;
            emptyModel();
            form.$submitted = false;
            services.SUCCESS_MODAL(true);
        }

        var emptyModel = function () {
            $scope.is_updating = false;
            $scope.agent_loyality = {
                description: '',
                name: '',
                commission: '',
                image: '',
                id: 0
            }
        }


        $scope.deleteAgentLoyality = function (data) {
            var data = {
                id: data.id
            }
            services.POST_DATA(data, API.AGENT_LOYALITY_DELETE, function (response) {
                getAgentLoyalityList(1);
                $scope.dataLoaded = true;
                $scope.message = `Loyality has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.onUpdateAgentLoyality = function (data) {
            $scope.selectedAgentLoyality = data;
            $scope.is_updating = true;
            $scope.agent_loyality = Object.assign({}, $scope.selectedAgentLoyality);
            $("#addAgentLoyalityRef").modal('show');
        }


    }]);
