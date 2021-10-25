Royo.controller('LoginCtrl', ['$scope', '$rootScope', 'services', 'factories', 'constants', '$state', 'API', '$location', '$translate',
    function ($scope, $rootScope, services, factories, constants, $state, API, $location, $translate) {

        if ((!$location.path() || $location.path() === '/login') && constants.ACCESSTOKEN) {
            if ($rootScope.profile === 'SHIPPING')
                $state.go('index.dashboardShipping');
            else
                $state.go('index.dashboard');
        }

        $scope.login = {};
        $scope.view_password = false;
        $scope.profile_type = 'ADMIN';
        $scope.message = '';
        $scope.is_branch = 0;
        $rootScope.login_page_type = 0;

        $scope.is_need_two_way_authentication = false;
        $scope.is_resending_otp = false;
        $scope.otp_timer = 120;
        $scope.otp_time_up = false;

        $scope.loginData = {};
        $scope.otpObj = {
            phone_number: "",
            country_code: "",
            otp: ""
        };

        $scope.xx_phone_number = '';

        $scope.$on('login_page_type', getLoginPageType);
        function getLoginPageType($event, data) {
            $scope.profile_type = data == 2 ? 'SUPPLIER' : 'ADMIN';
            $rootScope.login_page_type = data;
        }

        if (localStorage.getItem('login_page_type')) {
            let login_page_type = localStorage.getItem('login_page_type');
            $scope.profile_type = login_page_type == 2 ? 'SUPPLIER' : 'ADMIN';
            $rootScope.login_page_type = login_page_type;
        }

        $scope.passwordView = function (view) {
            $scope.view_password = view;
        }

        $scope.checkBranch = function (is_branch) {
            $scope.is_branch = +is_branch;
        }

        $scope.changeProfile = function (profile_type) {
            $scope.profile_type = profile_type;
            setTimeout(() => {
                initialize();
            }, 1000);
        }


        var initialize = function () {
            var input = document.querySelector("#sup_phone");
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });
        }


        $scope.loginSubmit = function (loginForm) {
            if (loginForm.$submitted && loginForm.$invalid) return;

            let data = {};
            if ($rootScope.enable_signup_phone_only != 1 || ['ADMIN', 'SHIPPING'].includes($scope.profile_type)) {
                data.email = $scope.login.username;
            }
            else if ($rootScope.enable_signup_phone_only == 1 && $scope.profile_type == 'SUPPLIER') {
                let phone_data = $scope.iti.getSelectedCountryData();
                if (!!phone_data) {
                    data['phone_number'] = $scope.login.mobile;
                    data['iso'] = phone_data['iso2'];
                    data['country_code'] = phone_data['dialCode'];
                }

            }
            data.password = $scope.login.password;
            data.fcm_token = localStorage.getItem('fcm_token') ? localStorage.getItem('fcm_token') : '';

            if ($rootScope.login_page_type == 2 || ($rootScope.login_page_type == 0 && ['SUPPLIER', 'BRANCH'].includes($scope.profile_type))) {
                data['sub'] = $scope.profile_type === 'BRANCH' ? 2 : 1;
            }

            services.POST_DATA(data, API.LOGIN($scope), function (data) {
                if ([4, 200].includes(data.status)) {
                    $scope.loginData = data;
                    if ($rootScope.enable_admin_two_way_authentication == 0) {
                        setDataAfterLogin($scope.loginData);
                    }
                    else if ($rootScope.enable_admin_two_way_authentication == 1) {
                        $scope.xx_phone_number = $scope.loginData.data.phone_number.substr(-4);
                        $scope.otpObj.phone_number = data.data.phone_number;
                        $scope.otpObj.country_code = data.data.country_code;
                        $scope.is_need_two_way_authentication = true;
                        setTimeout(() => {
                            startOtpTimer();
                        }, 500);
                    }
                }
            });
        };


        $scope.submitOtpForm = function (otpForm) {
            if (otpForm.$submitted && otpForm.$invalid) return;
            var data = $scope.otpObj;
            services.POST_DATA(data, API.VERIFY_LOGIN_OTP, function (data) {
                if ([4, 200].includes(data.status)) {
                    // $scope.loginData.accessToken = data.data.accessToken;
                    setDataAfterLogin($scope.loginData);
                }
            });
        }

        $scope.resendOtp = function () {
            var data = $scope.otpObj;
            delete data['otp'];
            $scope.is_resending_otp = true;
            document.getElementById('resend_otp').style.display = 'none';
            services.POST_DATA(data, API.RESEND_LOGIN_OTP, function (data) {
                $scope.is_need_two_way_authentication = true;
                $scope.is_resending_otp = false;
                setTimeout(() => {
                    $scope.otp_timer = 120;
                    startOtpTimer();
                }, 500);
            });
        }


        startOtpTimer = function () {
            var m = Math.floor($scope.otp_timer / 60);
            var s = $scope.otp_timer % 60;

            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            var timerSpan = document.getElementById('timer');
            if (timerSpan) {
                timerSpan.innerHTML = m + ':' + s;
            }
            else {
                return;
            }
            $scope.otp_timer -= 1;
            if ($scope.otp_timer >= 0) {
                setTimeout(function () {
                    startOtpTimer($scope.otp_timer);
                }, 1000);
                return;
            }
            else {
                setTimeout(() => {
                    $scope.otp_time_up = true;
                    document.getElementById('otp_timer').style.display = 'none';
                    document.getElementById('resend_otp').style.display = 'block';
                }, 100);
            }
        }




        setDataAfterLogin = function (data) {
            var accessToken = data.data.access_token;
            var adminId = data.data.admin_id;
            var userCreatedId = data.data.user_created_id;
            $rootScope.allow_geofence_section_in_supplier_by_admin = 0
            $rootScope.allow_agent_section_in_supplier_by_admin = 0
            if (data.data.logo) {
                $rootScope.user_image = data.data.logo
                localStorage.setItem('user_image', data.data.logo);
            }
            constants.ACCESSTOKEN = accessToken;
            localStorage.setItem('RoyoAccessToken', accessToken);
            localStorage.setItem('adminId', adminId);
            localStorage.setItem('user_created_id', userCreatedId);
            localStorage.setItem('message_id', data.data.message_id);
            localStorage.setItem('is_superAdmin', data.data.is_super_admin);
            localStorage.setItem('is_head_branch', data.data.is_head_branch ? data.data.is_head_branch : 0);
            localStorage.setItem('profile_type', $scope.profile_type);
            localStorage.setItem('supplier_id', data.data.supplierId);
            localStorage.setItem('is_own_delivery', data.data.is_own_delivery);
            localStorage.setItem('banner_limit', data.data.banner_limit);
            localStorage.setItem('is_branch', $scope.is_branch);

            localStorage.setItem('phone_number', data.data.phone_number);
            localStorage.setItem('country_code', data.data.country_code);

            let user_name = '';
            switch ($scope.profile_type) {
                case 'ADMIN':
                    user_name = $rootScope.business_name
                    break;
                case 'SUPPLIER':
                    user_name = data.data.supplierName;
                    break;
                case 'BRANCH':
                    user_name = data.data.branchName;
                    break;
                case 'SHIPPING':
                    user_name = data.data.name;
                    localStorage.setItem('delivery_company_id', data.data.delivery_company_id);
                    break;
            }
            $rootScope.user_name = user_name
            localStorage.setItem('user_name', user_name);

            if (data.data.supplierSubscription && data.data.supplierSubscription.length) {
                localStorage.setItem('supplierSubscription', JSON.stringify(data.data.supplierSubscription));
            }
            if (!!data.data.section_data) {
                localStorage.setItem('section_data', JSON.stringify(data.data.section_data));
            }
            let branch_data = {
                is_multibranch: data.data.is_multibranch,
                default_branch_id: data.data.default_branch_id
            };

            if($rootScope.enable_geofence_section_in_supplier_by_admin == 1 && $rootScope.profile == 'SUPPLIER') {
                localStorage.setItem('allow_geofence_section_in_supplier_by_admin', JSON.stringify(data.data.allow_geofence_section_in_supplier));
                $rootScope.allow_geofence_section_in_supplier_by_admin = data.data.allow_geofence_section_in_supplier
            }
            if($rootScope.enable_dynamic_agent_section_in_supplier_by_admin == 1 && $rootScope.profile == 'SUPPLIER') {
                localStorage.setItem('allow_agent_section_in_supplier_by_admin', JSON.stringify(data.data.allow_agent_section_in_supplier));
                $rootScope.allow_agent_section_in_supplier_by_admin = data.data.allow_agent_section_in_supplier 
            }
            localStorage.setItem('branch_type', JSON.stringify(branch_data));
            $rootScope.profile = $scope.profile_type;
            $rootScope.$emit('profile_type', $scope.profile_type);
            $rootScope.active_supplier_id = data.data.supplierId;
            $rootScope.is_superAdmin = data.data.is_super_admin;
            $rootScope.is_head_branch = data.data.is_head_branch ? data.data.is_head_branch : 0;
            if (data.data.productCustomTabDescriptionLabelSelected) {
                localStorage.setItem('productCustomTabDescriptionLabelSelected', data.data.productCustomTabDescriptionLabelSelected);
            }
            if ($scope.profile_type == 'SHIPPING') {
                $state.go('index.dashboardShipping');
                $rootScope.delivery_company_id = data.data.delivery_company_id;
            } else {
                $state.go('index.dashboard');
            }
        }


        $scope.forgotPassword = function (forgotPassForm) {
            if (forgotPassForm.$submitted && forgotPassForm.$invalid) return;

            var data = {};
            data.email = ($scope.forgot.email).trim();
            services.POST_DATA(data, API.FORGOT_PASSWORD($scope), function (response) {
                $scope.message = response.message;
                $("#forgot_pass").modal('hide');
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.toSupplierReg = function () {
            if (localStorage.getItem('reg_domain')) {
                window.open(localStorage.getItem('reg_domain') + '/#!/supplier-registration');
            } else {
                $state.go('supplierRegistration');
                setTimeout(() => {
                    $rootScope.$broadcast('settingsLoaded', true);
                }, 500);
            }
        }

        $scope.toDeliveryCompanyReg = function () {
            $state.go('deliveryCompanyRegistration');
            setTimeout(() => {
                $rootScope.$broadcast('settingsLoaded', true);
            }, 500);
        }


        $scope.brand_image = 'img/v1_images/howcuttingdo.jpg';


        $scope.set_brand_image = function () {
            if ($rootScope.settings.key_value.brandImage_url) {
                $scope.brand_image = $rootScope.compressImage($rootScope.settings.key_value.brandImage_url, '300x620');
            }
            else {
                $scope.brand_image = 'img/v1_images/howcuttingdo.jpg';
            }

            return $scope.brand_image;
        }

    }
]);
