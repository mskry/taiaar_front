Royo.controller('SupplierRegistrationCtrl', ['$scope', 'services', 'factories', 'constants', '$rootScope', 'API', 'pagerService', '$translate',
    function ($scope, services, factories, constants, $rootScope, API, pagerService,$translate) {

        $scope.view = 0;
        $scope.dataLoaded = false;
        $scope.categories = [];
        $scope.subCategories = [];
        $scope.detSubCategories = [];
        $scope.supplier = {
            name: '',
            email: '',
            mobile: '',
            commission: '',
            address: '',
            latitude: 0,
            longitude: 0,
            self_pickup: 0,
            is_multibranch: 0,
            pickupCommision: '',
            gst_price: '',
            license_number: '',
            home_chef_orignal_name: '',
            home_address: '',
            license_issue_date: '',
            license_end_date: '',
            license_document: '',
            description: ''

        };
        $scope.message = '';
        $scope.mark_all = false;
        $scope.mark_all_sub = false;
        $scope.mark_all_det = false;
        $scope.invalid_phone_no = false;

        $scope.files = [];

        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.supplierTagsList = [];
        $scope.mark_all_tags = false;
        $scope.selectedTagList = [];
        $scope.address = '';


        $scope.zoneGeofenceList = [];
        $scope.mark_all_zones = false;
        $scope.selectedZoneList = [];


        $scope.multi_selector_delivery_mode_selector = [{
                id: 0,
                name: 'Delivery',
                status: false,
                validation_key: '!is_hide_delivery'
            },
            {
                id: 1,
                name: 'Self-PickUp',
                status: false,
                validation_key: '!is_hide_pickup'
            },
            {
                id: 2,
                name: 'Dine In',
                status: false,
                validation_key: ''
            }
        ]

        $scope.is_tnc_checked = false;

        var initialize_phone = function () {
            var input = document.querySelector("#supp_phone");
            if (!input) return;
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });
        }

        var initialize_address = function () {
            var input = document.getElementById('addressSearchTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function () {
                $scope.$apply(function () {
                    var place = autocomplete.getPlace();
                    $scope.supplier.latitude = place.geometry.location.lat();
                    $scope.supplier.longitude = place.geometry.location.lng();
                    $scope.supplier.address = place.formatted_address;
                });
            });
        }

        var initUpload = function () {
            var upload = document.getElementById('upload');

            function onFile() {
                var me = this;
                let reader = new FileReader();
                reader.readAsDataURL(upload.files[0]);
                reader.onload = function (e) {
                    $scope.$apply(function () {
                        let fileName = upload.files[0].name.replace(/.[^/.]+$/, '');
                        let isFileExist = !!$scope.files.find(file => file.name == fileName);
                        if (isFileExist) return;
                        $scope.files.push({
                            id: $scope.files.length,
                            name: fileName,
                            url: e.target.result,
                            path: upload.files[0]
                        });
                    });

                }
            }

            if (upload) {
                upload.addEventListener('dragenter', function (e) {
                    upload.parentNode.className = 'area dragging';
                }, false);

                upload.addEventListener('dragleave', function (e) {
                    upload.parentNode.className = 'area';
                }, false);

                upload.addEventListener('dragexit', function (e) {
                    onFile();
                }, false);

                upload.addEventListener('change', function (e) {
                    onFile();
                }, false);
            }
        }

        $scope.removeFile = function (fileId) {
            $scope.files = $scope.files.filter(file => file.id != fileId);
        }

        $scope.changeSelfPickup = function (is_self_pickup) {
            $scope.supplier.self_pickup = parseInt(is_self_pickup);
        }

        $scope.registerSupplier = function (addSupplierForm) {

            if (addSupplierForm.$submitted && addSupplierForm.$invalid) return;

            getMarkedCategories();

            if ($scope.iti.isValidNumber()) {
                $scope.invalid_phone_no = false;
            } else {
                $scope.invalid_phone_no = true;
                return;
            }

            if (!$scope.supplier.latitude || !$scope.supplier.longitude) {
                factories.invalidDataPop($translate.instant('Please choose a valid address'));
                return;
            }

            if (!$scope.selectedCategories.length && $scope.supplier_category_not_required == 1) {
                factories.invalidDataPop($translate.instant('Please select category'));
                return;
            }

            if ($rootScope.client_code == 'meezzaa_0687' && !$scope.files.length) {
                factories.invalidDataPop($translate.instant('Please upload documents'));
                return;
            }

            if (!$scope.is_tnc_checked) {
                factories.invalidDataPop($translate.instant('Please accept out terms and conditions!'));
                return;
            }

            var param_data = {};
            param_data.categoryIds = JSON.stringify($scope.selectedCategories);
            param_data.supplierName = $scope.supplier.name;
            param_data.supplierAddress = $scope.supplier.address;
            param_data.supplierMobileNo = $scope.supplier.mobile;
            param_data.supplierEmail = $scope.supplier.email;
            param_data.latitude = $scope.supplier.latitude;
            param_data.longitude = $scope.supplier.longitude;
            param_data.is_multibranch = $scope.supplier.is_multibranch;
            param_data.self_pickup = $scope.supplier.self_pickup;

            param_data.supplier_tags = $scope.selectedTagList;
            param_data.geofence_ids = $scope.selectedZoneList;


            if (['rajatcustom_0723', 'yourbutler_0029'].includes($rootScope.client_code)) {
                param_data.description = $scope.supplier.description;
            }



            if ($scope.supplier.gst_price) param_data.gst_price = $scope.supplier.gst_price;

            let phone_data = $scope.iti.getSelectedCountryData();
            if (!!phone_data) {
                param_data['iso'] = phone_data['iso2'];
                param_data['country_code'] = phone_data['dialCode'];
            }

            param_data.documents = [];
            if ($scope.files && $scope.files.length) {
                $scope.files.forEach(function (file) {
                    param_data.documents.push(file.path);
                })
            }


            if ($rootScope.enable_additional_registration_info == 1) {
                param_data.home_chef_orignal_name = $scope.supplier.home_chef_orignal_name;
                param_data.home_address = $scope.supplier.home_address;
                param_data.license_issue_date = $scope.supplier.license_issue_date.getDate() + "-" +
                    ($scope.supplier.license_issue_date.getMonth() + 1) + "-" + $scope.supplier.license_issue_date.getFullYear();
                param_data.license_end_date = $scope.supplier.license_end_date.getDate() + "-" +
                    ($scope.supplier.license_end_date.getMonth() + 1) + "-" + $scope.supplier.license_end_date.getFullYear()
                param_data.license_document = $scope.supplier.license_document;
                param_data.license_number = $scope.supplier.license_number;
            }

            if ($rootScope.multi_selector_delivery_mode_selector_with_dine_in == 1) {
                let delivery = $scope.multi_selector_delivery_mode_selector.find(item => item.name == 'Delivery')
                let selfPickUp = $scope.multi_selector_delivery_mode_selector.find(item => item.name == 'Self-PickUp')
                let dineIn = $scope.multi_selector_delivery_mode_selector.find(item => item.name == 'Dine In')

                param_data.is_dine_in = dineIn.status ? 1 : 0
                if (!selfPickUp.status && !delivery.status && $rootScope.multi_selector_delivery_mode_selector_with_dine_in == 1) {
                    factories.warningDataPop($translate.instant('Please Select atleast one option from Delivery or Self-PickUp'));
                    return;
                }
                param_data.self_pickup = selfPickUp.status && delivery.status ? 2 : selfPickUp.status ? 1 : 0
            }
            if ([0,1].includes($rootScope.is_pickup)) {
                param_data.self_pickup = $rootScope.is_pickup
            }

            services.supplierRegistertion($scope, param_data, function (response) {
                // $scope.message = `${factories.localisation().supplier} Successfully Registered`;
                // services.SUCCESS_MODAL(true);
                $scope.view = 1;
                $scope.is_blocked = false;
                $scope.is_add = false;
            });
        }

        $scope.refresh = function () {
            $scope.skip = 0;
            $scope.order_by = 0;
            $scope.is_desc = 0;
            $scope.getRegSuppliers(1);
        }

        $scope.categoryData = [];
        $scope.categories = [];
        $scope.selectedCategories = [];

        var markCat = function (cat, state) {
            if (cat.sub_category && (cat.sub_category).length) {
                (cat.sub_category).map(cat => {
                    cat['checked'] = state;
                    markCat(cat, state);
                });
            }
        }

        var getCategories = function () {
            let params = {};
            params.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
            services.GET_DATA(params, API.CATEGORY_LIST(), function (response) {
                if (response.data.length) {
                    $scope.categories = response.data;
                    $scope.categories.map((cat, index) => {
                        if (cat.id == 1) {
                            $scope.categories.splice(index, 1);
                        }
                        cat['checked'] = false;
                        markCat(cat, false);
                    });
                    $scope.categoryData = [{
                        arr: $scope.categories,
                        mark_all: false
                    }];
                }
            });
        };


        var getSupplierTags = function (page) {
            var data = {
                limit: $scope.limit,
                skip: $scope.skip,
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_SUPPLIER_TAG_LIST, function (response) {
                $scope.dataLoaded = true;
                if (response) {
                    $scope.supplierTagsList = response.data.list;
                    $scope.count = response.data.count;
                    $scope.supplierTagsList.forEach(element => {
                        element['checked'] = false;
                    });
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        };



        $scope.changePhone = function (phone) {
            if ($scope.iti.isValidNumber()) {
                $scope.invalid_phone_no = false;
            } else {
                $scope.invalid_phone_no = true;
            }
        }

        $scope.$on('settingsLoaded', load);

        function load($event, data) {
            if (data) {
                $scope.localisation = factories.localisation();
                $scope.app_type = factories.getSettings().screenFlow[0].app_type;
                getSupplierTags();
                getCategories();
                var time = setInterval(() => {
                    if ($rootScope.show_login) {
                        initialize_address();
                        initialize_phone();
                        initUpload();
                        clearInterval(time);
                    }
                }, 1000);
            }
        }

        $scope.viewSubCat = function (parentIndex, category) {
            $scope.categoryData.splice(parentIndex + 1, $scope.categoryData.length);
            if (category.sub_category && (category.sub_category).length) {
                $scope.categoryData.push({
                    arr: category.sub_category,
                    mark_all: false,
                    category: category
                });
            }
        }

        $scope.selectCat = function (category) {
            category.checked = !category.checked;
            if (!category.checked && !!category.sub_category && category.sub_category.length) {
                (category.sub_category).forEach(cat => {
                    cat['checked'] = false;
                    markCat(cat, false);
                });
            }
        }

        var makeDataArr = function (cat, selectedCat) {
            if (cat.sub_category && (cat.sub_category).length) {
                (cat.sub_category).map((cat) => {
                    if (cat.checked) {
                        selectedCat.data.push({
                            id: cat.id,
                            data: []
                        });
                        (selectedCat.data).forEach(el => {
                            makeDataArr(cat, el);
                        });
                    }
                });
            }
        }

        var getMarkedCategories = function () {
            $scope.selectedCategories = [];
            $scope.categories.map((cat) => {
                if (cat.checked) {
                    $scope.selectedCategories.push({
                        id: cat.id,
                        data: []
                    });
                    $scope.selectedCategories.forEach(el => {
                        makeDataArr(cat, el);
                    });
                }
            });
        }

        $scope.markAll = function (index) {
            if ($scope.categoryData[index]) {
                $scope.categoryData[index].mark_all = !$scope.categoryData[index].mark_all;
                $scope.categoryData[index].arr.forEach(cat => {
                    cat.checked = $scope.categoryData[index].mark_all;
                    markCat(cat, $scope.categoryData[index].mark_all);
                });
            }
        }


        $scope.chooseMode = function (mode) {
            $scope.multi_selector_delivery_mode_selector[mode.id].status = !$scope.multi_selector_delivery_mode_selector[mode.id].status
          }



        $scope.uploadImage = function (file, callback) { // Get Image Url
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

        $scope.file_to_upload_for_image_license = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadImage(File[0], function (err, imageUrl) {
                                $scope.supplier.license_document = imageUrl;
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


        $scope.selectTag = function (tag) {
            tag.checked = !tag.checked;
            var findTag = $scope.supplierTagsList.find(x => x.id == tag.id);
            $scope.supplierTagsList.forEach(element => {
                if (element.id == findTag.id) {
                    element['checked'] = tag.checked;
                    if (tag.checked) {
                        $scope.selectedTagList.push(findTag.id);
                    } else {
                        const index = $scope.selectedTagList.indexOf(findTag.id);
                        if (index > -1) {
                            $scope.selectedTagList.splice(index, 1);
                        }
                    }
                }
            });
        }

        $scope.markAllTags = function (index) {
            if (!$scope.mark_all_tags) {
                $scope.selectedTagList = [];
                $scope.supplierTagsList.forEach(element => {
                    element['checked'] = true;
                    $scope.selectedTagList.push(element.id);
                });
                $scope.mark_all_tags = true;
            } else {
                $scope.supplierTagsList.forEach(element => {
                    element['checked'] = false;
                });
                $scope.selectedTagList = [];
                $scope.mark_all_tags = false;
            }
        }



        var getZoneGeofence = function (page) {
            var data = {
                // limit: $scope.limit,
                skip: $scope.skip,
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_LIST_ZONE_GEOFENCE, function (response) {
                $scope.dataLoaded = true;
                if (response) {
                    $scope.zoneGeofenceList = response.data.list;
                    $scope.count = response.data.count;
                    $scope.zoneGeofenceList.forEach(element => {
                        element['checked'] = false;
                    });
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        };

        if (factories.getSettings().key_value.enable_zone_geofence && (JSON.parse(factories.getSettings().key_value.enable_zone_geofence == 1)))
            getZoneGeofence();

        $scope.selectZone = function (zone) {
            zone.checked = !zone.checked;
            var findZone = $scope.zoneGeofenceList.find(x => x.id == zone.id);
            $scope.zoneGeofenceList.forEach(element => {
                if (element.id == findZone.id) {
                    element['checked'] = zone.checked;
                    if (zone.checked) {
                        $scope.selectedZoneList.push(findZone.id);
                    } else {
                        const index = $scope.selectedZoneList.indexOf(findZone.id);
                        if (index > -1) {
                            $scope.selectedZoneList.splice(index, 1);
                        }
                    }
                }
            });
        }

        $scope.markAllZone = function (index) {
            if (!$scope.mark_all_zones) {
                $scope.selectedZoneList = [];
                $scope.zoneGeofenceList.forEach(element => {
                    element['checked'] = true;
                    $scope.selectedZoneList.push(element.id);
                });
                $scope.mark_all_zones = true;
            } else {
                $scope.zoneGeofenceList.forEach(element => {
                    element['checked'] = false;
                });
                $scope.selectedZoneList = [];
                $scope.mark_all_zones = false;
            }
        }



        $scope.acceptTnC = function (event) {
            if (event.target.checked) {
                $scope.is_tnc_checked = true;
            } else {
                $scope.is_tnc_checked = false;
            }
        }


    }
]);