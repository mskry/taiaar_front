Royo.controller('VendorOrderCreationCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories', '$state',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories, $state) {

        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.dataLoaded = false;
        $scope.supplier_id = '';


        $scope.selected_cat = {};
        $scope.product = {};

        $scope.order_id = 0;
        $scope.users = []
        $scope.selected_user = ''


        $scope.pick_up_location = {
            lat: 0,
            lng: 0,
            address: ''
        };
        $scope.drop_off_location = {
            lat: 0,
            lng: 0,
            address: ''
        };

        $scope.user_info = {
            name: '',
            email: '',
            phone: '',
            price: 0,
            description: ''
        }
        $scope.supplier_id = $rootScope.active_supplier_id || $stateParams.id;
        $scope.expectedDeliveryCharges = 0

        $scope.address_model = {
            name: '',
            houseNo : '',
            addressLineFirst : '',
            latitude : '',
            longitude : '',
            phone_number : '',
        }


        var initialize = function () {
            var input = document.querySelector("#sup_phone");
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });

            var input = document.getElementById('searchTextField_Pickup');

            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
                $scope.pick_up_location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    address: place.formatted_address
                }
            });
        }
        var initialize1 = function () {
            var input = document.querySelector("#sup_phone");
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });

            var input1 = document.getElementById('searchTextField_DropOff');
            var autocomplete1 = new google.maps.places.Autocomplete(input1);
            autocomplete1.addListener('place_changed', function () {
                var place = autocomplete1.getPlace();
                $scope.drop_off_location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    address: place.formatted_address
                }
               
            });
        }

        var initializeUserAdd = function () {
            // var input = document.querySelector("#user_phone");
            // $scope.iti = window.intlTelInput(input, {
            //     preferredCountries: [factories.getSettings().adminDetails[0].iso]
            // });

            var input1 = document.getElementById('user_address');
            var autocomplete1 = new google.maps.places.Autocomplete(input1);
            autocomplete1.addListener('place_changed', function () {
                var place = autocomplete1.getPlace();
                $scope.address_model = {
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                    addressLineFirst: place.formatted_address
                }
                console.log($scope.address_model)
                // if ($scope.selected_vehicle_cat) {
                //     $scope.fetchDelivryCharges()
                // }
            });
        }
        
        setTimeout(() => {
            initialize();
            initialize1();
        }, 1000);


        $scope.register_user = {
            "first_name": "",
            "last_name": "",
            "mobileNumber": "",
            "email": "",
            "deviceToken": "",
            "deviceType": "0",
            "languageId": 14,
            "latitude": 30.7333148,
            "longitude": 76.7794179,
            "address": '',
            "countryCode": "",
            "password": "12345",
            "dateOfBirth": ""
        }


        $scope.add_to_cart = {
            "deviceId": "0",
            "productList": [{
                "handling_admin": 0,
                "handling_supplier": 0,
                "price_type": 0,
                "supplier_branch_id": 0,
                "supplier_id": 0,
                "quantity": 1,
                "productId": "0",
                "category_id": 0,
                "agent_type": 1,
                "price": 0,
                "perProductLoyalityDiscount": 0,
                "duration": 0,
                "freeQuantity": 0,
                "delivery_charge": 0,
                "agentBufferPrice": 0
            }, ],
            "promoationType": "0",
            "remarks": "0",
            "supplierBranchId": 0,
            "supplier_id": 0,
            "cartId": "0",
            "accessToken": "",
            "latitude": 30.7333148,
            "longitude": 76.7794179,
            "questions": [],
            "addOn": 0,
            "order_time": moment().format('HH:mm:ss'),
            "order_day": 1,
            "adds_on": [],
            "variants": []
        }


        $scope.update_cart = {
            "currencyId": "1",
            "netAmount": 0,
            "deliveryId": 0,
            "languageId": 14,
            "minOrderDeliveryCrossed": 0,
            "handlingSupplier": "0",
            "handlingAdmin": "0",
            "delivery_max_time": "0",
            "deliveryDate": "",
            "deliveryTime": "",
            "day": 2,
            "deliveryCharges": "",
            "urgentPrice": "0",
            "deliveryType": "0",
            "cartId": 0,
            "accessToken": "",
            "questions": [],
            "addOn": 0,
            "liquor_bottle_deposit_tax": 0,
            "liquor_plt_deposit_tax": 0
        }

        $scope.generate_order = {
            "cartId": 0,
            "languageId": 14,
            "isPackage": "0",
            "paymentType": "0",
            "accessToken": "",
            "offset": moment().format('Z'),
            "self_pickup": 0,
            "type": 1,
            "payment_after_confirmation": 1,
            "order_source": 2,
            "no_touch_delivery": 0,
            "currency": "USD",
            "order_time": moment().format('HH:mm:ss'),
            "order_day": 0,
            "date_time": new Date().toLocaleTimeString(),
            "duration": 0,
            "use_refferal": 0,
            "user_service_charge": 0,
            "have_coin_change": "0"
        }


        $scope.changeView = function (t) {

        }


        var getSupplierInfo = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 30;
            param_data.supplierId = $scope.supplier_id;

            services.POST_DATA(param_data, API.GET_SUPPLIER_INFO_TAB_DATA(), function (response) {
                let supplierData = response.data;
                $rootScope.supplierData = supplierData[0];
                $scope.is_multi_branch = supplierData[0].is_multibranch;
                $scope.branch_id = supplierData[0].default_branch_id;
                getSupplierProducts();
            });
        }

        var getCategories = function () {
            let params = {
                supplier_id: $rootScope.active_supplier_id || $stateParams.id
            };
            params.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
            services.GET_DATA(params, API.CATEGORY_LIST(), function (data) {
                let categories = data.data;
                if (categories.length) {
                    $scope.selected_cat = categories[0];
                    getSupplierInfo();
                }
            });
        };


        var getSupplierProducts = function () {
            var param_data = {};
            param_data['supplierId'] = $rootScope.active_supplier_id || $stateParams.id;
            $scope.is_product = true;
            param_data.section_id = 30;
            param_data.categoryId = $scope.selected_cat.id;
            param_data.limit = 10;
            param_data.offset = 0;
            param_data.serachText = '';
            param_data.serachType = 0;

            $scope.dataLoaded = false;
            param_data['branchId'] = $scope.branch_id;
            param_data.detailedSubCategoryId = param_data.categoryId;
            param_data.subCategoryId = param_data.categoryId;
            services.listSupBranchProducts($scope, param_data, function (data) {
                if (data) {
                    $scope.product = data.products[0];
                }
                $scope.dataLoaded = true;
            });
        }

        getCategories();

        var getVehicleCatList = function () {
            var data = {};
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.LIST_VEHICLE_CATEGORY, function (response) {
                $scope.vehicleCatList = response.data;
                $scope.dataLoaded = true;
            });
        };
        getVehicleCatList()

        $scope.onSelectAgentVehicle = function (vehicle) {
            $scope.selected_vehicle_cat = vehicle
            if ($scope.drop_off_location.lat && $scope.drop_off_location.lng) {
                $scope.fetchDelivryCharges()
            }
        }

        $scope.fetchDelivryCharges = function () {
            const payload = {}
            payload.product_ids = [$scope.product.id]
            payload.latitude = $scope.drop_off_location.lat;
            payload.longitude = $scope.drop_off_location.lng;
            payload.vehicle_cat_id = $scope.selected_vehicle_cat

            services.POST_DATA(payload, API.CHECK_PRODUCT_LIST, function (response) {
                if ($rootScope.enable_base_delivery_charge_on_vehicle_cat == 1) {
                    $scope.expectedDeliveryCharges = response.data.estimated_delivery_charge
                }
            })
        }



        $scope.addNewUserSubmit = function (form) {
            if (form.$invalid) return;
            if ($scope.add_to_cart.accessToken && $scope.add_to_cart.id && $scope.update_cart.deliveryId) {
                $scope.addToCart()
            } else if ($scope.add_to_cart.accessToken && $scope.add_to_cart.id && !$scope.update_cart.deliveryId) {
                factories.invalidDataPop('Please Select a valid Address');
                return false;
                // $scope.addNewAddress()
            } else {
                $scope.register_user.first_name = $scope.user_info.name;
                $scope.register_user.last_name = $scope.user_info.name;
                $scope.register_user.email = $scope.user_info.email;
                $scope.register_user.mobileNumber = $scope.user_info.phone;
                $scope.register_user.latitude = $scope.drop_off_location.lat;
                $scope.register_user.longitude = $scope.drop_off_location.lng;
                $scope.register_user.address = $scope.drop_off_location.address;
                let phone_data = $scope.iti.getSelectedCountryData();
                if (!!phone_data) {
                    $scope.register_user.countryCode = phone_data['dialCode'];
                }
                $scope.dataLoaded = true;
                services.POST_DATA($scope.register_user, API.USER_REGISTER, function (response) {
                    if (response) {
                        $scope.dataLoaded = false;
                        $scope.add_to_cart.accessToken = response.data.access_token;
                        $scope.add_to_cart.id = response.data.userId;
                        $scope.add_to_cart.supplierBranchId = $scope.branch_id;
                        $scope.add_to_cart.supplier_id = $scope.supplier_id;
                        $scope.add_to_cart.latitude = $scope.drop_off_location.lat;
                        $scope.add_to_cart.longitude = $scope.drop_off_location.lng;
                        $scope.add_to_cart.productList[0].category_id = $scope.selected_cat.id;
                        $scope.add_to_cart.productList[0].supplier_branch_id = $scope.branch_id;
                        $scope.add_to_cart.productList[0].productId = $scope.product.id;
                        $scope.add_to_cart.productList[0].category_id = $scope.selected_cat.id;
                        $scope.add_to_cart.productList[0].supplier_id = $scope.supplier_id;
                        
                        $scope.add_to_cart.productList[0].deliveryCharges = $scope.expectedDeliveryCharges;
                        $scope.update_cart.deliveryCharges = $scope.expectedDeliveryCharges;

                        $scope.update_cart.accessToken = response.data.access_token;
                        $scope.update_cart.deliveryId = response.data.deliveryId;
                        $scope.update_cart.netAmount = $scope.expectedDeliveryCharges > 0 ? $scope.expectedDeliveryCharges : 10
                        let date = moment();
                        $scope.update_cart.delivery_max_time = moment().format('YYYY-MM-DD');
                        $scope.update_cart.deliveryDate = date.format('YYYY-MM-DD');
                        $scope.update_cart.deliveryTime = date.format('HH:mm');



                        $scope.generate_order.accessToken = response.data.access_token;
                        $scope.generate_order['area_to_focus'] = $scope.user_info.description;
                        $scope.generate_order['have_pet'] = 1;


                        $scope.addToCart();
                    }
                })
            }
        }

        $scope.addNewAddress = function () {
            let obj = {
                name: $scope.user_info.name.trim(),
                addressLineFirst: '',
                customer_address: $scope.address_model.addressLineFirst,
                phone_number: $scope.user_info.phone, // /-/g
                accessToken: $scope.add_to_cart.accessToken,
                latitude: $scope.address_model.latitude,
                longitude: $scope.address_model.longitude,
                languageId: '14'
            };
            let phone_data = $scope.iti.getSelectedCountryData();
            if (!!phone_data) {
                obj.countryCode = phone_data['dialCode'];
            }

            services.POST_DATA(obj, API.ADD_USER_ADDRESS, function (response) {
                if (response && response.data) {
                    $scope.update_cart.deliveryId = response.data.id
                    $scope.drop_off_location.lat = response.data.latitude
                    $scope.drop_off_location.lng = response.data.longitude
                    $scope.address_model.addressLineFirst = ''
                    $scope.drop_off_location.address = response.data.address_line_1 || response.data.customer_address
                    $scope.userAddresses.push(response.data)
                    $('#addNewUserAddress').modal('hide')
                }
            })
        }



        $scope.addToCart = function () {
            var addParams = {};
            
            $scope.add_to_cart.productList[0].deliveryCharges = $scope.expectedDeliveryCharges;
            // $scope.add_to_cart.productList[0].price = $scope.user_info.price;
            $scope.add_to_cart.productList[0].agentBufferPrice = $scope.user_info.price
            $scope.update_cart.netAmount = $scope.expectedDeliveryCharges > 0 ? $scope.expectedDeliveryCharges : 10
            $scope.update_cart.deliveryCharges = $scope.expectedDeliveryCharges;
            $scope.generate_order['area_to_focus'] = $scope.user_info.description;
            $scope.generate_order['have_pet'] = 1;

            addParams = $scope.add_to_cart;
            $scope.dataLoaded = true;
            services.POST_DATA(addParams, API.ADD_TO_CART, function (response) {
                if (response) {
                    $scope.dataLoaded = false;
                    $scope.update_cart.cartId = response.data.cartId;
                    $scope.generate_order.cartId = response.data.cartId;

                    $scope.updateCart();
                }
            })
        }

        $scope.updateCart = function () {
            var addParams = {};
            addParams = $scope.update_cart;
            $scope.dataLoaded = true;
            services.POST_DATA(addParams, API.UPDATE_CART, function (response) {
                if (response) {
                    $scope.dataLoaded = false;
                    $scope.generateOrder();
                }
            })
        }
        $scope.generateOrder = function () {
            var addParams = {};
            addParams = $scope.generate_order;
            $scope.dataLoaded = false;
            services.POST_DATA(addParams, API.GENERATE_ORDER, function (response) {
                if (response) {
                    $scope.dataLoaded = false;
                    $("#addNewUserRef").modal('hide');
                    $scope.message = `Order  has been created!`;
                    services.SUCCESS_MODAL(true);
                    $scope.order_id = response.data[0];
                    $scope.orderConfirmation()
                    // $state.go("orders.ordersDescription",{order_id : $scope.order_id})
                    // var check = document.getElementById('check_order');
                    // check.click();
                }
            })
        }

        $scope.orderConfirmation = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 36;
            param_data.orderId = $scope.order_id;
            param_data.status = 1;
            param_data.offset = moment().format('Z');
            param_data.reason = "";
            param_data.vehicle_id = $scope.selected_vehicle_cat
            services.POST_DATA(param_data, API.CONFIRM_REJECT_ORDER(), function (response) {
                $state.go("orders.ordersDescription", {
                    order_id: $scope.order_id
                })
            });
        }

        $scope.getUsers = function (event) {
            let value = event.target.value;
            var data = {};
            data['name'] = value
            $scope.dataLoaded = true;
            $scope.add_to_cart.accessToken = '';
            $scope.add_to_cart.id = '';
            $scope.users = []
            $scope.selected_user = ''
            services.POST_DATA(data, API.GET_ALL_USERS_LIST, function (response) {
                $scope.users = response.data.levelData;
                $scope.dataLoaded = true;
            });
        }

        $scope.selectUser = function (user) {
            $scope.selected_user = user
            $scope.user_info.email = user.email;
            $scope.user_info.name = user.firstname + ' ' + user.lastname;
            $scope.user_info.countryCode = user.country_code
            $scope.user_info.phone = user.mobile_no
            // $scope.userAddresses = user

            $scope.dataLoaded = false;
            $scope.add_to_cart.accessToken = user.access_token;
            $scope.add_to_cart.id = user.id;
            $scope.add_to_cart.supplierBranchId = $scope.branch_id;
            $scope.add_to_cart.supplier_id = $scope.supplier_id;
            $scope.add_to_cart.latitude = user.lat ? user.lat : '';
            $scope.add_to_cart.longitude = user.lng ? user.lng : '';
            $scope.add_to_cart.productList[0].category_id = $scope.selected_cat.id;
            $scope.add_to_cart.productList[0].supplier_branch_id = $scope.branch_id;
            $scope.add_to_cart.productList[0].productId = $scope.product.id;
            $scope.add_to_cart.productList[0].category_id = $scope.selected_cat.id;
            $scope.add_to_cart.productList[0].supplier_id = $scope.supplier_id;
            $scope.add_to_cart.productList[0].price = $scope.user_info.description;
            $scope.generate_order['area_to_focus'] = $scope.user_info.description;
            $scope.generate_order['have_pet'] = 1;
            
            $scope.generate_order.accessToken = user.access_token;
            $scope.update_cart.accessToken = user.access_token;
            $scope.update_cart.deliveryId = user.user_address.length ? user.user_address[0].id : '';
            $scope.update_cart.netAmount = $scope.expectedDeliveryCharges > 0 ? $scope.expectedDeliveryCharges : 10

            if (user.user_address.length) {
                $scope.update_cart.deliveryId = user.user_address[0].id;
                $scope.drop_off_location.lat = user.user_address[0].latitude
                $scope.drop_off_location.lng = user.user_address[0].longitude
                $scope.drop_off_location.address = user.user_address[0].address_line_1 || user.user_address[0].customer_address
            }
            $scope.userAddresses = user.user_address
            //  else if(user.user_address.length > 1){
            //     $scope.userAddresses = user.user_address
            //     $("#chooseUserAddress").modal('show');
            // }
            let date = moment();
            $scope.update_cart.delivery_max_time = moment().format('YYYY-MM-DD');
            $scope.update_cart.deliveryDate = date.format('YYYY-MM-DD');
            $scope.update_cart.deliveryTime = date.format('HH:mm');
        }

        $scope.chooseAddress = function(address) {
            $scope.update_cart.deliveryId = address.id;
                $scope.drop_off_location.lat = address.latitude
                $scope.drop_off_location.lng = address.longitude
                $scope.drop_off_location.address = address.customer_address
                $("#chooseUserAddress").modal('hide');
                if ($scope.selected_vehicle_cat) {
                    $scope.fetchDelivryCharges()
                }

        }

        $scope.addAddress = function() {
            initializeUserAdd()
            $("#chooseUserAddress").modal('hide');
            $('#addNewUserAddress').modal('show')
        }

        $scope.openaddressPopUp = function() {
            $("#chooseUserAddress").modal('show');
        }

    }
]);