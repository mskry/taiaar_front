/* ==================== App Global Constants ==================== */

Royo.constant('constants', {
    APPNAME: 'Royo',

    /************* DEV ************/
    // BASEURL: 'https://ishan-api.royodev.tk',//
    BASEURL: 'https://api.taiaar.com', // 'https://api.royoapps.com', //'https://gagan-api.royodev.tk',//https://api.royoapps.com
    ONBOARDING_BASE_API_URL: 'https://api.taiaar.com', // 'https://codebrew.royoapps.com',
    // BASEURL: 'https://api.pickitt.ae', // Pick It Url
    // ONBOARDING_BASE_API_URL: 'https://api.pickitt.ae', // Pi/ck It Url
    IP_ADDRESS: '52.43.236.85',
    BILLING_LINK: 'https://billing.royoapps.com',
    IS_DEV: true,

    /************* LIVE ************/
    // BASEURL: 'https://api-saas.royoapps.com',
    // ONBOARDING_BASE_API_URL: 'https://onboarding-livebkend.royoapps.com',
    // IP_ADDRESS: '44.230.101.71',
    // BILLING_LINK: 'https://royo-billing.royoapps.com',
    // IS_DEV: false,

    /************* STAGE ************/
    // BASEURL: 'https://api.royostaging.com',
    // ONBOARDING_BASE_API_URL: 'https://onboarding-api.royostaging.com',
    // IP_ADDRESS: '44.241.122.142',
    // BILLING_LINK: 'https://royo-billing.royoapps.com',
    // IS_DEV: false,

    /************* TEST ************/
    // BASEURL: 'https://nitin-api.royodev.tk',
    // ONBOARDING_BASE_API_URL: 'https://onboarding-livebkend.royoapps.com', // 'https://codebrew.royoapps.com', 
    // IP_ADDRESS: '52.43.236.85',
    // BILLING_LINK: 'https://billing-test.royoapps.com',
    // // IS_DEV: false,

    /************* PANEL DOMAIN ************/
    DOMAIN: window.location.origin,
    // DOMAIN: 'https://cityruner-admin.royoapps.com',
    // DOMAIN: 'https://yourbutler-admin.royoapps.com',
    //DOMAIN: 'https://faindy-admin.royostaging.com',
    // DOMAIN: 'https://fooooder-admin.royoapps.com',
    // DOMAIN: 'https://ecommercen-admin.royoapps.com',
    // DOMAIN: 'https://ecommercesingledev-admin.royoapps.com',
    // DOMAIN: 'https://ecommercensingledev-admin.royoapps.com',
    // DOMAIN: 'https://foodsingledev-admin.royoapps.com',
    // DOMAIN: 'https://zipeatsdev-admin.royokart.com',
    // DOMAIN: 'https://yammfood-admin.royoapps.com',
    // DOMAIN: 'https://homerr-admin.royoapps.com',
    // DOMAIN: 'https://medexpertt-admin.royoapps.com',
    // DOMAIN: 'https://palmmarketplace.royoapps.com',
    // DOMAIN: 'https://homerr-admin.royoapps.com',
    // DOMAIN: 'https://admin.pickupmyweed.com',
    // DOMAIN: 'https://healthcare-admin.royoapps.com',
    // DOMAIN: 'https://jiibli-admin.royoapps.com',
    // DOMAIN: 'https://tianquiz-admin.royoapps.com',
    // DOMAIN: 'https://fooodo-admin.royoapps.com',
    // DOMAIN: 'https://hungerdeliverydemo-admin.royoapps.com',
    // DOMAIN: 'https://wrclive-admin.royoapps.com',
    // DOMAIN: 'https://theclikat-admin.royoapps.com',
    // DOMAIN: 'https://royoessentials-admin.royoapps.com',
    // DOMAIN: 'https://alikhlass-admin.royoapps.com',
    // DOMAIN: 'https://icecreamhub.royoapps.com',
    // DOMAIN: 'https://zmarkett.royoapps.com',
    // DOMAIN: 'https://admin.zipeats.ca',
    // DOMAIN: 'https://foodroyo-admin.royoapps.com',
    // DOMAIN: 'https://admin.ajak.app',
    // DOMAIN: 'https://erastorelive-admin.royoapps.com',
    // DOMAIN: 'https://tianquiz-admin.royoapps.com',
    // DOMAIN: 'https://clickattest.royoapps.com',
    // DOMAIN: 'https://admin.pideyummy.com',
    // DOMAIN: 'https://dingo-admin.royoapps.com',
    // DOMAIN: 'https://admin.localflavorkc.com',
    // DOMAIN: 'https://tidycoop01-admin.royoapps.com',
    // DOMAIN: 'https://admin.faindy.net',
    // DOMAIN: 'https://maazaj.com',
    // DOMAIN: 'https://admin.localflavorkc.com',
    // DOMAIN: 'https://www.migurumarket.cl',
    // DOMAIN: 'https://littleceasors-admin.royoapps.com',
    // DOMAIN: 'https://admin.foodydoo.com',
    // DOMAIN: 'https://foodydoolive.royoapps.com',
    // DOMAIN: 'https://admin.epitodelivery.com',
    // DOMAIN: 'https://doorstepdelivery-admin.royoapps.com',
    // DOMAIN: 'https://vubzi-admin.royoapps.com',
    // DOMAIN: 'https://admin.pickupmyweed.com',
    // DOMAIN: 'https://pickylive-admin.royoapps.com',
    // DOMAIN: 'https://admin.bodyformula.ca',
    // DOMAIN: 'https://mexfly.royoapps.com',
    // DOMAIN: 'https://freshfarms.royoapps.com',
    // DOMAIN: 'https://dailyooz.com',
    // DOMAIN: 'https://royohomes.royoapps.com',
    //DOMAIN: 'https://tophandscleaningservice-admin.royoapps.com',
    // DOMAIN: 'https://yayeen1.royoapps.com',
    // DOMAIN: 'https://rushdelivery.royoapps.com',
    // DOMAIN: 'https://delifood-admin.royoapps.com',
    // DOMAIN: 'https://foodydoo.com',
    // DOMAIN: 'https://admin.mexflyapp.com',
    // DOMAIN: 'https://rush.rest',
    // DOMAIN: 'https://tophandscleaningservice-admin.royoapps.com',
    // DOMAIN: 'https://admin.wholesaledrop.com.au',
    // DOMAIN: 'https://unogrocery.royoapps.com',
    // DOMAIN: 'https://erastore.lk',
    // DOMAIN: 'https://yourbutler-admin.royoapps.com',
    // DOMAIN: 'https://meezzaafood.com',
    // DOMAIN: 'https://delibear.royoapps.com',
    // DOMAIN: 'https://4n1delivery-admin.royoapps.com',
    // DOMAIN: 'https://sangtini-admin.royoapps.com',
    // DOMAIN: 'https://royokarts.royoapps.com',
    // DOMAIN: 'https://taiaar-admin.royoapps.com',
    // DOMAIN: 'https://foodhut-admin.royokart.com',
    // DOMAIN: 'https://scrubble-admin.royostaging.com',
    // DOMAIN: 'https://homeservicesingledev-admin.royokart.com',
    // DOMAIN: 'https://scrubble.in',
    // DOMAIN: 'https://dzadmin.dailyooz.com',
    // DOMAIN: 'https://fooooder-admin.royoapps.com',
    // DOMAIN: 'https://taifam-admin.royoapps.com',
    // DOMAIN: 'https://goodopenbox-admin.royoapps.com',
    // DOMAIN: 'https://affar-admin.royoapps.com',
    // DOMAIN: 'https://admin.ulagula.com',
    // DOMAIN: 'https://littlecaesarsbahrain.com',
    //DOMAIN: 'https://admin.meezzaafood.com',
    //DOMAIN: 'https://yayeen-admin.royostaging.com',

    // DOMAIN: 'https://admin.fijieats.com',
    // DOMAIN: 'https://rappido-admin.royoapps.com',
    // DOMAIN: 'https://delibear-admin.royoapps.com',

    // DOMAIN: 'https://homent-admin.royoapps.com',

    // DOMAIN: 'https://vibes-admin.royoapps.com',
    //DOMAIN: 'https://hungrycanadian-admin.royoapps.com',

    // DOMAIN: 'https://faindy-admin.royostaging.com',

    // DOMAIN: 'https://admin.myurbanfix.ca',

    // DOMAIN: 'https://admin.bellbee.in',
    // DOMAIN: 'https://bookmytable-admin.royokart.com',
    // DOMAIN: 'https://craveqatar123-admin.royokart.com',
    // DOMAIN: 'https://rushdeliveryfood-admin.royokart.com',


    // DOMAIN: 'https://goodopenbox-admin.royokart.com',
    // DOMAIN: 'https://bookmytable-admin.royokart.com',
    // DOMAIN: 'https://admin.pickitt.ae',
    // DOMAIN: 'https://homnnet-admin.royokart.com',
    // DOMAIN: 'https://admin.pickitt.ae',
    // DOMAIN: 'https://tuberr-admin.royokart.com',
    // DOMAIN: 'https://admin.ozayer.com.au',
    DOMAIN: 'https://admin.taiaar.com',
    // DOMAIN: 'https://yammfood-admin.royoapps.com',

    GOOGLE_MAPS_KEY: '',
    SECRET_DBKEY: localStorage.getItem('dbKey'),
    AGENT_SECRET_DBKEY: localStorage.getItem('agent_db_key'),

    SUCCESS: 4,
    ERROR: 2,
    ACCESSTOKEN: localStorage.getItem('RoyoAccessToken') ? localStorage.getItem('RoyoAccessToken') : "",

    IMAGE_TYPE: ['image/jpg', 'image/jpeg', 'image/png']
});


