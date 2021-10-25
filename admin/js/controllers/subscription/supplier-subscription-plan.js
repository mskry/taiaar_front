Royo.controller('SupplierSubscriptionPlanCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', 'constants', '$translate',

    function ($scope, services, factories, API, pagerService, $rootScope, constants, $translate) {

        $scope.is_add = false;
        $scope.name = '';
        $scope.planList = [];
        $scope.selected_count = 0;
        $scope.isPlanActive = false;
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;
        $scope.currentPage = 1;
        $scope.sort_by = '';

        $scope.isMultiplePaymentGateway = false;
        $scope.selectedPaymentType = 'Stripe';
        $scope.planToPurchase = {};

        $scope.Receipt_url = null;
        $scope.Receipt_url_toView = '';
        $scope.selectedPlan = {}
        $scope.Knet = {
            transportalid: '',
            transportalpassword: '',
            resourcekey: ''
        }
        $scope.stripe = {}

        $scope.paymentGateways = {
            isStripe: false,
            oxxo: false,
            knet: false,
            paymaya: false
        }

        $scope.paymaya = {
            amount: '',
            currency: '',
            userId: '',
            successUrl: '',
            failureUrl: '',
        }

        const initStripe = function () {
            const stripeGateway = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'stripe')
            if (stripeGateway) {
                $scope.paymentGateways.isStripe = true
                const stripeConfig = stripeGateway.key_value_front.find(config => config.for_front == 1);
                $scope.stripe = window.Stripe(stripeConfig.value);
            }
        }


        var checkOtherPaymentGateways = function () {
            const oxxo = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'oxxo');
            if (!!oxxo) {
                // $scope.oxxo_detail = {...oxxo};
                let oxxo_name = oxxo.key_value_front.find(o => o.key == 'oxxo_name').value;
                let oxxo_account = oxxo.key_value_front.find(o => o.key == 'oxxo_account_id').value;
                $scope.oxxo_detail = {
                    oxxo_name,
                    oxxo_account
                }
                $scope.paymentGateways.oxxo = true
                console.log($scope.oxxo_detail);
                $scope.isMultiplePaymentGateway = true;
            }

            const knet = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'knet');
            if (!!knet) {
                $scope.Knet = {
                    transportalid: knet.key_value_front.find(o => o.key == 'TranportalId_KNET').value,
                    transportalpassword: knet.key_value_front.find(o => o.key == 'TranportalPassword_KNET').value,
                    resourcekey: knet.key_value_front.find(o => o.key == 'ResourceKey').value,
                }
                $scope.paymentGateways.knet = true
                $scope.isMultiplePaymentGateway = true;
            }

            const paymaya = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'paymaya');
            if (!!paymaya) {
                $scope.paymentGateways.paymaya = true
                $scope.isMultiplePaymentGateway = true;
            }

        }


        $scope.getPlanList = function (page) {
            const params = {
                supplier_id: $rootScope.active_supplier_id
            }

            services.GET_DATA(params, API.SUPPLIER_SUBSCRIPTION_PLANS, function (response) {
                $scope.planList = response.data;
                $scope.count = response.data.count;
                $scope.isPlanActive = response.data.some(item => item.is_active == 1);
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                if (!localStorage.getItem('supplierSubscription') && $scope.isPlanActive) {
                    const activePlan = response.data.find(item => item.is_active == 1);
                    localStorage.setItem('supplierSubscription', JSON.stringify([activePlan]));
                }
                initStripe()
                checkOtherPaymentGateways();
                $scope.dataLoaded = true;
            })
        }

        $scope.getPlanList(1);


        $scope.selectPayment = function (value) {
            $scope.selectedPaymentType = value;
        }

        $scope.openPaymentSteps = function () {

            $("#selectGateway").modal('hide');
            if ($scope.selectedPaymentType == 'Stripe') {
                $scope.purchasePlan($scope.planToPurchase);
            } else if ($scope.selectedPaymentType == 'OXXO') {
                $scope.Receipt_url_toView = '';
                $scope.Receipt_url = null;
                $("#uploadReceipt").modal('show');
            } else if ($scope.selectedPaymentType == 'PAYMAYA') {
                $scope.getpaymayaDetails()
            } else {
                localStorage.setItem('selectedPlan', JSON.stringify($scope.selectedPlan))
                localStorage.setItem('selectedPaymentSource', JSON.stringify($scope.selectedPaymentType.toLowerCase()))
                var link = document.createElement('a');
                link.href = `https://payment-knet.netsolutionindia.com/SendPerformREQuest.php?transportalid=${$scope.Knet.transportalid}&transportalpassword=${$scope.Knet.transportalpassword}&resourcekey=${$scope.Knet.resourcekey}&price=${$scope.selectedPlan.price}&return_url=${window.location.origin}`;
                console.log(link.href);
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        $scope.checkPaymentGateway = function (plan) {
            // let product_permission = plan.permissions.find(item => item.permission_name == 'PRODUCT')
            // if(product_permission && !product_permission.permissionTypes.find(permission => permission.is_active == 1)) {
            //     factories.invalidDataPop("You are not allowed to buy this plan as it does't have any permission for view services and you already have some services added in your account");
            //     return;
            // }

            $scope.selectedPlan = plan
            if ($scope.selectedPlan.price !== 0) {
                localStorage.setItem('selectedPlan', JSON.stringify($scope.selectedPlan))
                localStorage.setItem('selectedPaymentSource', JSON.stringify($scope.selectedPaymentType.toLowerCase()))
                if ($scope.isMultiplePaymentGateway) {
                    $scope.selectedPaymentType = 'Stripe';
                    $("#selectGateway").modal('show');
                    $scope.planToPurchase = {
                        ...plan
                    };
                } else {
                    $scope.purchasePlan(plan);
                }
            } else {
                $scope.purchaseFreePlan(plan);
            }
        }

        $scope.getpaymayaDetails = function () {
            $scope.paymaya = {
                amount: $scope.selectedPlan.price,
                currency: $rootScope.currency_name,
                userId: $rootScope.active_supplier_id,
                successUrl: `${window.location.origin}/#!/success`,
                failureUrl: `${window.location.origin}/#!/failure`,
            }

            services.POST_DATA($scope.paymaya, API.GET_PAYMAYA_PAYMENT_URL, function (response) {
                if (response.data && response.data.redirectUrl) {
                    localStorage.setItem('selectedPlan', JSON.stringify($scope.selectedPlan))
                    localStorage.setItem('selectedPaymentSource', JSON.stringify($scope.selectedPaymentType.toLowerCase()))
                    var link = document.createElement('a');
                    link.href = response.data.redirectUrl
                    console.log(link.href);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            })
        }

        $scope.purchasePlan = function (plan) {
            if (!$scope.stripe) {
                initStripe();
            }

            const params = {
                plan_id: plan.id,
                stripe_plan_id: plan.plan_id,
                supplier_id: $rootScope.active_supplier_id,
                type: 'card',
                successUrl: `${window.location.origin}/#!/success`,
                failureUrl: `${window.location.origin}/#!/failure`
            }

            services.GET_DATA(params, API.SUPPLIER_STRIP_SESSIONID, function (response) {
                $scope.stripe.redirectToCheckout({
                    sessionId: response.data.id
                }, function (response) {
                    console.log(response);
                });
            })
        }

        $scope.purchasePlanOxxo = function (plan) {

            if (!$scope.Receipt_url_toView) {
                factories.invalidDataPop("Please upload receipt image");
                return;
            }

            const params = {
                plan_id: plan.id,
                current_period_start: JSON.stringify(moment(new Date()).valueOf()),
                current_period_end: JSON.stringify(moment().add(1, plan.type).valueOf()),
                payment_source: 'oxxo',
                supplier_id: $rootScope.active_supplier_id,
                reciept_url: $scope.Receipt_url_toView
            }

            services.POST_DATA(params, API.SUPPLIER_BUY_SUBSCRIPTION, function (response) {

                $scope.Receipt_url = null;
                $scope.planToPurchase = {};
                $scope.Receipt_url_toView = '';
                $("#uploadReceipt").modal('hide');
                $scope.getPlanList(1);
            })
        }

        $scope.purchaseFreePlan = function (plan) {
            const params = {
                plan_id: plan.id,
                current_period_start: new Date().getTime().toString(),
                current_period_end: new Date(moment().add(1, plan.type)).getTime().toString(),
                payment_source: 'knet',
                supplier_id: $rootScope.active_supplier_id,
                reciept_url: ' '
            }

            services.POST_DATA(params, API.SUPPLIER_BUY_SUBSCRIPTION, function (response) {

                $scope.Receipt_url = null;
                $scope.planToPurchase = {};
                $scope.Receipt_url_toView = '';
                $scope.getPlanList(1);
            })
        }


        $scope.file_to_upload_for_doc = function (File, type) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 7) {
                    $scope.image_file = File[0];
                    var Obj = {};
                    Obj.image = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadImage(File[0], function (err, imageUrl) {
                                $scope.Receipt_url_toView = imageUrl;
                            })
                            $scope.Receipt_url = File[0];
                        });
                    }
                } else {
                    factories.invalidDataPop("Image size must be less than 7mb");
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };

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


        $scope.cancelSubscription = function (plan) {
            services.CONFIRM($translate.instant(`You want to cancel this subscription`), 
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.sub_id = plan.subscription_id;
                        if (plan.payment_source == 'oxxo' || plan.payment_source == 'knet' || plan.payment_source == 'paymaya') {
                            params.payment_source = 'oxxo';
                        }
                        services.POST_DATA(params, API.SUPPLIER_SUBSCRIPTION_CANCEL, function (response) {
                            $scope.message = $translate.instant(`Subscription Cancelled Successfully`);
                            services.SUCCESS_MODAL(true);
                            $scope.skip = 0;
                            $scope.getPlanList(1);
                            localStorage.removeItem('supplierSubscription');
                        });
                    }
                });
        }
    }
])