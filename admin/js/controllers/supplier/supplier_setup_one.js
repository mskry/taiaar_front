Royo.controller('SupplierProfileSetupOneCtrl', ['$scope', '$rootScope', 'services', 'factories', '$stateParams', 'API', 'constants',
    function($scope, $rootScope, services, factories, $stateParams, API, constants) {

        $scope.msg_txt = '';
        $scope.supplier_id = '';
        $scope.supplierData = {};
        $scope.supplier_info = {
            name: '',
            nameAr: '',
            company_name: '',
            address: '',
            phone: '',
            email: '',
            is_recommended: 0,
            commission: '',
            self_pickup: 0,
            delivery_charge: 0,
            is_multibranch: 0,
            pickupCommision: '',
            user_service_fee: 0,
            license_number: '',
            gst_price: '',
            user_request_flag: 0,
            speciality: '',
            nationality: '',
            facebook_link: '',
            linkedin_link: '',
            brand: '',
            description: '',
            base_delivery_charges: '',
            min_order: '',
            distance_value: '',
            is_subscribe: 0,
            is_dine_in: 0,
            is_scheduled: 0,
            country_of_origin: '',
            currency_exchange_rate: '',
            local_currency: '',
            is_own_delivery: 0,
            is_out_network: 0,
            is_user_service_charge_flat: 0,
            is_products_offer: 0,
            offerValue: 0,
            table_booking_price: 0,
            table_booking_discount: 0,
            is_free_delivery: 0,
            nameAr: '',
            slogan_en: '',
            slogan_ol: '',
            vat_value: '',
            is_vat_applicable: 0,
            allow_agent_section_in_supplier: 0,
            allow_geofence_section_in_supplier: 0,
            delivery_charge_tax_type: 0,
            delivery_charge_tax: 0
        };
        $scope.show_tap_form = false

        $scope.tap_payment_token = '';

        $scope.delivery_type = 1;
        $scope.supplier_coordinates = {
            lat: '',
            lng: ''
        };
        $scope.supplier_coordinates_geo = {
            lat: '',
            lng: ''
        };
        $scope.delivery_radius = 0;
        $scope.delivery_radius_geo = 0;
        $scope.message = '';
        $scope.address = '';
        $scope.geo_fence_set = false;
        $scope.is_geofence = false;
        $scope.invalid_phone_no = false;
        $scope.is_tap_card_added = false;

        if ($stateParams.id) {
            $scope.supplier_id = $stateParams.id;
            $scope.supplier_b_id = $stateParams.b_id;
        }

        $scope.normal_delivery = {
            "type": "0",
            "type_name": "normal",
            "price": "",
            "buffer_time": ""
        }
        $scope.express_delivery = {
            "type": "1",
            "type_name": "express",
            "price": "",
            "buffer_time": ""
        }
        $scope.supplier_delivery_types = [];
        $scope.selected_supplier_delivery_type = 0;


        $scope.is_hide_delivery = false;
        $scope.is_hide_pickup = false;
        $scope.is_hide_dinin = false;

        $scope.disable_delivery_mode = false;

        $scope.is_supplier_on = false;

        $scope.vendorUpdateList = [];


        $rootScope.$broadcast('supplier_id', { supplier_id: $scope.supplier_id, tab: $stateParams.tab });

        $scope.checkFlow = function(types) {
            return $rootScope.app_type > 10 && $rootScope.flow_data.length && types.length ? $rootScope.flow_data.some(flow => types.includes(flow.flow_type)) : false;
        }

        $scope.supplier_info.baseDeliveryCharges = [];

        $scope.addDeliveryCharge = function() {
            $scope.supplier_info.baseDeliveryCharges.push({
                base_delivery_charges: '',
                distance_value: ''
            });
        }

        $scope.removeDeliveryCharge = function(index) {
            $scope.supplier_info.baseDeliveryCharges.splice(index, 1);
        }


        $scope.countries = [];
        if (factories.getSettings().key_value.supplier_country_of_origin == 1) {
            $.getJSON("/js/components/countries.json", function(data) {
                if (data) {
                    $scope.countries = Object.values(data);
                }
            });
        }
        $scope.selectCountry = function(country) {
            $scope.supplier_info.country_of_origin = country;
        }

        var initialize = function() {
            var input = document.querySelector("#sup_phone");
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });

            if ($scope.supplierData.iso) {
                $scope.iti.setCountry($scope.supplierData.iso);
            }

            var input = document.getElementById('searchTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();
                $scope.supplier_coordinates = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }
                $scope.supplier_info.address = place.formatted_address;
            });
        }

        var initializePh = function() {
            var input = document.querySelector("#sup_phone1");
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });

            if ($scope.supplierData.iso) {
                $scope.iti.setCountry($scope.supplierData.iso);
            }
        }

        $scope.$on('supplier_data', getSupplierData);

        function getSupplierData($event, data) {
            if (!!data) {
                $scope.supplierData = data;
                $scope.supplier_info.name = data.name;
                if ($rootScope.is_secondary_language) {
                    $scope.supplier_info.nameAr = data.names.length && data.names.length > 1 ? data.names[1].supplier_name : '';
                }
                $scope.supplier_info.is_free_delivery = data.is_free_delivery;
                $scope.supplier_info.company_name = data.names.length ? data.names[0].supplier_name : '';
                $scope.supplier_info.phone = data.mobile_number_1;
                $scope.supplier_info.email = data.email;
                $scope.supplier_info.address = data.names.length ? data.names[0].address : '';
                $scope.supplier_info.is_recommended = data.is_recommended;
                $scope.supplier_info.commission = data.commission;
                $scope.delivery_radius = data.delivery_radius;
                $scope.delivery_type = data.delivery_type ? data.delivery_type : 1;
                $scope.supplier_coordinates.lat = data.latitude;
                $scope.supplier_coordinates.lng = data.longitude;
                $scope.supplier_info.self_pickup = $rootScope.is_dine_in == 1 ? 1 : data.self_pickup;
                $scope.supplier_info.delivery_charge = data.radius_price ? data.radius_price : 0;
                $scope.supplier_info.is_multibranch = data.is_multibranch;
                $scope.supplier_info.pickupCommision = data.pickup_commission;
                $scope.supplier_info.user_service_fee = data.user_service_charge ? data.user_service_charge : 0;
                $scope.supplier_info.license_number = data.license_number ? data.license_number : '';
                $scope.supplier_info.gst_price = data.gst_price ? data.gst_price : '';
                $scope.supplier_info.user_request_flag = data.user_request_flag ? data.user_request_flag : 0;
                $scope.supplier_info.base_delivery_charges = data.base_delivery_charges ? data.base_delivery_charges : 0;
                $scope.supplier_info.min_order = data.min_order ? data.min_order : 0;
                $scope.supplier_info.description = data.description ? data.description : '';
                $scope.supplier_info.distance_value = data.distance_value ? data.distance_value : 0;
                $scope.supplier_info.is_subscribe = data.is_subscribe || 0;
                $scope.supplier_info.is_dine_in = data.is_dine_in || 0;
                $scope.supplier_info.is_scheduled = data.is_scheduled || 0;
                $scope.supplier_info.country_of_origin = data.country_of_origin || '';
                $scope.supplier_info.is_vat_applicable = $rootScope.enable_dynamic_vat_for_supplier_by_admin ? data.is_vat_applicable : 0;
                $scope.supplier_info.allow_agent_section_in_supplier = $rootScope.enable_dynamic_agent_section_in_supplier_by_admin ? data.allow_agent_section_in_supplier : 0;
                $scope.supplier_info.allow_geofence_section_in_supplier = $rootScope.enable_geofence_section_in_supplier_by_admin ? data.allow_geofence_section_in_supplier : 0;
                if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                    $scope.supplier_b_id = data.default_branch_id;
                }
                if ($rootScope.tax_on_delivery_charges == 1) {
                    $scope.supplier_info.delivery_charge_tax_type = data.delivery_charge_tax_type ? data.delivery_charge_tax_type : 0;
                    $scope.supplier_info.delivery_charge_tax = data.delivery_charge_tax ? data.delivery_charge_tax : 0
                }

                $scope.setFreeDelivery($scope.supplier_info.is_free_delivery)
                if ($rootScope.enable_flat_user_service_charge == 1) {
                    $scope.supplier_info.is_user_service_charge_flat = data.is_user_service_charge_flat || 0;
                }

                if ($rootScope.enable_in_out_network == 1) {
                    $scope.supplier_info.is_out_network = data.is_out_network;
                    $scope.changeNetworkType($scope.supplier_info.is_out_network);
                }

                if ($rootScope.enable_supplier_in_special_offer_admin == 1) {
                    $scope.supplier_info.is_products_offer = data.is_products_offer;
                    $scope.supplier_info.offerValue = data.offerValue;
                    $scope.changeProductOffer($scope.supplier_info.is_products_offer);
                }

                if ($rootScope.table_book_mac_theme == 1) {
                    $scope.supplier_info.table_booking_price = data.table_booking_price;
                    $scope.supplier_info.table_booking_discount = data.table_booking_discount;
                }
                if ($rootScope.enable_supplier_vat_value == 1) {
                    $scope.supplier_info.vat_value = data.vat_value;
                }
                if ($rootScope.enable_tap_payment_gateway == 1) {
                    $scope.is_tap_card_added = data.tap_saved_card_id ? true : false
                    $scope.initializeTap()
                }



                if (factories.getSettings().key_value.is_currency_exchange_rate == 1) {
                    $scope.supplier_info.currency_exchange_rate = data.currency_exchange_rate || 0;
                    $scope.supplier_info.local_currency = data.local_currency || '';
                }
                if (factories.getSettings().key_value.is_enabled_multiple_base_delivery_charges == 1) {
                    if (data.base_delivery_charges_data && data.base_delivery_charges_data.length) {
                        $scope.supplier_info.baseDeliveryCharges = data.base_delivery_charges_data;
                    } else {
                        $scope.supplier_info.baseDeliveryCharges = [{
                            base_delivery_charges: '',
                            distance_value: ''
                        }];
                    }
                }

                if ($rootScope.is_supplier_detail == 1) {
                    $scope.supplier_info.speciality = data.speciality ? data.speciality : '';
                    $scope.supplier_info.nationality = data.nationality ? data.nationality : '';
                    $scope.supplier_info.facebook_link = data.facebook_link ? data.facebook_link : '';
                    $scope.supplier_info.linkedin_link = data.linkedin_link ? data.linkedin_link : '';
                    $scope.supplier_info.brand = data.brand ? data.brand : '';
                }

                if ($rootScope.is_secondary_language) {
                    $scope.supplier_info.nameAr = data.names.length && data.names.length > 1 ? data.names[1].supplier_name : '';
                }

                if ($rootScope.is_supplier_slogan_add_edit == 1) {
                    $scope.supplier_info.slogan_en = data.slogan_en;
                    $scope.supplier_info.slogan_ol = data.slogan_ol;
                }

                if ($rootScope.enable_supplier_on_off == 1) {
                    $scope.is_supplier_on = data.is_open;
                }



                if ($rootScope.is_enable_delivery_type) {
                    $scope.supplier_info.is_own_delivery = data.is_own_delivery;
                    if (data.supplier_delivery_types) {
                        var check;
                        data.supplier_delivery_types.forEach(element => {
                            if (element.type == 0) {
                                $scope.normal_delivery.price = element.price;
                                $scope.normal_delivery.buffer_time = element.buffer_time;
                                check = 0;
                                $scope.selected_supplier_delivery_type = 0;
                            }
                            if (element.type == 1) {
                                $scope.express_delivery.price = element.price;
                                $scope.express_delivery.buffer_time = element.buffer_time;
                                if (check == 0) {
                                    $scope.selected_supplier_delivery_type = 2;
                                } else {
                                    $scope.selected_supplier_delivery_type = 1;
                                }
                            }
                        });

                    }
                }

                if (!$scope.vendorUpdateList.length) {
                    getVendorUpdateList(1);
                }

                $scope.setOrderTypeClientWise();

            }
            setTimeout(() => {
                initialize();
            }, 300);
        }

        $scope.setOrderTypeClientWise = function() {
            if ($rootScope.dynamic_order_type_client_wise == 1) {
                if ($rootScope.dynamic_order_type_client_wise_delivery != 1) {
                    $scope.is_hide_delivery = true;
                    // $scope.supplier_info.self_pickup = '1';
                }
                if ($rootScope.dynamic_order_type_client_wise_pickup != 1) {
                    $scope.is_hide_pickup = true;
                    // $scope.supplier_info.self_pickup = '0';
                }
                if ($rootScope.dynamic_order_type_client_wise_dinein != 1) {
                    $scope.is_hide_dinin = true;
                }
            }
        }

        var getGeoLocation = function(lat, lng) {
            const geocoder = new google.maps.Geocoder();
            const latlng = new google.maps.LatLng(lat, lng);
            const request = { latLng: latlng };
            geocoder.geocode(request, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        $scope.address = results[0].formatted_address;
                    }
                }
            });
        }

        var GeofenceController = function() {
            let div = document.getElementById('geo_map');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.is_geofence = true;
                    var map = new google.maps.Map(div, {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        zoom: 15
                    });

                    var all_overlays = [];
                    var selectedShape;
                    var drawingManager = new google.maps.drawing.DrawingManager({
                        drawingMode: null,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [
                                google.maps.drawing.OverlayType.CIRCLE,
                            ]
                        },
                        circleOptions: {
                            fillColor: 'var(--primary-color)8c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.2,
                            strokeWeight: 2,
                            strokeColor: '#4a4a4a',
                            clickable: true,
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        }
                    });

                    function clearSelection() {
                        if (selectedShape) {
                            selectedShape.setEditable(false);
                            selectedShape = null;
                        }
                    }

                    function setSelection(shape) {
                        clearSelection();
                        selectedShape = shape;
                        shape.setEditable(true);
                    }

                    function deleteSelectedShape() {
                        if (selectedShape) {
                            selectedShape.setMap(null);
                        }
                    }

                    function CenterControl(controlDiv, map) {

                        // Set CSS for the control border.
                        var controlUI = document.createElement('div');
                        controlUI.style.backgroundColor = '#fff';
                        controlUI.style.border = '2px solid #fff';
                        controlUI.style.borderRadius = '3px';
                        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                        controlUI.style.cursor = 'pointer';
                        controlUI.style.marginBottom = '22px';
                        controlUI.style.textAlign = 'center';
                        controlUI.title = 'Select to delete the shape';
                        controlDiv.appendChild(controlUI);

                        // Set CSS for the control interior.
                        var controlText = document.createElement('div');
                        controlText.style.color = '2ca6b18c';
                        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
                        controlText.style.fontSize = '16px';
                        controlText.style.lineHeight = '38px';
                        controlText.style.paddingLeft = '5px';
                        controlText.style.paddingRight = '5px';
                        controlText.innerHTML = 'Delete Selected Area';
                        controlUI.appendChild(controlText);

                        // Setup the click event listeners: simply set the map to Chicago.
                        controlUI.addEventListener('click', function() {
                            deleteSelectedShape();
                        });

                    }
                    drawingManager.setMap(map);

                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                        all_overlays.push(event);
                        if (event.type == 'circle') {
                            drawingManager.setDrawingMode(null);
                            var newShape = event.overlay;
                            $scope.delivery_radius_geo = Math.round(newShape.getRadius()) / 1000;
                            $scope.supplier_coordinates_geo = {
                                lat: newShape.center.lat(),
                                lng: newShape.center.lng()
                            }
                            getGeoLocation(newShape.center.lat(), newShape.center.lng());

                            google.maps.event.addListener(newShape, 'dragend', function() {
                                $scope.supplier_coordinates_geo = {
                                    lat: newShape.center.lat(),
                                    lng: newShape.center.lng()
                                }
                                getGeoLocation(newShape.center.lat(), newShape.center.lng());
                                setSelection(newShape);
                            });


                            google.maps.event.addListener(newShape, 'radius_changed', function() {
                                $scope.delivery_radius_geo = Math.round(newShape.getRadius()) / 1000;
                                setSelection(newShape);
                            });
                            setSelection(newShape);
                        }
                    });

                    var centerControlDiv = document.createElement('div');
                    var centerControl = new CenterControl(centerControlDiv, map);
                    centerControlDiv.index = 1;
                    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
                });

            }
        }
        $scope.$on('google_map_loaded', loadeMap);

        function loadeMap($event, data) {
            if (data) {
                setTimeout(() => {
                    GeofenceController();
                }, 250);
            }
        }

        $scope.setGeolocation = function() {
            if (!$scope.delivery_radius_geo || (!$scope.supplier_coordinates_geo.lat && !$scope.supplier_coordinates_geo.lng)) {
                factories.warningDataPop('Please select an area for geofencing');
                return;
            }
            $scope.geo_fence_set = true;
            $scope.delivery_radius = $scope.delivery_radius_geo;
            $scope.supplier_coordinates = $scope.supplier_coordinates_geo;
            $scope.supplier_info.address = $scope.address;
            document.getElementById('close_geofence').click();
        }

        var geocodePosition = function(pos) {
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ latLng: pos },
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $scope.supplier_info.address = results[0].formatted_address;
                        $scope.supplier_coordinates.lat = pos.lat();
                        $scope.supplier_coordinates.lng = pos.lng();
                    }
                });
        }

        $scope.selected_location_on_map = null;
        $scope.viewDeliveryRadius = function() {
            $scope.selected_location_on_map = null;

            $("#view_delivery_area").modal('show');

            var map = new google.maps.Map(document.getElementById('delivery_geo_map'), {
                zoom: 11,
                center: $scope.supplier_coordinates,
                mapTypeId: 'terrain'
            });

            var marker = new google.maps.Marker({
                draggable: true,
                map: map,
                position: new google.maps.LatLng($scope.supplier_coordinates.lat, $scope.supplier_coordinates.lng),
                title: 'Some location'
            });

            var circle = new google.maps.Circle({
                map: map,
                radius: $scope.delivery_radius * 1000,
                fillColor: $rootScope.primaryColor,
                strokeOpacity: 0.8,
                fillOpacity: 0.3,
                strokeWeight: 2,
                strokeColor: '#4a4a4a'
            });
            circle.bindTo('center', marker, 'position');


            google.maps.event.addListener(marker, 'dragend', function() {
                $scope.selected_location_on_map = marker.getPosition();
                // geocodePosition(marker.getPosition());
            });
        }

        $scope.saveSelectedSupplierLocation = function() {
            if ($scope.selected_location_on_map) {
                geocodePosition($scope.selected_location_on_map);
            }
        }

        $scope.recommendSupplier = function(val) {
            $scope.supplier_info.is_recommended = !val;
        }



        $scope.supplierOnOff = function(is_supplier_on) {
            $scope.is_supplier_on = !is_supplier_on;
            var param = {
                id: (Number)($scope.supplier_id),
                is_open: $scope.is_supplier_on
            }
            services.POST_DATA(param, API.SUPPLIER_ON_OFF, function(response) {
                $scope.message = 'Success';
                services.SUCCESS_MODAL(true);
            });
        }




        $scope.changeDeliverType = function(type) {
            $scope.geo_fence_set = false;
            $scope.delivery_type = type;
        }

        $scope.changeDeliveryRadius = function(delivery_radius) {
            $scope.delivery_radius = delivery_radius;
        }

        $scope.changeBranchType = function(branch_type) {
            $scope.supplier_info.is_multibranch = branch_type;
        }

        $scope.prescriptionUploadChanges = function(user_request_flag) {
            $scope.supplier_info.user_request_flag = user_request_flag;
        }

        $scope.changeDineIn = function(is_dine_in) {
            $scope.supplier_info.is_dine_in = is_dine_in;
            if (is_dine_in == 0) {
                $scope.supplier_info.table_booking_price = 0;
                $scope.supplier_info.table_booking_discount = 0;
            }
        }

        $scope.changeSupplierSchedule = function(is_scheduled) {
            $scope.supplier_info.is_scheduled = is_scheduled;
        }

        $scope.setSupplierDetails = function(stepOneForm) {
            if (stepOneForm.$submitted && stepOneForm.$invalid) return;
            if ($scope.iti) {
                if ($scope.iti.isValidNumber()) {
                    $scope.invalid_phone_no = false;
                } else {
                    $scope.invalid_phone_no = true;
                    return;
                }
            }
            if ($scope.supplier_info.address && (!$scope.supplier_coordinates.lat || !$scope.supplier_coordinates.lng)) {
                factories.warningDataPop('Not able to locate area');
                return;
            } else if (!$scope.supplier_info.address && (!$scope.supplier_coordinates.lat || !$scope.supplier_coordinates.lng)) {
                factories.warningDataPop('Please select an area');
                return;
            } else if (!$scope.geo_fence_set && $scope.delivery_type == 2) {
                factories.warningDataPop('Please select geofence area');
                return;
            }

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = 22;
            data.supplierId = $scope.supplierData.id;
            data.supplierNameEn = $scope.supplier_info.name;
            data.supplierNameAb = $scope.supplier_info.nameAr ? $scope.supplier_info.nameAr : $scope.supplier_info.name;
            data.supplierEmail = $scope.supplier_info.email;
            data.isRecommended = +$scope.supplier_info.is_recommended;
            data.addressEn = $scope.supplier_info.address;
            data.addressAb = $scope.supplier_info.address;
            data.telephone = $scope.supplier_info.phone;
            data.primaryMobile = $scope.supplier_info.phone;
            data.secondaryMobile = $scope.supplier_info.phone;
            data.commission = $scope.supplier_info.commission;
            data.latitude = $scope.supplier_coordinates.lat;
            data.longitude = $scope.supplier_coordinates.lng;
            data.is_area_restricted = $scope.delivery_type == 0 ? 1 : 0;
            data.delivery_radius = $scope.delivery_type == 0 ? 0 : $scope.delivery_radius;
            data.delivery_type = $scope.delivery_type;
            data.radius_price = $scope.supplier_info.delivery_charge;
            data.is_multibranch = $scope.supplier_info.is_multibranch;
            data.pickupCommision = $scope.supplier_info.pickupCommision;
            data.user_service_charge = $scope.supplier_info.user_service_fee;
            data.license_number = $scope.supplier_info.license_number;
            if ($scope.supplier_info.gst_price) data.gst_price = $scope.supplier_info.gst_price;
            data.user_request_flag = $scope.supplier_info.user_request_flag;
            data.base_delivery_charges = $scope.supplier_info.base_delivery_charges;
            data.min_order = $scope.supplier_info.min_order;
            data.distance_value = $scope.supplier_info.distance_value;
            data.is_dine_in = $scope.supplier_info.is_dine_in;
            data.is_scheduled = $scope.supplier_info.is_scheduled;
            data.is_vat_applicable = $scope.supplier_info.is_vat_applicable
            data.allow_agent_section_in_supplier = $scope.supplier_info.allow_agent_section_in_supplier
            data.allow_geofence_section_in_supplier = $scope.supplier_info.allow_geofence_section_in_supplier
            $scope.is_free_delivery === 1 ? data.is_free_delivery = $scope.is_free_delivery : ''
            if ($rootScope.is_currency_exchange_rate == 1 && $scope.supplier_info.currency_exchange_rate) {
                data.currency_exchange_rate = $scope.supplier_info.currency_exchange_rate;
                data.local_currency = $scope.supplier_info.local_currency;
            }

            if ($rootScope.tax_on_delivery_charges == 1) {
                data.delivery_charge_tax_type = $scope.supplier_info.delivery_charge_tax_type
                data.delivery_charge_tax = $scope.supplier_info.delivery_charge_tax
            }


            if ($rootScope.supplier_country_of_origin == 1) {
                data.country_of_origin = $scope.supplier_info.country_of_origin;
            }




            if ($rootScope.enable_tap_payment_gateway == 1) {
                data.supplier_tap_token = $scope.tap_payment_token;
            }



            if ($rootScope.is_enabled_multiple_base_delivery_charges == 1) {
                data.base_delivery_charges_array = JSON.stringify($scope.supplier_info.baseDeliveryCharges);
            }

            if ($rootScope.enable_in_out_network == 1) {
                data.is_out_network = $scope.supplier_info.is_out_network;
            }
            if ($rootScope.enable_supplier_in_special_offer_admin == 1) {
                var offer = {};
                offer.is_products_offer = $scope.supplier_info.is_products_offer;
                offer.offerValue = (Number)($scope.supplier_info.offerValue);
                updateProductOffer(offer);
            }

            if ($rootScope.table_book_mac_theme == 1) {
                data.table_booking_price = (Number)($scope.supplier_info.table_booking_price);
                data.table_booking_discount = (Number)($scope.supplier_info.table_booking_discount);
            }

            if ($rootScope.enable_supplier_vat_value == 1) {
                data.vat_value = (Number)($scope.supplier_info.vat_value);
            }


            if ($rootScope.is_supplier_detail == 1) {
                data.speciality = $scope.supplier_info.speciality;
                data.nationality = $scope.supplier_info.nationality;
                data.facebook_link = $scope.supplier_info.facebook_link;
                data.linkedin_link = $scope.supplier_info.linkedin_link;
                data.brand = $scope.supplier_info.brand;
                data.description = $scope.supplier_info.description;
            }

            if ($rootScope.is_supplier_slogan_add_edit == 1) {
                data.slogan_en = $scope.supplier_info.slogan_en;
                data.slogan_ol = $scope.supplier_info.slogan_ol;
            }

            if ($scope.iti) {
                let phone_data = $scope.iti.getSelectedCountryData();
                if (!!phone_data) {
                    data['iso'] = phone_data['iso2'];
                    data['country_code'] = phone_data['dialCode'];
                }
            }

            if ($rootScope.is_pickup == 2) {
                data.self_pickup = +$scope.supplier_info.self_pickup;
            } else {
                data.self_pickup = $rootScope.is_pickup;
            }

            if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                data.payment_method = $rootScope.payment_method;
            }


            if ($rootScope.is_enable_delivery_type) {
                $scope.supplier_delivery_types = [];
                data.is_own_delivery = $scope.supplier_info.is_own_delivery;
                if (!data.is_own_delivery) {
                    var is_invalid = false;
                    if ($scope.normal_delivery.price < 0) {
                        $scope.normal_delivery.price = '';
                        is_invalid = true;
                    }
                    if ($scope.normal_delivery.buffer_time < 0) {
                        $scope.normal_delivery.buffer_time = '';
                        is_invalid = true;
                    }
                    if ($scope.express_delivery.price < 0) {
                        $scope.express_delivery.price = '';
                        is_invalid = true;
                    }
                    if ($scope.express_delivery.buffer_time < 0) {
                        $scope.express_delivery.buffer_time = '';
                        is_invalid = true;
                    }
                    if (is_invalid) {
                        return
                    }
                    if ($scope.normal_delivery && $scope.normal_delivery.price && $scope.normal_delivery.buffer_time) {
                        $scope.supplier_delivery_types.push($scope.normal_delivery);
                    }
                    if ($scope.express_delivery && $scope.express_delivery.price && $scope.express_delivery.buffer_time) {
                        $scope.supplier_delivery_types.push($scope.express_delivery);
                    }
                    data.supplier_delivery_types = JSON.stringify($scope.supplier_delivery_types);
                } else {
                    data.supplier_delivery_types = JSON.stringify([]);
                }
            }

            if ($rootScope.enable_flat_user_service_charge == 1) {
                data.is_user_service_charge_flat = $scope.supplier_info.is_user_service_charge_flat;
            }

            var api = API.UPDATE_SUPPLIER_INFO();
            var messg = 'Details updated!';

            if ($rootScope.enable_updation_vendor_approval == 1 && $rootScope.profile == 'SUPPLIER') {
                data_obj = {};
                if ($scope.vendorUpdateList.length) {
                    if ($scope.vendorUpdateList[0].update_request_approved == 0) {
                        data_obj.updationRequestId = $scope.vendorUpdateList[0].id;
                    }
                }
                data_obj.supplierName = data.supplierNameEn;
                data_obj.supplierEmail = data.supplierEmail;
                data_obj.supplierMobileNo = data.telephone;
                data_obj.delivery_radius = data.delivery_radius;
                data_obj.supplierAddress = data.addressEn;
                data_obj.radius_price = data.radius_price;
                data_obj.latitude = data.latitude;
                data_obj.longitude = data.longitude;
                data_obj.commission = data.commission;
                data_obj.pickupCommision = data.pickupCommision;
                data_obj.self_pickup = data.self_pickup;
                data_obj.country_code = data.country_code;
                data_obj.base_delivery_charges = data.base_delivery_charges;
                data_obj.distance_value = data.distance_value;
                data_obj.is_dine_in = data.is_dine_in;
                data_obj.payment_method = data.payment_method;
                data_obj.is_scheduled = data.is_scheduled;
                data_obj.iso = data.iso;
                data_obj.is_user_service_charge_flat = data.is_user_service_charge_flat ? data.is_user_service_charge_flat : 0;
                data_obj.is_own_delivery = data.is_own_delivery ? data.is_own_delivery : 0;
                data_obj.table_booking_price = data.table_booking_price ? data.table_booking_price : 0;
                data_obj.table_booking_discount = data.table_booking_discount ? data.table_booking_discount : 0;
                data_obj.supplier_id = (Number)(data.supplierId);
                data_obj.speciality = data.speciality;
                data_obj.nationality = data.nationality;
                data_obj.facebook_link = data.facebook_link;
                data_obj.linkedin_link = data.linkedin_link;
                data_obj.brand = data.brand;
                data_obj.license_number = data.license_number;
                data_obj.description = data.description;
                data_obj.user_service_charge = data.user_service_charge;
                data_obj.logo = $scope.supplierData.logo ? $scope.supplierData.logo : {};
                data = data_obj;
                api = API.SUPPLIER_UPDATION_REQUEST;
                messg = 'Changes submitted to admin for approval!';
            }

            services.POST_FORM_DATA(data, api, function(response) {
                $rootScope.$broadcast('is_multibranch', $scope.supplier_info.is_multibranch);
                $rootScope.$broadcast('is_scheduled', $scope.supplier_info.is_scheduled);
                $scope.message = messg;
                services.SUCCESS_MODAL(true);
            });
        }

        var updateProductOffer = function(data) {
            var param = {};
            var messg = 'Details updated';
            if ($rootScope.enable_updation_vendor_approval == 1) {
                messg = 'Changes submitted to admin for approval!';
            }
            param['supplierBranchId'] = (Number)($scope.supplier_b_id);
            param['supplierId'] = (Number)($scope.supplier_id);
            param['offerValue'] = data.offerValue;
            param['is_products_offer'] = data.is_products_offer;
            services.POST_DATA(param, API.UPDATE_PRODUCT_OFFERS, function(response) {
                $scope.message = messg;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.changeSelfPickup = function(self_pickup) {
            $scope.supplier_info.self_pickup = self_pickup;
        }

        //Geofence delivery charge & taxes
        $scope.geofence_areas = [];
        $scope.geofence_coordinates = [];
        $scope.current_geofence_index = -1;

        var getGeofenceAreas = function() {
            services.GET_DATA({ supplier_id: $scope.supplier_id }, API.LIST_SUPPLIER_GEOFENCE_AREAs(), function(response) {
                if (response && response.data.length) {
                    $scope.geofence_areas = response.data;
                }
                $scope.addArea();
            });
        }
        if (factories.getSettings().key_value.is_tax_geofence == 1) {
            getGeofenceAreas();
        }

        $scope.addArea = function() {
            $scope.geofence_areas.push({
                coordinates: [],
                delivery_charges: '',
                tax: '',
                supplier_id: $scope.supplier_id
            });
        }

        $scope.removeArea = function(index) {
            services.CONFIRM(`You want to delete this area`,
                function(isConfirm) {
                    if (isConfirm) {
                        let params = {
                            id: $scope.geofence_areas[index].id
                        }
                        services.POST_DATA(params, API.DELETE_SUPPLIER_GEOFENCE_AREA(), function(response) {
                            $scope.geofence_areas.splice(index, 1);
                            $scope.message = 'Geofence area removed';
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        }

        $scope.initGeofence = function(index) {
            $("#geo").modal('show');
            $scope.current_geofence_index = index;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var map = new google.maps.Map(document.getElementById('geo_map'), {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        zoom: 15
                    });

                    function getPolygonPath(polygon) {
                        let arr = [];
                        for (var i = 0; i < polygon.getPath().getLength(); i++) {
                            let latlng = polygon.getPath().getAt(i);
                            arr.push({
                                x: latlng.lat(),
                                y: latlng.lng()
                            });
                        }
                        $scope.geofence_coordinates = arr;
                        $scope.geofence_coordinates.push(arr[0]);
                    }

                    if ($scope.geofence_areas[$scope.current_geofence_index].id) {
                        $scope.geofence_coordinates = $scope.geofence_areas[$scope.current_geofence_index].coordinates;
                        let polygon_coordinates = $scope.geofence_coordinates.map(latlng => {
                            return {
                                lat: (latlng.x),
                                lng: (latlng.y)
                            }
                        });
                        polygon_coordinates.pop()
                        var myPolygon = new google.maps.Polygon({
                            paths: polygon_coordinates,
                            fillColor: 'var(--primary-color)8c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        });
                        myPolygon.setMap(map);

                        google.maps.event.addListener(myPolygon, 'dragend', function() {
                            getPolygonPath(myPolygon);
                        });

                        google.maps.event.addListener(myPolygon.getPath(), 'insert_at', function() {
                            getPolygonPath(myPolygon);
                        });
                        google.maps.event.addListener(myPolygon.getPath(), 'set_at', function() {
                            getPolygonPath(myPolygon);
                        });
                    }

                    var selectedShape;

                    function clearSelection() {
                        if (selectedShape) {
                            selectedShape.setEditable(false);
                            selectedShape.setMap(null);
                            selectedShape = null;
                        }
                        if ($scope.geofence_areas[$scope.current_geofence_index].id) {
                            myPolygon.setMap(null);
                        }
                    }

                    function setSelection(shape) {
                        clearSelection();
                        selectedShape = shape;
                        shape.setEditable(true);
                    }

                    var drawingManager = new google.maps.drawing.DrawingManager({
                        drawingMode: $scope.geofence_areas[$scope.current_geofence_index].id ? null : google.maps.drawing.OverlayType.POLYGON,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                        },
                        polygonOptions: {
                            fillColor: 'var(--primary-color)8c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            clickable: true,
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        }
                    });
                    drawingManager.setMap(map);

                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                        var newShape = event.overlay;
                        newShape.type = event.type;

                        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                            drawingManager.setDrawingMode(null);
                            getPolygonPath(newShape);

                            google.maps.event.addListener(newShape, 'dragend', function() {
                                setSelection(newShape);
                            });

                            setSelection(newShape);
                        }
                    });

                    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);

                });
            }
        }

        $scope.setGeofence = function() {
            $scope.geofence_areas[$scope.current_geofence_index].coordinates = $scope.geofence_coordinates;
            $("#geo").modal('hide');
            console.log($scope.geofence_areas)
        }

        var afterupdate = function() {
            $scope.message = 'Geofence details updated';
            services.SUCCESS_MODAL(true);
            getGeofenceAreas();
        }

        $scope.setGeofenceData = function(geofenceForm, index) {
            if (geofenceForm.$submitted && geofenceForm.$invalid) return;

            console.log($scope.geofence_areas)
            if ($scope.geofence_areas[index].id) {
                services.POST_DATA($scope.geofence_areas[index], API.UPDATE_SUPPLIER_GEOFENCE_AREA(), function(response) {
                    afterupdate();
                });
            } else {
                services.POST_DATA($scope.geofence_areas[index], API.ADD_SUPPLIER_GEOFENCE_AREA(), function(response) {
                    afterupdate();
                });
            }

        }


        $scope.setIsOwnDelivery = function(is_own_delivery) {
            $scope.supplier_info.is_own_delivery = is_own_delivery;
            $scope.normal_delivery = {
                "type": "0",
                "type_name": "normal",
                "price": "",
                "buffer_time": ""
            }
            $scope.express_delivery = {
                "type": "1",
                "type_name": "express",
                "price": "",
                "buffer_time": ""
            }
            $scope.selected_supplier_delivery_type = 0;
        }
        $scope.setSupplierDeliveryType = function(selected_supplier_delivery_type) {
            $scope.selected_supplier_delivery_type = selected_supplier_delivery_type;
            if ($scope.selected_supplier_delivery_type == 1) {
                $scope.normal_delivery = {
                    "type": "0",
                    "type_name": "normal",
                    "price": "",
                    "buffer_time": ""
                }
            }
            if ($scope.selected_supplier_delivery_type == 0) {
                $scope.express_delivery = {
                    "type": "1",
                    "type_name": "express",
                    "price": "",
                    "buffer_time": ""
                }
            }
        }


        // update pwd of supplier by admin


        $scope.changeServiceChargeType = function(is_user_service_charge_flat) {
            $scope.supplier_info.is_user_service_charge_flat = is_user_service_charge_flat;
        }
        $scope.setFreeDelivery = function(setFreeDelivery) {
            if (setFreeDelivery === 1) {
                $scope.is_free_delivery = 1;
                $scope.supplier_info.delivery_charge = 0;
                $scope.supplier_info.base_delivery_charges = 0;
                $scope.supplier_info.distance_value = 0;
            } else {
                $scope.is_free_delivery = 0;
            }
        }

        $scope.changeNetworkType = function(is_out_network) {
            if (is_out_network == 1) {
                $scope.supplier_info.self_pickup = 0;
                $scope.disable_delivery_mode = 1;
                $scope.supplier_info.pickupCommision = 0;
                $scope.supplier_info.is_dine_in = 0;
                $scope.supplier_info.is_out_network = 1;
            } else {
                $scope.disable_delivery_mode = 0;
                $scope.supplier_info.is_out_network = 0;
            }
        }

        $scope.changeProductOffer = function(is_products_offer) {
            $scope.supplier_info.is_products_offer = is_products_offer;
            if (is_products_offer == 0) {
                $scope.supplier_info.offerValue = 0;
            }
        }

        $scope.enable_agent_for_supplier = function(key) {
            $scope.supplier_info.allow_agent_section_in_supplier = key;
        }
        $scope.enable_vat_for_supplier = function(key) {
            $scope.supplier_info.is_vat_applicable = key;
        }
        $scope.enable_geofence_for_supplier = function(key) {
            $scope.supplier_info.allow_geofence_section_in_supplier = key;
        }


        $scope.showTapForm = function() {
            $scope.show_tap_form = false
            $scope.initializeTap();

            setTimeout(() => {
                $("#add_tap_card_ref").modal('show');
            }, 500);

        }

        setSupplierCardDetails = function() {
            let param_data = {
                customer_profile_json: {},
                card_token: $scope.tap_payment_token,
                supplier_id: $scope.supplier_id,
            }
            param_data.customer_profile_json.first_name = $scope.supplier_info.name
            param_data.customer_profile_json.middle_name = $scope.supplier_info.middle_name
            param_data.customer_profile_json.last_name = $scope.supplier_info.last_name
            param_data.customer_profile_json.email = $scope.supplier_info.email
            var number = {
                country_code: $scope.supplier_info.country_code,
                number: $scope.supplier_info.phone
            }
            param_data.customer_profile_json.phone = number
            param_data.customer_profile_json.description = $scope.supplier_info.description
            param_data.customer_profile_json.currency = $rootScope.currency
            param_data.customer_profile_json = JSON.stringify(param_data.customer_profile_json)

            services.POST_DATA(param_data, API.ADD_TAP_CARD_DETAIL, function(response) {
                $scope.msg_txt = `Card detail added successfully`;
                services.SUCCESS_MODAL(true);
                getSupplierInfo();
            });
        }






        $scope.initializeTap = function() {
            //pass your public key from tap's dashboard
            var tap = Tapjsli('pk_test_X7MwKtjJxSr4IF05qagcPb12');

            var elements = tap.elements({});
            $scope.show_tap_form = true
            var style = {
                base: {
                    color: '#535353',
                    lineHeight: '18px',
                    fontFamily: 'sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: 'rgba(0, 0, 0, 0.26)',
                        fontSize: '15px'
                    }
                },
                invalid: {
                    color: 'red'
                }
            };
            // input labels/placeholders
            var labels = {}
            labels.cardNumber = "Card Number",
                labels.expirationDate = "MM/YY",
                labels.cvv = "CVV",
                labels.cardHolder = "Card Holder Name"
                //payment options
            var paymentOptions = {
                    currencyCode: ["KWD", "USD", "SAR"],
                    labels: labels,
                    TextDirection: 'ltr'
                }
                //create element, pass style and payment options
            var card = {};
            var card = elements.create('card', { style: style }, paymentOptions);
            //mount element
            card.mount('#element-container');
            //card change event listener 
            card.addEventListener('change', function(event) {
                if (event.loaded) {
                    console.log("UI loaded :" + event.loaded);
                    console.log("current currency is :" + card.getCurrency())
                }
                var displayError = document.getElementById('error-handler');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            $scope.createTokenn(tap, card);
        }



        $scope.createTokenn = function(tap, card) {
            // Handle form submission
            console.log(card)
            var form = document.getElementById('form-container');
            form.addEventListener('submit', function(event) {
                event.preventDefault();

                var errorElement = document.getElementById('success');
                var tokenElement = document.getElementById('token');
                errorElement.style.display = "block";
                tokenElement.textContent = 'waiting....';

                tap.createToken(card).then(function(result) {
                    console.log(result);
                    if (result.error) {
                        // Inform the user if there was an error
                        var errorElement = document.getElementById('error-handler');
                        errorElement.textContent = result.error.message;
                        $scope.tap_payment_token = '';
                    } else {
                        // Send the token to your server
                        tokenElement.textContent = result.id;
                        $scope.tap_payment_token = result.id;
                        if ($scope.tap_payment_token) {
                            var tapBtn = document.getElementById('tap-btn');
                            tapBtn.style.display = "none";
                            var tapDone = document.getElementById('tap_done');
                            tapDone.style.display = "block";
                        }
                        $scope.getCardDetails(card);
                        setSupplierCardDetails()
                    }
                });
            });
        }


        $scope.getCardDetails = function(card) {
            card.addEventListener('change', function(event) {
                if (event.BIN) {
                    console.log(event.BIN)
                }
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }
        var getVendorUpdateList = function(page) {
            setTimeout(() => {
                if ($rootScope.enable_updation_vendor_approval == 1) {
                    var data = {
                        limit: 10,
                        skip: 0
                    };
                    var api = API.SUPPLIER_UPDATION_REQUEST_LIST;
                    if ($scope.supplierData.id) {
                        data['supplier_id'] = $scope.supplierData.id;
                        api = API.SUPPLIER_UPDATION_REQUEST;
                    }
                    $scope.dataLoaded = false;
                    services.GET_DATA(data, api, function(response) {
                        $scope.vendorUpdateList = response.data.list;
                        $scope.dataLoaded = true;
                    });
                }
            }, 2000);
        };













        $scope.tap_document_1 = {
            "type": "Commercial Registration",
            "number": "1234567890",
            "issuing_country": "SA",
            "issuing_date": new Date(),
            "expiry_date": new Date(),
            "images": []
        };
        $scope.tap_document_2 = {
            "type": "Commercial Registration",
            "number": "1234567890",
            "issuing_country": "SA",
            "issuing_date": new Date(),
            "expiry_date": new Date(),
            "images": []
        };
        $scope.tap_document_two = {
                "type": "",
                "number": "",
                "issuing_country": "",
                "issuing_date": new Date(),
                "expiry_date": new Date(),
                "images": []
            },


            $scope.tap_document_1 = {
                "type": "",
                "number": "",
                "issuing_country": "",
                "issuing_date": "",
                "expiry_date": "",
                "images": []
            };
        $scope.tap_document_two = {
                "type": "",
                "number": "",
                "issuing_country": "",
                "issuing_date": "",
                "expiry_date": "",
                "images": []
            },


            $scope.createTabBusinessObj = {
                "name": { "en": "Flexwarssfd" },
                "type": "",
                "entity": {
                    "legal_name": {
                        "en": ""
                    },
                    "is_licensed": 0,
                    "license_number": "",
                    "not_for_profit": 0,
                    "country": "KW",
                    "settlement_by": "",
                    "documents": [],
                    "bank_account": {
                        "iban": ""
                    }
                },
                "contact_person": {
                    "name": {
                        "first": "",
                        "last": ""
                    },
                    "contact_info": {
                        "primary": {
                            "email": "",
                            "phone": {
                                "country_code": "",
                                "number": ""
                            },
                            "primary_phone": ""
                        }
                    },
                    "is_authorized": 0
                },
                "brands": [{
                    "name": {
                        "en": ""
                    },
                    "logo": "",
                    "content": {
                        "tag_line": {
                            "en": ""
                        },
                        "about": {
                            "en": "The Flexwares is a shoe store company selling awsome and long lasting shoes. Come and check out our products online."
                        }
                    }
                }]
            }

        $scope.openCreateTapBusiness = function() {

            setTimeout(() => {
                $("#create_tap_business_destination").modal('show');
                initializePh();
            }, 500);
        }


        $scope.onSelectbusinessType = function(type) {
            $scope.createTabBusinessObj.type = type;
        }

        $scope.onSelectbusinessLicensed = function(is_licensed) {
            $scope.createTabBusinessObj.entity.is_licensed = is_licensed;
        }

        $scope.onSelectbusinessForProfit = function(not_for_profit) {
            $scope.createTabBusinessObj.entity.not_for_profit = not_for_profit;
        }

        $scope.onSelectbusinessPersonAuth = function(is_authorized) {
            $scope.createTabBusinessObj.contact_person.is_authorized = is_authorized;
        }



        $scope.file_to_upload_for_tap = function(File, index) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(e) {
                        $scope.$apply(function() {
                            $scope.uploadTabDocument(File[0], function(err, imageUrl) {
                                if (imageUrl) {
                                    switch (index) {
                                        case 1:
                                            $scope.tap_document_1.images.push(imageUrl);
                                            break;
                                        case 2:
                                            $scope.tap_document_2.images.push(imageUrl);
                                            break
                                    }
                                }
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


        $scope.uploadTabDocument = function(file, callback) { // Get Image Url
            if (!file) {
                return callback(null, file)
            }

            const data = {
                purpose: '',
                title: '',
                file_link_create: '',
                'file': file
            }

            services.POST_FORM_DATA(data, API.UPLOAD_TAP_FILE, (response) => {
                if (response && response.data) {
                    return callback(null, response.data)
                }
            })
        }










        $scope.createTapBusinessSubmit = function(form) {
            if (form.$submitted && form.$invalid) return;


            var data = {};

            let phone_data = $scope.iti.getSelectedCountryData();
            if (!!phone_data) {
                $scope.createTabBusinessObj.contact_person.contact_info.primary.phone.number = $scope.createTabBusinessObj.contact_person.contact_info.primary.primary_phone;
                $scope.createTabBusinessObj.contact_person.contact_info.primary.phone.country_code = phone_data['dialCode'];
            }

            $scope.createTabBusinessObj.entity.documents.push($scope.tap_document_1);
            $scope.createTabBusinessObj.entity.documents.push($scope.tap_document_2)



            data['business_profile_json'] = $scope.createTabBusinessObj;

            services.POST_DATA(data, API.CREATE_TAP_BUSINESS, function(response) {
                $scope.message = 'Success';
                services.SUCCESS_MODAL(true);
            });



        }

    }
]);