Royo.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 20000;
    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.interceptors.push('httpInterceptor');
}]);

Royo.config(($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) => {

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('/', {
            url: "",
            controller: 'LayoutCtrl',
            data: { pageTitle: 'Login', specialClass: 'app-bg' },

        })
        .state('login', {
            url: "/login",
            templateUrl: "views/common/login.html",
            controller: 'LoginCtrl',
            data: { pageTitle: 'Login', specialClass: 'app-bg' },
        })
        .state('supplierRegistration', {
            url: "/supplier-registration",
            templateUrl: "views/common/supplier-registration.html",
            controller: 'SupplierRegistrationCtrl',
            data: { pageTitle: 'Supplier Registration', specialClass: 'app-bg' },
        })
        .state('deliveryCompanyRegistration', {
            url: "/delivery-company-registration",
            templateUrl: "views/common/delivery-company-registration.html",
            controller: 'DeliveryCompanyRegistrationCtrl',
            data: { pageTitle: 'Delivery Company Registration', specialClass: 'app-bg' },
        })
        .state('privacy', {
            url: "/privacy",
            templateUrl: "views/common/privacy.html",
            controller: 'PrivacyTermsCtrl',
            data: { pageTitle: 'Privacy Policy', specialClass: 'app-bg' },
        })
        .state('terms', {
            url: "/terms",
            templateUrl: "views/common/terms.html",
            controller: 'PrivacyTermsCtrl',
            data: { pageTitle: 'T & C', specialClass: 'app-bg' },

        })

    .state('success', {
        url: "/success",
        templateUrl: 'views/payment-gateway/success-payment.html',
        controller: 'paymentSuccessCtrl',
        data: { pageTitle: 'Payment Success' }
    })

    .state('failure', {
        url: "/failure",
        templateUrl: 'views/payment-gateway/failure-payment.html',
        // controller: 'paymentFailureCtrl',
        data: { pageTitle: 'Payment failure' }
    })

    .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html"
        })
        .state('index.dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            controller: 'DashboardCtrl',
            data: { pageTitle: 'Dashboard' },

        })
        .state('index.dashboardSupplier', {
            url: "/supplier-dashboard?sup_id&name",
            templateUrl: "views/dashboard.html",
            controller: 'DashboardCtrl',
            data: { pageTitle: 'Dashboard' },
        })
        .state('index.dashboardShipping', {
            url: "/delivery-company-dashboard",
            templateUrl: "views/shipping_dashboard.html",
            controller: 'ShippingDashboardCtrl',
            data: { pageTitle: 'Dashboard' },
        })

    .state('profile', {
            abstract: true,
            url: "/profile-setup",
            templateUrl: "views/common/content.html"
        })
        .state('profile.users', {
            url: "/users-profile",
            templateUrl: "views/client_profile.html",
            controller: 'ClientProfileCtrl',
            data: { pageTitle: 'Client Profile' },
        })
        .state('profile.driverWallet', {
            url: "/driver-wallet-details?user_id",
            templateUrl: "views/driver-wallet-details.html",
            controller: 'DriverWalletCtrl',
            data: { pageTitle: 'Driver Wallet Details' },
        })
        .state('profile.userWallet', {
            url: "/user-wallet-details?user_id",
            templateUrl: "views/user_wallet_details.html",
            controller: 'UserWalletCtrl',
            data: { pageTitle: 'User Wallet Details' },
        })
        .state('profile.admin', {
            url: "/admin-profile",
            templateUrl: "views/admin_profile.html",
            controller: 'AdminProfileCtrl',
            data: { pageTitle: 'Admin Profile' }
        })
        .state('profile.admin_permissions', {
            url: "/admin-permissions?id&user",
            templateUrl: "views/admin_permission.html",
            controller: 'AdminPermissionCtrl',
            data: { pageTitle: 'Admin Access Information' }
        })
        .state('profile.supplier', {
            url: "/supplier-profile",
            templateUrl: "views/supplier_profile.html",
            controller: 'SupplierProfileCtrl',
            data: { pageTitle: 'Supplier Profile' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })

    .state('profile.deliveryCompanySetup', {
            url: "/delivery-company-profile-setup",
            templateUrl: "views/delivery_company_details.html",
            controller: 'DeliveryCompanyProfileSetupCtrl',
            data: { pageTitle: 'Supplier Profile Setup' },
        })
        .state('profile.deliveryCompanySetup.step_one', {
            url: '/step_one?id&tab',
            templateUrl: 'views/delivery_company_step_one.html',
            controller: 'DeliveryCompanyProfileSetupOneCtrl',
            data: { pageTitle: 'Delivery Company Profile Setup | Step 1' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })
        .state('profile.supplierSetup', {
            url: "/supplier-profile-setup",
            templateUrl: "views/supplier_details.html",
            controller: 'SupplierProfileSetupCtrl',
            data: { pageTitle: 'Supplier Profile Setup' },
        })
        .state('profile.supplierSetup.step_one', {
            url: '/step_one?id&tab&multi_b&b_id',
            templateUrl: 'views/wizard/step_one.html',
            controller: 'SupplierProfileSetupOneCtrl',
            data: { pageTitle: 'Supplier Profile Setup | Step 1' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })
        .state('profile.supplierSetup.step_two', {
            url: '/step_two?id&tab&multi_b&b_id',
            templateUrl: 'views/wizard/step_two.html',
            controller: 'SupplierProfileSetupTwoCtrl',
            data: { pageTitle: 'Supplier Profile Setup | Step 2' },

        })
        .state('profile.supplierSetup.step_three', {
            url: '/step_three?id&tab',
            templateUrl: 'views/wizard/step_three.html',
            controller: 'SupplierProfileSetupThreeCtrl',
            data: { pageTitle: 'Supplier Profile Setup | Step 3' }
        })
        .state('profile.supplierSetup.step_four', {
            url: '/step_four?id&tab',
            templateUrl: 'views/wizard/step_four.html',
            controller: 'SupplierProfileSetupFourCtrl',
            data: { pageTitle: 'Supplier Profile Setup | Step 4' }
        })
        .state('profile.supplierSetup.step_five', {
            url: '/step_five?id&tab',
            templateUrl: 'views/wizard/step_five.html',
            controller: 'SupplierProfileSetupFiveCtrl',
            data: { pageTitle: 'Supplier Profile Setup | Step 5' }
        })
        .state('profile.supplierSetup.order-distance', {
            url: "/order-distance?supplierId&tab",
            templateUrl: "views/order_distance.html",
            controller: "OrderDistanceCtrl",
            data: { pageTitle: 'Order Distance' }
        })
        .state('profile.supplierSetup.order-weight', {
            url: "/order-weight?supplierId&tab",
            templateUrl: "views/order_weight.html",
            controller: "OrderWeightCtrl",
            data: { pageTitle: 'Order Weight' }
        })
        .state('profile.supplierSetup.orderwise-gateways', {
            url: "/orderwise-gateways?supplierId&tab",
            templateUrl: "views/orderwise_gateways.html",
            controller: "OrderwiseGatewaysCtrl",
            data: { pageTitle: 'Order Wise Gateways' }
        })

    .state('profile.supplierSetup.supplier-tags', {
        url: "/supplier-tags?supplierId&tab",
        templateUrl: "views/supplier-tag.html",
        controller: "SupplierTagsCtrl",
        data: { pageTitle: 'Supplier Tags' }
    })

    .state('profile.supplierSetup.supplier-zones', {
        url: "/supplier-zones?supplierId&tab",
        templateUrl: "views/zone-geofence.html",
        controller: "ZoneGeofenceCtrl",
        data: { pageTitle: 'Zone Geofence' }
    })

    .state('profile.supplierSetup.scheduling', {
            url: '/scheduling?id&b_id&tab&dine_in',
            templateUrl: 'views/scheduling.html',
            controller: 'SchedulingCtrl',
            data: { pageTitle: 'Scheduling' }
        })
        .state('profile.supplierSetup.tableBooking', {
            url: '/table-booking?id&b_id&tab',
            templateUrl: 'views/table-booking.html',
            controller: 'TableBookingCtrl',
            data: { pageTitle: 'Table Booking' }
        })
        .state('profile.supplierSetup.deliveryCompany', {
            url: '/delivery-company?id&tab',
            templateUrl: 'views/supplier-delivery-company.html',
            controller: 'SupplierDeliveryCompanyCtrl',
            data: { pageTitle: 'Delivery Company' }
        })

    .state('profile.deliveryCompany', {
        url: "/delivery-company-profile",
        templateUrl: "views/delivery_company_profile.html",
        controller: 'DeliveryCompanyProfileCtrl',
        data: { pageTitle: 'Delivery Company Profile' },
        resolve: {
            loadPlugin: function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'summernote',
                    files: ['js/components/plugins/summernote/summernote.css',
                        'js/components/plugins/summernote/summernote-bs3.css',
                        'js/components/plugins/summernote/summernote.min.js',
                        'js/components/plugins/summernote/angular-summernote.min.js'
                    ]
                }]);
            }
        }
    })

    .state('profile.sup_admin_details', {
            url: "/supplier-subadmin-details?id&user?sup_id",
            templateUrl: "views/supplier_admin_details.html",
            controller: 'SupSubAdminDetailCtrl',
            data: { pageTitle: 'Supplier Sub Admin Access Information' }
        })
        .state('profile.agent', {
            url: "/agent-profile?id&edit&page",
            templateUrl: "views/agent_profile.html",
            controller: 'AgentProfileCtrl',
            data: { pageTitle: 'Agent Profile' }
        })
        .state('profile.agent_slots', {
            url: "/agent-slots?id&name",
            templateUrl: "views/agent_slots.html",
            controller: 'AgentSlotsCtrl',
            data: { pageTitle: 'Agent Profile' }
        })
        .state('profile.agentServiceAssignment', {
            url: "/agent-service-assignment?id&name&sup_id&success",
            templateUrl: "views/agentServiceAssignment.html",
            controller: 'ServiceAssignmentCtrl',
            data: { pageTitle: 'Agent Profile' }
        })
        .state('profile.trackAgents', {
            url: "/track-agents",
            templateUrl: "views/track-agents.html",
            controller: "TrackAgentsCtrl",
            data: { pageTitle: 'Track Agent' }
        })
        .state('profile.agent-in-out', {
            url: "/agent-in-out?id",
            templateUrl: "views/agent_in_out.html",
            controller: "AgentInOutTimingCtrl",
            data: { pageTitle: 'Agent In Out' }
        })
        .state('production', {
            abstract: true,
            url: "/production",
            templateUrl: "views/common/content.html"
        })
        .state('production.productionSetup', {
            url: "/production-setup",
            templateUrl: "views/production.html",
            controller: 'ProductionCtrl',
            data: { pageTitle: 'Production Setup' }
        })
        .state('production.category', {
            url: "/category?is_add&cat_id&is_edit",
            templateUrl: "views/category_production.html",
            controller: 'CategoryProdCtrl',
            data: { pageTitle: 'Categories' }
        })
        .state('production.subCategory', {
            url: "/sub-category?cat_id&is_add&sub_cat_id&det_sub_cat_id&is_dt&sub_cat_ids",
            templateUrl: "views/sub_category_production.html",
            controller: 'SubCategoryProdCtrl',
            data: { pageTitle: 'Sub Categories' }
        })
        .state('production.detailedSubCategory', {
            url: "/detailed-sub-category?cat_id&is_add",
            templateUrl: "views/detailed_sub_category_production.html",
            controller: 'DetailedSubCategoryProdCtrl',
            data: { pageTitle: 'Detailed Sub Categories' }
        })
        .state('production.brands', {
            url: "/brands",
            templateUrl: "views/brands.html",
            controller: 'BrandsCtrl',
            data: { pageTitle: 'Brands' }
        })
        .state('production.questions', {
            url: "/questions?cat_id",
            templateUrl: "views/questions.html",
            controller: 'QuestionsCtrl',
            data: { pageTitle: 'Questions' }
        })
        .state('production.products', {
            url: "/products?is_add?cat_id&sub_cat_ids&product_id",
            templateUrl: "views/products.html",
            controller: 'ProductsProdCtrl',
            data: { pageTitle: 'Generic Products' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })
        .state('production.productVariants', {
            url: "/product-variants?id&type&branchId&supplierId&flow",
            templateUrl: "views/product-variants.html",
            controller: 'ProductVariantCtrl',
            data: { pageTitle: 'Product Variants' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })
        .state('production.packages', {
            url: "/packages",
            templateUrl: "views/packages.html",
            controller: 'PackageCtrl',
            data: { pageTitle: 'Packages' }
        })
        .state('production.banners', {
            url: "/banners",
            templateUrl: "views/banners.html",
            controller: 'BannersCtrl',
            data: { pageTitle: 'Banners' }
        })
        .state('production.assignProducts', {
            url: "/assign-products?id&b_id&cat_id&sub_cat_ids&multi_b",
            templateUrl: "views/assign_products.html",
            controller: 'ProductAssignmentCtrl',
            data: { pageTitle: 'Assign Products To Supplier' },

        })
        .state('production.supplierProducts', {
            url: "/supplier-products?is_add&id&user&level&b_id&sub_cat_ids&cat_id&product_id&multi_b&is_out_network",
            templateUrl: "views/supplier_products.html",
            controller: 'SupplierProductsCtrl',
            data: { pageTitle: 'Supplier Products' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })
        .state('production.customization', {
            url: "/customization?product_id&sup_id&b_id&level&assign",
            templateUrl: "views/addon.html",
            controller: 'AddonCtrl',
            data: { pageTitle: 'Add-Ons' },
        })
        .state('production.branchProducts', {
            url: "/branch-products?id&user&sup_id",
            templateUrl: "views/branch_products.html",
            controller: 'BranchProductsCtrl',
            data: { pageTitle: 'Supplier Branch Products' }
        })
        .state('orders', {
            abstract: true,
            url: "/orders",
            templateUrl: "views/common/content.html"
        })
        .state('orders.ordersManager', {
            url: "/order-manager?status&order_status&agent_id",
            templateUrl: "views/orders_manager.html",
            controller: 'OrderManagerCtrl',
            data: { pageTitle: 'Order Manager' }
        })
        .state('orders.ordersDescription', {
            url: "/order-description?order_id&tab",
            templateUrl: "views/order_description.html",
            controller: 'OrderDescCtrl',
            data: { pageTitle: 'Order Description' },

        })
        .state('orders.trackOrder', {
            url: "/track-order?order_id&user_id&lat&lng&supp_lat&supp_lng&supp_name",
            templateUrl: "views/track_order.html",
            controller: 'TrackOrderCtrl',
            data: { pageTitle: 'Track Order' }
        })
        .state('orders.trackOrderUser', {
            url: "/track-order-user?order_id&user_id&latlng",
            templateUrl: "views/track_order_user.html",
            controller: 'TrackOrderUserCtrl',
            data: { pageTitle: 'Track Order User' }
        })
        .state('orders.orderChat', {
            url: "/order-chat?order_id&created_id&name&type&message_id&id",
            templateUrl: "views/order_chat.html",
            controller: 'OrderChatCtrl',
            data: { pageTitle: 'Order Chat' }
        })
        .state('orders.ordersCreation', {
            url: "/create-order?sup_id&b_id&user_id&id&lat&lng",
            templateUrl: "views/order-creation.html",
            controller: 'OrderCreationCtrl',
            data: { pageTitle: 'Create Order' }
        })

    .state('account', {
            abstract: true,
            url: "/account",
            templateUrl: "views/common/content.html"
        })
        .state('account.accountSettings', {
            url: "/account-settings",
            templateUrl: "views/account.html",
            controller: 'AccountCtrl',
            data: { pageTitle: 'Account' }
        })
        .state('account.accountSettings.accountSettelment', {
            url: "/account-settelment",
            templateUrl: "views/account-settelment.html",
            controller: 'AccountSettelmentCtrl',
            data: { pageTitle: 'Account Settelment' }
        })
        .state('account.accountSettings.driversSettelment', {
            url: "/drivers-settelment",
            templateUrl: "views/drivers-settelment.html",
            controller: 'DriversSettlementCtrl',
            data: { pageTitle: 'Drivers Settelment' }
        })
        .state('account.accountSettings.driversStatement', {
            url: "/drivers-statement",
            templateUrl: "views/drivers_statement_payable.html",
            controller: 'DriversStatementCtrl',
            data: { pageTitle: 'Drivers Statement Payable Account' }
        })
        .state('account.accountSettings.supplierPayoutRequest', {
            url: "/supplier-payout-request",
            templateUrl: "views/supplier_payout_request.html",
            controller: 'SupplierPayoutRequestCtrl',
            data: { pageTitle: 'Supplier Payout Request' }
        })
        .state('account.accountSettings.agentPayoutRequest', {
            url: "/agent-payout-request",
            templateUrl: "views/agent_payout_request.html",
            controller: 'AgentPayoutRequestCtrl',
            data: { pageTitle: 'Agent Payout Request' }
        })
        .state('account.accountSettings.accountSettelment.payable', {
            url: "/payable",
            templateUrl: "views/account_payable.html",
            controller: 'AccountPayableCtrl',
            data: { pageTitle: 'Payable Account' }
        })
        .state('account.accountSettings.accountSettelment.receivable', {
            url: "/receivable",
            templateUrl: "views/account_receivable.html",
            controller: 'AccountReceivableCtrl',
            data: { pageTitle: 'Receivable Account' }
        })
        .state('account.accountSettings.supPayable', {
            url: "/account-statement",
            templateUrl: "views/account_statement_payable.html",
            controller: 'StatementAccountPayableCtrl',
            data: { pageTitle: 'Statement Payable Account' }
        })

    .state('reports', {
            abstract: true,
            url: "/reports",
            templateUrl: "views/common/content.html"
        })
        .state('reports.reportsTab', {
            url: "/reports-tab",
            templateUrl: "views/reports.html",
            controller: 'ReportsCtrl',
            data: { pageTitle: 'Order Reports' }
        })
        .state('reports.reportsTab.order', {
            url: "/order-reports",
            templateUrl: "views/reports_order.html",
            controller: 'orderReportsCtrl',
            data: { pageTitle: 'Order Reports' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })
        .state('reports.reportsTab.user', {
            url: "/user-reports",
            templateUrl: "views/reports_user.html",
            controller: 'userReportsCtrl',
            data: { pageTitle: 'User Reports' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'summernote',
                        files: ['js/components/plugins/summernote/summernote.css',
                            'js/components/plugins/summernote/summernote-bs3.css',
                            'js/components/plugins/summernote/summernote.min.js',
                            'js/components/plugins/summernote/angular-summernote.min.js'
                        ]
                    }]);
                }
            }
        })
        .state('reports.reportsTab.supplier', {
            url: "/supplier-reports",
            templateUrl: "views/reports_supplier.html",
            controller: 'supplierReportsCtrl',
            data: { pageTitle: 'Supplier Reports' }
        })
        .state('reports.reportsTab.agent', {
            url: "/agent-reports",
            templateUrl: "views/reports_agent.html",
            controller: 'agentReportCtrl',
            data: { pageTitle: 'Agent Reports' }
        })
        .state('reports.reportsTab.product', {
            url: "/product-reports",
            templateUrl: "views/report_product.html",
            controller: 'productReportCtrl',
            data: { pageTitle: 'Product Reports' }
        })
        .state('reports.reportsTab.subscription', {
            url: "/subscription-reports",
            templateUrl: "views/reports_subscription.html",
            controller: 'SubscriptionReportsCtrl',
            data: { pageTitle: 'Subscription Reports' }
        })
        .state('reports.reportsTab.user-subs-revenue', {
            url: "/user-subs-revenue-reports",
            templateUrl: "views/reports_user_subs_revenue.html",
            controller: 'UserSubsRevenueReportCtrl',
            data: { pageTitle: 'User Subscription Revenue Reports' }
        })
        .state('reports.reportsTab.supplier-subs-revenue', {
            url: "/supplier-subs-revenue-reports",
            templateUrl: "views/reports_supplier_subs_revenue.html",
            controller: 'SupplierSubsRevenueReportCtrl',
            data: { pageTitle: 'Supplier Subscription Revenue Reports' }
        })

    .state('promo', {
            abstract: true,
            url: "/promotions",
            templateUrl: "views/common/content.html"
        })
        .state('promo.listpromo', {
            url: "/list-promotions",
            templateUrl: "views/promo.html",
            controller: 'PromoCtrl',
            data: { pageTitle: 'Promotions' }
        })

    .state('voucher', {
            abstract: true,
            url: "/vouchers",
            templateUrl: "views/common/content.html"
        })
        .state('voucher.listvoucher', {
            url: "/list-vouchers",
            templateUrl: "views/voucher.html",
            controller: 'VoucherCtrl',
            data: { pageTitle: 'Vouchers' }
        })

    .state('subscription', {
            abstract: true,
            url: "/subscription",
            templateUrl: "views/common/content.html"
        })
        .state('subscription.plans', {
            url: "/plans",
            templateUrl: "views/subscription-plan.html",
            controller: 'SubscriptionPlanCtrl',
            data: { pageTitle: 'Subscription Plans' }
        })
        .state('subscription.userPlans', { // admin user subscription plans
            url: "/user-plans",
            templateUrl: "views/user-subscription-plan.html",
            controller: 'UserSubscriptionCtrl',
            data: { pageTitle: 'User Subscription Plans' }
        })
        .state('subscription.supplierPlans', {
            url: "/supplier-plans",
            templateUrl: "views/supplier-subscription-plan.html",
            controller: 'SupplierSubscriptionPlanCtrl',
            data: { pageTitle: 'Supplier Subscription Plans' }
        })
        .state('subscription.suppliersSubscriptionList', {
            url: "/suppliers-purchased-plan?filterby",
            templateUrl: "views/suppliers-subscription-list.html",
            controller: 'SuppliersSubscriptionListCtrl',
            data: { pageTitle: 'Suppliers Subscription Plans' }
        })

    .state('giftCard', {
            abstract: true,
            url: "/gift-card",
            templateUrl: "views/common/content.html"
        })
        .state('giftCard.list', {
            url: "/list",
            templateUrl: "views/gift-card.html",
            controller: 'GiftCardCtrl',
            data: { pageTitle: 'Gift Card' }
        })

    .state('notifications', {
            abstract: true,
            url: "/notifications",
            templateUrl: "views/common/content.html"
        })
        .state('notifications.list', {
            url: "/list",
            templateUrl: "views/notifications.html",
            controller: 'NotificationsCtrl',
            data: { pageTitle: 'Notifications' }
        })

    .state('ratings', {
            abstract: true,
            url: "/ratings",
            templateUrl: "views/common/content.html"
        })
        .state('ratings.ratingList', {
            url: "/rating-list",
            templateUrl: "views/ratings.html",
            controller: 'RatingsCtrl',
            data: { pageTitle: 'Ratings' }
        })
        .state('ratings.ratingList.products', {
            url: "/products",
            templateUrl: "views/products_ratings.html",
            controller: 'ProductsRatingsCtrl',
            data: { pageTitle: 'Products Ratings' }
        })
        .state('ratings.ratingList.suppliers', {
            url: "/suppliers",
            templateUrl: "views/suppliers_ratings.html",
            controller: 'SuppliersRatingsCtrl',
            data: { pageTitle: 'Products Ratings' }
        })

    .state('loyalty', {
            abstract: true,
            url: "/loyalty",
            templateUrl: "views/common/content.html"
        })
        .state('loyalty.plans', {
            url: "/plans",
            templateUrl: "views/loyalty-points.html",
            controller: 'LoyaltyCtrl',
            data: { pageTitle: 'Loyalty Points' }
        })

    .state('feedback', {
            abstract: true,
            url: "/feedback",
            templateUrl: "views/common/content.html"
        })
        .state('feedback.list', {
            url: "/list",
            templateUrl: "views/feedback.html",
            controller: 'FeedbackCtrl',
            data: { pageTitle: 'Feedback' }
        })
        .state('feedback.suggestions', {
            url: "/suggestions",
            templateUrl: "views/suggestions.html",
            controller: 'SuggestionsCtrl',
            data: { pageTitle: 'Suggestions' }
        })

    .state('index.currency', {
        url: "/currency",
        templateUrl: "views/currency.html",
        controller: 'AdminCurrencyCtrl',
        data: { pageTitle: 'Currency' }
    })

    .state('index.zone-geofence', {
        url: "/zone-geofence",
        templateUrl: "views/zone-geofence.html",
        controller: 'ZoneGeofenceCtrl',
        data: { pageTitle: 'Zone Geofence' }
    })

    .state('index.countryCode', {
        url: "/country-code",
        templateUrl: "views/countryCodes.html",
        controller: 'CountryCodes',
        data: { pageTitle: 'Currency' }
    })

    .state('index.settings', {
        url: "/settings?supplier_id",
        templateUrl: "views/settings.html",
        controller: 'SettingCtrl',
        data: { pageTitle: 'Settings' },
        resolve: {
            loadPlugin: function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'summernote',
                    files: ['js/components/plugins/summernote/summernote.css',
                        'js/components/plugins/summernote/summernote-bs3.css',
                        'js/components/plugins/summernote/summernote.min.js',
                        'js/components/plugins/summernote/angular-summernote.min.js'
                    ]
                }]);
            }
        }
    })

    .state('surveyMonkey', {
            abstract: true,
            url: "/surveyMonkey",
            templateUrl: "views/common/content.html"
        })
        .state('surveyMonkey.survey-monkey', {
            url: "/survey-monkey",
            templateUrl: "views/survey-monkey/survey-monkey.html",
            controller: 'SurveyMonkeyCtrl',
            data: { pageTitle: 'Survey Monkey' }
        })
        .state('surveyMonkey.survey-monkey-details', {
            url: "/survey-monkey-details?surveyId",
            templateUrl: "views/survey-monkey/survey-monkey-details.html",
            controller: 'SurveyMonkeyDetailsCtrl',
            data: { pageTitle: 'Survey Monkey Details' }
        })
        .state('surveyMonkey.survey-monkey-templates', {
            url: "/survey-monkey-templates",
            templateUrl: "views/survey-monkey/survey-monkey-templates.html",
            controller: 'SurveyMonkeyTemplatesCtrl',
            data: { pageTitle: 'Survey Monkey Templates' }
        })
        .state('surveyMonkey.survey-monkey-pages', {
            url: "/survey-monkey-pages?surveyId",
            templateUrl: "views/survey-monkey/survey-monkey-pages.html",
            controller: 'SurveyMonkeyPagesCtrl',
            data: { pageTitle: 'Survey Monkey Pages' }
        })
        .state('surveyMonkey.survey-monkey-page-details', {
            url: "/survey-monkey-page-details?pageId&surveyId",
            templateUrl: "views/survey-monkey/survey-monkey-page-details.html",
            controller: 'SurveyMonkeyPageDetailsCtrl',
            data: { pageTitle: 'Survey Monkey Page Details' }
        })

    .state('agentLoyality', {
            abstract: true,
            url: "/agentLoyality",
            templateUrl: "views/common/content.html"
        })
        .state('agentLoyality.agentLoyality-list', {
            url: "/agentLoyality-list",
            templateUrl: "views/agent-loyality/agent_loyality.html",
            controller: 'AgentLoyalityCtrl',
            data: { pageTitle: 'Agent Loyality' }
        })



    .state('vendorApproval', {
            abstract: true,
            url: "/vendorApproval",
            templateUrl: "views/common/content.html"
        })
        .state('vendorApproval.vendorApproval-list', {
            url: "/vendorApproval-list",
            templateUrl: "views/vendor-approval/vendor-update-listing.html",
            controller: 'VendorUpdateListingCtrl',
            data: { pageTitle: 'Vendor Update List' }
        })
        .state('vendorApproval.vendorApproval-request-list', {
            url: "/vendorApproval-request-list?supplierId",
            templateUrl: "views/vendor-approval/vendor-update-listing.html",
            controller: 'VendorUpdateListingCtrl',
            data: { pageTitle: 'Vendor Update List' }
        })
        .state('vendorApproval.vendorProductPriceApprovalList', {
            url: "/vendor-product-price-approval-request-list?supplierId",
            templateUrl: "views/vendor-approval/vendor-product-price-update-listing.html",
            controller: 'VendorProductPriceUpdateListingCtrl',
            data: { pageTitle: 'Vendor Update List' }
        })
        .state('vendorApproval.vendorProductApproval-list', {
            url: "/vendorProductApproval-list",
            templateUrl: "views/vendor-approval/vendor-product-update-listing.html",
            controller: 'VendorProductUpdateListingCtrl',
            data: { pageTitle: 'Vendor Product Update List' }
        })





    .state('socialEcommerce', {
            abstract: true,
            url: "/social-ecom",
            templateUrl: "views/common/content.html"
        })
        .state('socialEcommerce.post-report', {
            url: "/post-report",
            templateUrl: "views/social-ecommerce/post-report.html",
            controller: 'PostReportCtrl',
            data: { pageTitle: 'Post Reports' }
        })

    .state('sos', {
        abstract: true,
        url: "/sos",
        templateUrl: "views/common/content.html"
    })

    .state('sos.sos-list', {
            url: "/sos-list",
            templateUrl: "views/sos/sos-notification.html",
            controller: 'SOSNotificationCtrl',
            data: { pageTitle: 'SOS Notification' }
        })
        .state('vehicle', {
            abstract: true,
            url: "/vehicle",
            templateUrl: "views/common/content.html"
        })
        .state('vehicle.vehicle-category', {
            url: "/vehicle-category",
            templateUrl: "views/vehicle-category.html",
            controller: 'VehicleCategoryCtrl',
            data: { pageTitle: 'Vehicle Notification' }
        })
        .state('tags', {
            abstract: true,
            url: "/tags",
            templateUrl: "views/common/content.html"
        })
        .state('tags.supplier-tags', {
            url: "/supplier-tags?supplierId&tab",
            templateUrl: "views/supplier-tag.html",
            controller: "SupplierTagsCtrl",
            data: { pageTitle: 'Supplier Tags' }
        })

    .state('block', {
            abstract: true,
            url: "/block",
            templateUrl: "views/common/content.html"
        })
        .state('block.block-time', {
            url: "/block-time",
            templateUrl: "views/block-time.html",
            controller: "BlockTimeCtrl",
            data: { pageTitle: 'Block Time' }
        })

    .state('sales', {
        abstract: true,
        url: "/sales",
        templateUrl: "views/common/content.html"
    })

    .state('sales.sales-record-list', {
        url: "/sales-record-list",
        templateUrl: "views/sales-record/sales_record.html",
        controller: 'SalesRecordCtrl',
        data: { pageTitle: 'Sales Record' }
    })


    .state('vendor-order', {
            abstract: true,
            url: "/vendor-order",
            templateUrl: "views/common/content.html"
        })
        .state('vendor-order.vendor-order-creation', {
            url: "/vendor-order-creation",
            templateUrl: "views/vendor-order-creation/vendor-order-creation.html",
            controller: 'VendorOrderCreationCtrl',
            data: { pageTitle: 'Vendor Order Creation' }
        })



    .state('NotFound', {
        url: "/NotFound",
        templateUrl: "views/common/errorOne.html",
        data: { pageTitle: '404', specialClass: 'gray-bg' }
    })

    $urlRouterProvider.otherwise("/NotFound");


});

Royo.run(function($rootScope, $state) {
    $rootScope.$state = $state;
});