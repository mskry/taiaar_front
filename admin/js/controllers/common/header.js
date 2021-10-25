Royo.controller('HeaderCtrl', ['factories', '$rootScope', '$scope', 'services', '$state', '$location', 'constants', 'API', '$translate',
    function(factories, $rootScope, $scope, services, $state, $location, constants, API, $translate) {

        if (!constants.ACCESSTOKEN) {
            $state.go('login');
        }

        /************** DEV ONLY **************/
        $rootScope.api_arr = [
            'https://api.royoapps.com',
            'https://monu-api.netsolutionindia.com',
            'https://ishan-api.royodev.tk',
            'https://gagan-api.royodev.tk',
            'https://sk-backend.netsolutionindia.com',
            'https://naveen-api.netsolutionindia.com/'
        ];
        $rootScope.base_api = constants.BASEURL;
        $rootScope.is_dev = constants.IS_DEV;
        $rootScope.changeAPI = function(base_api) {
                $rootScope.base_api = base_api;
                constants.BASEURL = base_api;
            }
            /**************************************/

        $rootScope.billing_link = constants.BILLING_LINK;

        $rootScope.app_image = '';
        $rootScope.logo_data = {};
        $rootScope.user_name = '';

        $rootScope.is_custom_app = 1;

        $rootScope.active_route = $location.path();

        if (!!factories.getSettings()) {
            const settings = factories.getSettings();
            const screen_flow = settings.screenFlow[0];
            const key_value = settings.key_value;

            $rootScope.navBrandColor = key_value.header_color ? key_value.header_color : '#ffffff';

            $rootScope.flow_data = localStorage.getItem('flow_data') ? JSON.parse(localStorage.getItem('flow_data')) : [];
            if ($rootScope.flow_data.length) {
                $rootScope.flow_data_values = $rootScope.flow_data.map(flow => {
                    return flow.flow_type
                });
            }
            $rootScope.is_single_vendor = screen_flow.is_single_vendor;
            $rootScope.is_multiple_branch = screen_flow.is_multiple_branch;
            $rootScope.app_type = screen_flow.app_type;
            $rootScope.allow_dynamic_image_on_fotter = settings.key_value.allow_dynamic_image_on_fotter;
            $rootScope.single_vendor_id = settings.supplier_id;
            $rootScope.supplier_branch_id = settings.supplier_branch_id;
            $rootScope.is_pickup = settings.bookingFlow[0].is_pickup_order;
            $rootScope.is_branch_login = parseInt(localStorage.getItem('is_branch'));
            $rootScope.profile_image = key_value.logo_url ? key_value.logo_url : null;
            $rootScope.user_image = key_value.logo_url ? key_value.logo_url : null;
            $rootScope.payment_method = key_value.payment_method ? key_value.payment_method : null;
            $rootScope.localisation = factories.localisation();
            $rootScope.business_name = localStorage.getItem('business_name') ? localStorage.getItem('business_name') : 'Royo Apps';
            $rootScope.is_subscribed = localStorage.getItem('is_subscribed');
            $rootScope.currency = localStorage.getItem('currency') && localStorage.getItem('currency') != undefined ? localStorage.getItem('currency') : '$';
            $rootScope.is_white_label = localStorage.getItem('is_white_label');
            $rootScope.delivery_charge_algo = key_value.delivery_charge_algorithem ? key_value.delivery_charge_algorithem : (([1].includes(screen_flow.app_type) && screen_flow.app_type <= 10) ? 0 : 1);
            $rootScope.delivery_charge_type = key_value.delivery_charge_type ? key_value.delivery_charge_type : 0;
            $rootScope.user_service_fee = key_value.user_service_fee ? key_value.user_service_fee : 0;
            $rootScope.invoice_short = key_value.invoice_short ? key_value.invoice_short : 0;
            $rootScope.prescription = key_value.cart_image_upload ? key_value.cart_image_upload : 0;
            $rootScope.instruction = key_value.order_instructions ? key_value.order_instructions : 0;
            $rootScope.is_secondary_language = key_value.secondary_language && key_value.secondary_language != 0 ? 1 : 0;
            $rootScope.delivery_distance_unit = key_value.delivery_distance_unit ? key_value.delivery_distance_unit : 0;
            $rootScope.gift_card = key_value.gift_card ? key_value.gift_card : 0;
            $rootScope.is_subscription_plan = key_value.is_subscription_plan ? key_value.is_subscription_plan : 0;
            $rootScope.is_supplier_detail = key_value.is_supplier_detail ? key_value.is_supplier_detail : 0;
            $rootScope.agent_tip = key_value.agent_tip ? key_value.agent_tip : 0;
            $rootScope.product_pdf_upload = key_value.product_pdf_upload ? key_value.product_pdf_upload : 0;
            $rootScope.schedule_delivery = key_value.schedule_delivery ? key_value.schedule_delivery : 0;
            $rootScope.disable_app_sharing_message = key_value.disable_app_sharing_message ? key_value.disable_app_sharing_message : 0;
            $rootScope.is_return_request = key_value.is_return_request ? key_value.is_return_request : 0;
            $rootScope.is_tax_geofence = key_value.is_tax_geofence ? key_value.is_tax_geofence : 0;
            $rootScope.is_user_type = key_value.is_user_type ? key_value.is_user_type : 0; //god panel
            $rootScope.user_type_check = key_value.user_type_check ? key_value.user_type_check : 0; //admin     
            $rootScope.disable_import = key_value.disable_import ? key_value.disable_import : 0;
            $rootScope.bypass_otp = key_value.bypass_otp ? key_value.bypass_otp : 0;
            $rootScope.disable_agent_manual_assignment = key_value.disable_agent_manual_assignment ? key_value.disable_agent_manual_assignment : 0;
            $rootScope.ecom_agent_module = key_value.ecom_agent_module ? key_value.ecom_agent_module : 0;
            $rootScope.disable_supplier_category_add = key_value.disable_supplier_category_add ? key_value.disable_supplier_category_add : 0;
            $rootScope.is_db_clone = key_value.is_db_clone ? key_value.is_db_clone : 0;
            $rootScope.allow_supplier_category_edit = key_value.allow_supplier_category_edit ? key_value.allow_supplier_category_edit : 0;
            $rootScope.social_media_icons = key_value.social_media_icons ? key_value.social_media_icons : 0;
            $rootScope.hide_delivery_charges = key_value.hide_delivery_charges ? key_value.hide_delivery_charges : 0;
            $rootScope.no_agent_occupation = key_value.no_agent_occupation ? key_value.no_agent_occupation : 0;
            $rootScope.no_supplier_recommendation = key_value.no_supplier_recommendation ? key_value.no_supplier_recommendation : 0;
            $rootScope.allow_supplier_banner_edit = key_value.allow_supplier_banner_edit ? key_value.allow_supplier_banner_edit : 0;
            $rootScope.is_schdule_order = key_value.is_schdule_order ? key_value.is_schdule_order : 0;
            $rootScope.disable_supplier_order_accept = key_value.disable_supplier_order_accept ? key_value.disable_supplier_order_accept : 0;
            $rootScope.supplier_gst_no = key_value.supplier_gst_no ? key_value.supplier_gst_no : 0;
            $rootScope.disable_vendor_panel_document_approval = key_value.disable_vendor_panel_document_approval ? key_value.disable_vendor_panel_document_approval : 0;
            $rootScope.is_user_subscription = key_value.is_user_subscription ? key_value.is_user_subscription : 0;
            $rootScope.is_loyality_enable = key_value.is_loyality_enable ? key_value.is_loyality_enable : 0;
            $rootScope.hideAgentList = key_value.hideAgentList ? key_value.hideAgentList : 0;
            $rootScope.is_feedback_form_enabled = key_value.is_feedback_form_enabled ? key_value.is_feedback_form_enabled : 0;
            $rootScope.is_table_booking = key_value.is_table_booking ? key_value.is_table_booking : 0;
            $rootScope.is_product_weight = key_value.is_product_weight ? key_value.is_product_weight : 0;
            $rootScope.by_pass_tables_selection = key_value.by_pass_tables_selection ? key_value.by_pass_tables_selection : 0;
            $rootScope.supplier_country_of_origin = key_value.supplier_country_of_origin ? key_value.supplier_country_of_origin : 0;
            $rootScope.is_multiple_images = key_value.is_multiple_images ? key_value.is_multiple_images : 0;
            $rootScope.is_survey_monkey_enabled = key_value.is_survey_monkey_enabled ? key_value.is_survey_monkey_enabled : 0;
            $rootScope.agent_product_slot_assignment = key_value.agent_product_slot_assignment ? key_value.agent_product_slot_assignment : 0;
            $rootScope.is_enabled_multiple_base_delivery_charges = key_value.is_enabled_multiple_base_delivery_charges ? key_value.is_enabled_multiple_base_delivery_charges : 0;
            $rootScope.is_enabled_agent_base_price = key_value.is_enabled_agent_base_price ? key_value.is_enabled_agent_base_price : 0;
            $rootScope.is_social_ecommerce = key_value.is_social_ecommerce ? key_value.is_social_ecommerce : 0;
            $rootScope.is_currency_exchange_rate = key_value.is_currency_exchange_rate ? key_value.is_currency_exchange_rate : 0;
            $rootScope.branch_flow = key_value.branch_flow ? key_value.branch_flow : 0;
            $rootScope.is_vendor_registration = key_value.is_vendor_registration ? key_value.is_vendor_registration : 0;
            $rootScope.agent_verification_code_enable = key_value.agent_verification_code_enable ? key_value.agent_verification_code_enable : 0;
            $rootScope.hideAgentList = key_value.hideAgentList ? key_value.hideAgentList : 0;
            $rootScope.category_sequence = key_value.category_sequence ? key_value.category_sequence : 0;
            $rootScope.price_decimal_length = key_value.price_decimal_length ? parseInt(key_value.price_decimal_length) : 2;
            $rootScope.disable_supplier_category_block_delete = key_value.disable_supplier_category_block_delete ? key_value.disable_supplier_category_block_delete : 0;
            $rootScope.disable_tax = key_value.disable_tax ? key_value.disable_tax : 0;
            $rootScope.is_pos_enabled = key_value.is_pos_enabled ? key_value.is_pos_enabled : 0;
            $rootScope.show_platform_versions = key_value.show_platform_versions ? key_value.show_platform_versions : 0;
            $rootScope.hide_user_info_supplier = key_value.hide_user_info_supplier ? key_value.hide_user_info_supplier : 0;
            $rootScope.hide_agent_info_supplier = key_value.hide_agent_info_supplier ? key_value.hide_agent_info_supplier : 0;
            $rootScope.disable_supplier_delivery_status = key_value.disable_supplier_delivery_status ? key_value.disable_supplier_delivery_status : 0;
            $rootScope.hide_agent_tip = key_value.hide_agent_tip ? key_value.hide_agent_tip : 0;
            $rootScope.disable_product_report_columns_supplier = key_value.disable_product_report_columns_supplier ? key_value.disable_product_report_columns_supplier : 0;
            $rootScope.is_admin_placeholder_edit = key_value.is_admin_placeholder_edit ? key_value.is_admin_placeholder_edit : 0;
            $rootScope.hide_pickup_status = key_value.hide_pickup_status ? key_value.hide_pickup_status : 0;
            $rootScope.hide_agent_module = key_value.hide_agent_module ? key_value.hide_agent_module : 0;
            $rootScope.hide_service_fee_in_supplier = key_value.hide_service_fee_in_supplier ? key_value.hide_service_fee_in_supplier : 0;
            $rootScope.is_eligible_order_amount = key_value.is_eligible_order_amount ? key_value.is_eligible_order_amount : 0;
            $rootScope.allow_agent_request_popup_dynamic = key_value.allow_agent_request_popup_dynamic ? key_value.allow_agent_request_popup_dynamic : 0;
            $rootScope.disable_supplier_main_category_add_edit = key_value.disable_supplier_main_category_add_edit ? key_value.disable_supplier_main_category_add_edit : 0;
            $rootScope.supplier_category_not_required = key_value.supplier_category_not_required ? key_value.supplier_category_not_required : 0;
            $rootScope.disable_ontheway_delivered_admin = key_value.disable_ontheway_delivered_admin ? key_value.disable_ontheway_delivered_admin : 0;
            $rootScope.disable_supplier_promo_edit = key_value.disable_supplier_promo_edit ? key_value.disable_supplier_promo_edit : 0;
            $rootScope.enable_agent_pwd_reset = key_value.enable_agent_pwd_reset ? key_value.enable_agent_pwd_reset : 1;
            $rootScope.hide_app_links_supplier = key_value.hide_app_links_supplier ? key_value.hide_app_links_supplier : 0;
            $rootScope.disbale_add_sgent_supplier = key_value.disbale_add_sgent_supplier ? key_value.disbale_add_sgent_supplier : 0;
            $rootScope.hide_dashboard_orders = key_value.hide_dashboard_orders ? key_value.hide_dashboard_orders : 0;
            $rootScope.disable_admin_order_status = key_value.disable_admin_order_status ? key_value.disable_admin_order_status : 0;
            $rootScope.no_supplier_sub_admins = key_value.no_supplier_sub_admins ? key_value.no_supplier_sub_admins : 0;
            $rootScope.enable_supplier_config_closing_day = key_value.enable_supplier_config_closing_day ? key_value.enable_supplier_config_closing_day : 0;

            $rootScope.enable_braintree_google_pay = key_value.enable_braintree_google_pay ? key_value.enable_braintree_google_pay : 0;
            $rootScope.google_pay_merchant_id = key_value.google_pay_merchant_id ? key_value.google_pay_merchant_id : 0;

            $rootScope.admin_to_agent_chat = key_value.admin_to_agent_chat ? key_value.admin_to_agent_chat : 0;
            $rootScope.admin_to_supplier_chat = key_value.admin_to_supplier_chat ? key_value.admin_to_supplier_chat : 0;
            $rootScope.admin_to_user_chat = key_value.admin_to_user_chat ? key_value.admin_to_user_chat : 0;
            $rootScope.supplier_to_user_chat = key_value.supplier_to_user_chat ? key_value.supplier_to_user_chat : 0;
            $rootScope.addon_type_quantity = key_value.addon_type_quantity ? key_value.addon_type_quantity : 0;

            $rootScope.is_supplier_stripe_split_enabled = key_value.is_supplier_stripe_split_enabled ? key_value.is_supplier_stripe_split_enabled : 0;
            $rootScope.is_agent_stripe_split_enabled = key_value.is_agent_stripe_split_enabled ? key_value.is_agent_stripe_split_enabled : 0;
            $rootScope.create_stripe_connect_account = key_value.create_stripe_connect_account ? key_value.create_stripe_connect_account : '';
            $rootScope.show_user_stripe_account_connectivity = key_value.show_user_stripe_account_connectivity ? key_value.show_user_stripe_account_connectivity : '';

            $rootScope.is_agent_rating = key_value.is_agent_rating ? key_value.is_agent_rating : 0;
            $rootScope.is_supplier_rating = key_value.is_supplier_rating ? key_value.is_supplier_rating : 0;
            $rootScope.is_product_rating = key_value.is_product_rating ? key_value.is_product_rating : 0;

            $rootScope.selected_template = key_value.selected_template ? parseInt(key_value.selected_template) : 0;
            $rootScope.app_banner_width = key_value.app_banner_width ? parseInt(key_value.app_banner_width) : 0;
            $rootScope.order_request = key_value.order_request ? parseInt(key_value.order_request) : 0;
            $rootScope.product_prescription = key_value.product_prescription ? parseInt(key_value.product_prescription) : 0;
            $rootScope.dynamic_home_section = key_value.dynamic_home_section ? parseInt(key_value.dynamic_home_section) : 0;

            $rootScope.no_tax_in_category = key_value.no_tax_in_category ? key_value.no_tax_in_category : 0;
            $rootScope.no_category_images = key_value.no_category_images ? key_value.no_category_images : 0;
            $rootScope.no_banner_section = key_value.no_banner_section ? key_value.no_banner_section : 0;
            $rootScope.no_default_address = key_value.no_default_address ? key_value.no_default_address : 0;
            $rootScope.no_product_quantity = key_value.no_product_quantity ? key_value.no_product_quantity : 0;
            $rootScope.no_subcategory = key_value.no_subcategory ? key_value.no_subcategory : 0;
            $rootScope.is_dine_in = key_value.is_dine_in ? key_value.is_dine_in : 0;
            $rootScope.product_tags = key_value.product_tags ? key_value.product_tags : 0;
            $rootScope.user_id_proof = key_value.user_id_proof ? key_value.user_id_proof : 0;
            $rootScope.disable_supplier_edit_info = key_value.disable_supplier_edit_info ? key_value.disable_supplier_edit_info : 0;

            $rootScope.no_catalogue = key_value.no_catalogue ? key_value.no_catalogue : 0;
            $rootScope.no_food_item_admin = key_value.no_food_item_admin ? key_value.no_food_item_admin : 0;
            $rootScope.food_item_image_optional = key_value.food_item_image_optional ? key_value.food_item_image_optional : 0;
            $rootScope.food_item_desc_optional = key_value.food_item_desc_optional ? key_value.food_item_desc_optional : 0;
            $rootScope.category_desc_optional = key_value.category_desc_optional ? key_value.category_desc_optional : 0;
            $rootScope.category_img_optional = key_value.category_img_optional ? key_value.category_img_optional : 0;


            $rootScope.no_rating_review = key_value.no_rating_review ? key_value.no_rating_review : 0;
            $rootScope.no_send_notification = key_value.no_send_notification ? key_value.no_send_notification : 0;
            $rootScope.no_user_email = key_value.no_user_email ? key_value.no_user_email : 0;
            $rootScope.no_online_orders = key_value.no_online_orders ? key_value.no_online_orders : 0;
            $rootScope.no_cash_orders = key_value.no_cash_orders ? key_value.no_cash_orders : 0;
            $rootScope.ride_admin_url = key_value.ride_admin_url ? key_value.ride_admin_url : '';
            $rootScope.android_app_url = key_value.android_app_url ? key_value.android_app_url : '';
            $rootScope.ios_app_url = key_value.ios_app_url ? key_value.ios_app_url : '';
            $rootScope.hide_website_url = key_value.hide_website_url ? key_value.hide_website_url : 0;
            $rootScope.allow_agentwallet_to_pay_for_cashorder = key_value.allow_agentwallet_to_pay_for_cashorder ? key_value.allow_agentwallet_to_pay_for_cashorder : 0;
            $rootScope.is_sos_allow = key_value.is_sos_allow ? key_value.is_sos_allow : 0;
            $rootScope.show_status_info_settings = key_value.show_status_info_settings ? key_value.show_status_info_settings : 0;
            $rootScope.enable_user_signature = key_value.enable_user_signature ? key_value.enable_user_signature : 0;

            $rootScope.isProductCustomTabDescriptionEnable = key_value.isProductCustomTabDescriptionEnable ? key_value.isProductCustomTabDescriptionEnable : 0;
            $rootScope.addDocumentsInAgent = key_value.addDocumentsInAgent ? key_value.addDocumentsInAgent : 0;

            $rootScope.footer_type = key_value.footer_type ? parseInt(key_value.footer_type) : 0;

            $rootScope.hide_delivery_radius_vendor = key_value.hide_delivery_radius_vendor ? key_value.hide_delivery_radius_vendor : 0;
            $rootScope.hide_delivery_time_supplier = key_value.hide_delivery_time_supplier ? key_value.hide_delivery_time_supplier : 0;
            $rootScope.hide_promo_commission = key_value.hide_promo_commission ? key_value.hide_promo_commission : 0;
            $rootScope.hide_banner_category_supplier = key_value.hide_banner_category_supplier ? key_value.hide_banner_category_supplier : 0;
            $rootScope.no_website = key_value.no_website ? key_value.no_website : 0;
            $rootScope.disable_name_address_supplier = key_value.disable_name_address_supplier ? key_value.disable_name_address_supplier : 0;
            $rootScope.hide_delivery_charges_supplier = key_value.hide_delivery_charges_supplier ? key_value.hide_delivery_charges_supplier : 0;
            $rootScope.hide_agent_supplier = key_value.hide_agent_supplier ? key_value.hide_agent_supplier : 0;
            $rootScope.is_multicurrency_enable = key_value.is_multicurrency_enable ? key_value.is_multicurrency_enable : 0;
            $rootScope.enable_supplier_in_special_offer = key_value.enable_supplier_in_special_offer ? key_value.enable_supplier_in_special_offer : 0;

            $rootScope.no_supplier_delivery_charge = key_value.no_supplier_delivery_charge ? key_value.no_supplier_delivery_charge : 0;
            $rootScope.no_driver_detail_supplier = key_value.no_driver_detail_supplier ? key_value.no_driver_detail_supplier : 0;
            $rootScope.no_supplier_banner_section = key_value.no_supplier_banner_section ? key_value.no_supplier_banner_section : 0;
            $rootScope.add_variant_supplier = key_value.add_variant_supplier ? key_value.add_variant_supplier : 0;
            $rootScope.not_all_variant_required = key_value.not_all_variant_required ? key_value.not_all_variant_required : 0;
            $rootScope.addABNInAgent = key_value.addABNInAgent ? key_value.addABNInAgent : 0;
            $rootScope.disable_agent_manual_assignment_supplier = key_value.disable_agent_manual_assignment_supplier ? key_value.disable_agent_manual_assignment_supplier : 0;
            $rootScope.is_data_filter_by_country = key_value.is_data_filter_by_country ? key_value.is_data_filter_by_country : 0;

            $rootScope.hide_supplier_branch = key_value.hide_supplier_branch ? key_value.hide_supplier_branch : 0;
            $rootScope.no_supplier_promotion_section = key_value.no_supplier_promotion_section ? key_value.no_supplier_promotion_section : 0;

            $rootScope.wallet_module = key_value.wallet_module ? key_value.wallet_module : 0;
            $rootScope.is_mark_out_of_stock = key_value.is_mark_out_of_stock ? key_value.is_mark_out_of_stock : 0;
            $rootScope.is_abn_business = key_value.is_abn_business ? key_value.is_abn_business : 0;
            $rootScope.hide_supplier_accounting = key_value.hide_supplier_accounting ? key_value.hide_supplier_accounting : 0;
            $rootScope.is_laundry_theme = key_value.is_laundry_theme ? key_value.is_laundry_theme : 0;
            $rootScope.dropoff_buffer = key_value.dropoff_buffer ? key_value.dropoff_buffer : 0;

            $rootScope.is_single_menu = key_value.is_single_menu ? key_value.is_single_menu : 0;

            $rootScope.enable_size_chart_in_product = key_value.enable_size_chart_in_product ? key_value.enable_size_chart_in_product : 0;
            $rootScope.enable_country_of_origin_in_product = key_value.enable_country_of_origin_in_product ? key_value.enable_country_of_origin_in_product : 0;

            $rootScope.is_invoice_print_enable = key_value.is_invoice_print_enable ? key_value.is_invoice_print_enable : 0;
            $rootScope.is_tutorial_screen_enable = key_value.is_tutorial_screen_enable ? key_value.is_tutorial_screen_enable : 0;
            $rootScope.is_vehicle_category_enable = key_value.is_vehicle_category_enable ? key_value.is_vehicle_category_enable : 0;
            $rootScope.show_status_info_settings = key_value.show_status_info_settings ? key_value.show_status_info_settings : 0;
            $rootScope.is_update_price_enable = key_value.is_update_price_enable ? key_value.is_update_price_enable : 0;
            $rootScope.is_nhs_filter_enable = key_value.is_nhs_filter_enable ? key_value.is_nhs_filter_enable : 0;
            $rootScope.is_consider_qty_enable = key_value.is_consider_qty_enable ? key_value.is_consider_qty_enable : 0;
            $rootScope.is_minimum_distance_enable = key_value.is_minimum_distance_enable ? key_value.is_minimum_distance_enable : 0;
            $rootScope.enable_min_order_distance_wise = key_value.enable_min_order_distance_wise ? key_value.enable_min_order_distance_wise : 0;
            $rootScope.show_tags_for_suppliers = key_value.show_tags_for_suppliers ? key_value.show_tags_for_suppliers : 0;
            $rootScope.is_glassdoor_link = key_value.is_glassdoor_link ? key_value.is_glassdoor_link : 0;
            $rootScope.hide_ontheway_delivered_supplier = key_value.hide_ontheway_delivered_supplier ? key_value.hide_ontheway_delivered_supplier : 0;
            $rootScope.survey_monkey_access_token = key_value.survey_monkey_access_token ? key_value.survey_monkey_access_token : '';

            $rootScope.show_supplier_info_settings = key_value.show_supplier_info_settings ? key_value.show_supplier_info_settings : 0;

            $rootScope.is_alternate_about_us = key_value.is_alternate_about_us ? key_value.is_alternate_about_us : 0;

            $rootScope.is_variant_product_import = key_value.is_variant_product_import ? key_value.is_variant_product_import : 0;

            $rootScope.is_app_version_enable = key_value.is_app_version_enable ? key_value.is_app_version_enable : 0;

            $rootScope.is_flavor_of_week_enable = key_value.is_flavor_of_week_enable ? key_value.is_flavor_of_week_enable : 0;
            $rootScope.is_delivery_charge_weight_wise_enable = key_value.is_delivery_charge_weight_wise_enable ? key_value.is_delivery_charge_weight_wise_enable : 0;

            $rootScope.is_enable_delivery_type = key_value.is_enable_delivery_type ? key_value.is_enable_delivery_type : 0;
            $rootScope.is_enable_multiple_banner = key_value.is_enable_multiple_banner ? key_value.is_enable_multiple_banner : 0;
            $rootScope.is_enable_orderwise_gateways = key_value.is_enable_orderwise_gateways ? key_value.is_enable_orderwise_gateways : 0;

            $rootScope.allow_agent_request_popup_dynamic = key_value.allow_agent_request_popup_dynamic ? key_value.allow_agent_request_popup_dynamic : 0;

            $rootScope.dynamic_order_type_client_wise = key_value.dynamic_order_type_client_wise ? key_value.dynamic_order_type_client_wise : 0;
            $rootScope.dynamic_order_type_client_wise_delivery = key_value.dynamic_order_type_client_wise_delivery ? key_value.dynamic_order_type_client_wise_delivery : 0;
            $rootScope.dynamic_order_type_client_wise_pickup = key_value.dynamic_order_type_client_wise_pickup ? key_value.dynamic_order_type_client_wise_pickup : 0;
            $rootScope.dynamic_order_type_client_wise_dinein = key_value.dynamic_order_type_client_wise_dinein ? key_value.dynamic_order_type_client_wise_dinein : 0;

            $rootScope.billing_link = constants.BILLING_LINK;

            $rootScope.app_image = '';
            $rootScope.logo_data = {};
            // $rootScope.user_name = '';

            $rootScope.is_custom_app = 1;

            $rootScope.active_route = $location.path();

            if (!!factories.getSettings()) {
                const settings = factories.getSettings();
                const screen_flow = settings.screenFlow[0];
                const key_value = settings.key_value;

                $rootScope.navBrandColor = key_value.header_color ? key_value.header_color : '#ffffff';

                $rootScope.flow_data = localStorage.getItem('flow_data') ? JSON.parse(localStorage.getItem('flow_data')) : [];
                if ($rootScope.flow_data.length) {
                    $rootScope.flow_data_values = $rootScope.flow_data.map(flow => {
                        return flow.flow_type
                    });
                }
                $rootScope.is_single_vendor = screen_flow.is_single_vendor;
                $rootScope.is_multiple_branch = screen_flow.is_multiple_branch;
                $rootScope.app_type = screen_flow.app_type;
                $rootScope.allow_dynamic_image_on_fotter = settings.key_value.allow_dynamic_image_on_fotter;
                $rootScope.single_vendor_id = settings.supplier_id;
                $rootScope.supplier_branch_id = settings.supplier_branch_id;
                $rootScope.is_pickup = settings.bookingFlow[0].is_pickup_order;
                $rootScope.is_branch_login = parseInt(localStorage.getItem('is_branch'));
                $rootScope.profile_image = key_value.logo_url ? key_value.logo_url : null;
                $rootScope.user_image = key_value.logo_url ? key_value.logo_url : null;
                $rootScope.payment_method = key_value.payment_method ? key_value.payment_method : null;
                $rootScope.localisation = factories.localisation();
                $rootScope.business_name = localStorage.getItem('business_name') ? localStorage.getItem('business_name') : 'Royo Apps';
                $rootScope.is_subscribed = localStorage.getItem('is_subscribed');
                $rootScope.currency = localStorage.getItem('currency') && localStorage.getItem('currency') != undefined ? localStorage.getItem('currency') : '$';
                $rootScope.is_white_label = localStorage.getItem('is_white_label');
                $rootScope.delivery_charge_algo = key_value.delivery_charge_algorithem ? key_value.delivery_charge_algorithem : (([1].includes(screen_flow.app_type) && screen_flow.app_type <= 10) ? 0 : 1);
                $rootScope.delivery_charge_type = key_value.delivery_charge_type ? key_value.delivery_charge_type : 0;
                $rootScope.user_service_fee = key_value.user_service_fee ? key_value.user_service_fee : 0;
                $rootScope.invoice_short = key_value.invoice_short ? key_value.invoice_short : 0;
                $rootScope.prescription = key_value.cart_image_upload ? key_value.cart_image_upload : 0;
                $rootScope.instruction = key_value.order_instructions ? key_value.order_instructions : 0;
                $rootScope.is_secondary_language = key_value.secondary_language && key_value.secondary_language != 0 ? 1 : 0;
                $rootScope.delivery_distance_unit = key_value.delivery_distance_unit ? key_value.delivery_distance_unit : 0;
                $rootScope.gift_card = key_value.gift_card ? key_value.gift_card : 0;
                $rootScope.is_subscription_plan = key_value.is_subscription_plan ? key_value.is_subscription_plan : 0;
                $rootScope.is_supplier_detail = key_value.is_supplier_detail ? key_value.is_supplier_detail : 0;
                $rootScope.agent_tip = key_value.agent_tip ? key_value.agent_tip : 0;
                $rootScope.product_pdf_upload = key_value.product_pdf_upload ? key_value.product_pdf_upload : 0;
                $rootScope.schedule_delivery = key_value.schedule_delivery ? key_value.schedule_delivery : 0;
                $rootScope.disable_app_sharing_message = key_value.disable_app_sharing_message ? key_value.disable_app_sharing_message : 0;
                $rootScope.is_return_request = key_value.is_return_request ? key_value.is_return_request : 0;
                $rootScope.is_tax_geofence = key_value.is_tax_geofence ? key_value.is_tax_geofence : 0;
                $rootScope.is_user_type = key_value.is_user_type ? key_value.is_user_type : 0; //god panel
                $rootScope.user_type_check = key_value.user_type_check ? key_value.user_type_check : 0; //admin     
                $rootScope.disable_import = key_value.disable_import ? key_value.disable_import : 0;
                $rootScope.bypass_otp = key_value.bypass_otp ? key_value.bypass_otp : 0;
                $rootScope.disable_agent_manual_assignment = key_value.disable_agent_manual_assignment ? key_value.disable_agent_manual_assignment : 0;
                $rootScope.ecom_agent_module = key_value.ecom_agent_module ? key_value.ecom_agent_module : 0;
                $rootScope.disable_supplier_category_add = key_value.disable_supplier_category_add ? key_value.disable_supplier_category_add : 0;
                $rootScope.is_db_clone = key_value.is_db_clone ? key_value.is_db_clone : 0;
                $rootScope.allow_supplier_category_edit = key_value.allow_supplier_category_edit ? key_value.allow_supplier_category_edit : 0;
                $rootScope.social_media_icons = key_value.social_media_icons ? key_value.social_media_icons : 0;
                $rootScope.hide_delivery_charges = key_value.hide_delivery_charges ? key_value.hide_delivery_charges : 0;
                $rootScope.no_agent_occupation = key_value.no_agent_occupation ? key_value.no_agent_occupation : 0;
                $rootScope.no_supplier_recommendation = key_value.no_supplier_recommendation ? key_value.no_supplier_recommendation : 0;
                $rootScope.allow_supplier_banner_edit = key_value.allow_supplier_banner_edit ? key_value.allow_supplier_banner_edit : 0;
                $rootScope.is_schdule_order = key_value.is_schdule_order ? key_value.is_schdule_order : 0;
                $rootScope.disable_supplier_order_accept = key_value.disable_supplier_order_accept ? key_value.disable_supplier_order_accept : 0;
                $rootScope.supplier_gst_no = key_value.supplier_gst_no ? key_value.supplier_gst_no : 0;
                $rootScope.disable_vendor_panel_document_approval = key_value.disable_vendor_panel_document_approval ? key_value.disable_vendor_panel_document_approval : 0;
                $rootScope.is_user_subscription = key_value.is_user_subscription ? key_value.is_user_subscription : 0;
                $rootScope.is_loyality_enable = key_value.is_loyality_enable ? key_value.is_loyality_enable : 0;
                $rootScope.hideAgentList = key_value.hideAgentList ? key_value.hideAgentList : 0;
                $rootScope.is_feedback_form_enabled = key_value.is_feedback_form_enabled ? key_value.is_feedback_form_enabled : 0;
                $rootScope.is_table_booking = key_value.is_table_booking ? key_value.is_table_booking : 0;
                $rootScope.is_product_weight = key_value.is_product_weight ? key_value.is_product_weight : 0;
                $rootScope.by_pass_tables_selection = key_value.by_pass_tables_selection ? key_value.by_pass_tables_selection : 0;
                $rootScope.supplier_country_of_origin = key_value.supplier_country_of_origin ? key_value.supplier_country_of_origin : 0;
                $rootScope.is_multiple_images = key_value.is_multiple_images ? key_value.is_multiple_images : 0;
                $rootScope.is_survey_monkey_enabled = key_value.is_survey_monkey_enabled ? key_value.is_survey_monkey_enabled : 0;
                $rootScope.agent_product_slot_assignment = key_value.agent_product_slot_assignment ? key_value.agent_product_slot_assignment : 0;
                $rootScope.is_enabled_multiple_base_delivery_charges = key_value.is_enabled_multiple_base_delivery_charges ? key_value.is_enabled_multiple_base_delivery_charges : 0;
                $rootScope.is_enabled_agent_base_price = key_value.is_enabled_agent_base_price ? key_value.is_enabled_agent_base_price : 0;
                $rootScope.is_social_ecommerce = key_value.is_social_ecommerce ? key_value.is_social_ecommerce : 0;
                $rootScope.is_currency_exchange_rate = key_value.is_currency_exchange_rate ? key_value.is_currency_exchange_rate : 0;
                $rootScope.branch_flow = key_value.branch_flow ? key_value.branch_flow : 0;
                $rootScope.is_vendor_registration = key_value.is_vendor_registration ? key_value.is_vendor_registration : 0;
                $rootScope.agent_verification_code_enable = key_value.agent_verification_code_enable ? key_value.agent_verification_code_enable : 0;
                $rootScope.hideAgentList = key_value.hideAgentList ? key_value.hideAgentList : 0;
                $rootScope.category_sequence = key_value.category_sequence ? key_value.category_sequence : 0;
                $rootScope.price_decimal_length = key_value.price_decimal_length ? parseInt(key_value.price_decimal_length) : 2;
                $rootScope.disable_supplier_category_block_delete = key_value.disable_supplier_category_block_delete ? key_value.disable_supplier_category_block_delete : 0;
                $rootScope.disable_tax = key_value.disable_tax ? key_value.disable_tax : 0;
                $rootScope.is_pos_enabled = key_value.is_pos_enabled ? key_value.is_pos_enabled : 0;
                $rootScope.show_platform_versions = key_value.show_platform_versions ? key_value.show_platform_versions : 0;
                $rootScope.hide_user_info_supplier = key_value.hide_user_info_supplier ? key_value.hide_user_info_supplier : 0;
                $rootScope.hide_agent_info_supplier = key_value.hide_agent_info_supplier ? key_value.hide_agent_info_supplier : 0;
                $rootScope.disable_supplier_delivery_status = key_value.disable_supplier_delivery_status ? key_value.disable_supplier_delivery_status : 0;
                $rootScope.hide_agent_tip = key_value.hide_agent_tip ? key_value.hide_agent_tip : 0;
                $rootScope.disable_product_report_columns_supplier = key_value.disable_product_report_columns_supplier ? key_value.disable_product_report_columns_supplier : 0;
                $rootScope.is_admin_placeholder_edit = key_value.is_admin_placeholder_edit ? key_value.is_admin_placeholder_edit : 0;
                $rootScope.hide_pickup_status = key_value.hide_pickup_status ? key_value.hide_pickup_status : 0;
                $rootScope.hide_agent_module = key_value.hide_agent_module ? key_value.hide_agent_module : 0;
                $rootScope.hide_service_fee_in_supplier = key_value.hide_service_fee_in_supplier ? key_value.hide_service_fee_in_supplier : 0;
                $rootScope.is_eligible_order_amount = key_value.is_eligible_order_amount ? key_value.is_eligible_order_amount : 0;
                $rootScope.allow_agent_request_popup_dynamic = key_value.allow_agent_request_popup_dynamic ? key_value.allow_agent_request_popup_dynamic : 0;
                $rootScope.disable_supplier_main_category_add_edit = key_value.disable_supplier_main_category_add_edit ? key_value.disable_supplier_main_category_add_edit : 0;
                $rootScope.supplier_category_not_required = key_value.supplier_category_not_required ? key_value.supplier_category_not_required : 0;
                $rootScope.disable_ontheway_delivered_admin = key_value.disable_ontheway_delivered_admin ? key_value.disable_ontheway_delivered_admin : 0;
                $rootScope.disable_supplier_promo_edit = key_value.disable_supplier_promo_edit ? key_value.disable_supplier_promo_edit : 0;
                $rootScope.enable_agent_pwd_reset = key_value.enable_agent_pwd_reset ? key_value.enable_agent_pwd_reset : 0;
                $rootScope.hide_app_links_supplier = key_value.hide_app_links_supplier ? key_value.hide_app_links_supplier : 0;
                $rootScope.disbale_add_sgent_supplier = key_value.disbale_add_sgent_supplier ? key_value.disbale_add_sgent_supplier : 0;
                $rootScope.hide_dashboard_orders = key_value.hide_dashboard_orders ? key_value.hide_dashboard_orders : 0;
                $rootScope.disable_admin_order_status = key_value.disable_admin_order_status ? key_value.disable_admin_order_status : 0;
                $rootScope.no_supplier_sub_admins = key_value.no_supplier_sub_admins ? key_value.no_supplier_sub_admins : 0;


                $rootScope.enable_braintree_google_pay = key_value.enable_braintree_google_pay ? key_value.enable_braintree_google_pay : 0;
                $rootScope.google_pay_merchant_id = key_value.google_pay_merchant_id ? key_value.google_pay_merchant_id : 0;

                $rootScope.admin_to_agent_chat = key_value.admin_to_agent_chat ? key_value.admin_to_agent_chat : 0;
                $rootScope.admin_to_supplier_chat = key_value.admin_to_supplier_chat ? key_value.admin_to_supplier_chat : 0;
                $rootScope.admin_to_user_chat = key_value.admin_to_user_chat ? key_value.admin_to_user_chat : 0;
                $rootScope.supplier_to_user_chat = key_value.supplier_to_user_chat ? key_value.supplier_to_user_chat : 0;
                $rootScope.addon_type_quantity = key_value.addon_type_quantity ? key_value.addon_type_quantity : 0;

                $rootScope.is_supplier_stripe_split_enabled = key_value.is_supplier_stripe_split_enabled ? key_value.is_supplier_stripe_split_enabled : 0;
                $rootScope.is_agent_stripe_split_enabled = key_value.is_agent_stripe_split_enabled ? key_value.is_agent_stripe_split_enabled : 0;
                $rootScope.create_stripe_connect_account = key_value.create_stripe_connect_account ? key_value.create_stripe_connect_account : '';
                $rootScope.show_user_stripe_account_connectivity = key_value.show_user_stripe_account_connectivity ? key_value.show_user_stripe_account_connectivity : '';

                $rootScope.is_agent_rating = key_value.is_agent_rating ? key_value.is_agent_rating : 0;
                $rootScope.is_supplier_rating = key_value.is_supplier_rating ? key_value.is_supplier_rating : 0;
                $rootScope.is_product_rating = key_value.is_product_rating ? key_value.is_product_rating : 0;

                $rootScope.selected_template = key_value.selected_template ? parseInt(key_value.selected_template) : 0;
                $rootScope.app_banner_width = key_value.app_banner_width ? parseInt(key_value.app_banner_width) : 0;
                $rootScope.order_request = key_value.order_request ? key_value.order_request : 0;
                $rootScope.product_prescription = key_value.product_prescription ? parseInt(key_value.product_prescription) : 0;
                $rootScope.dynamic_home_section = key_value.dynamic_home_section ? parseInt(key_value.dynamic_home_section) : 0;

                $rootScope.no_tax_in_category = key_value.no_tax_in_category ? key_value.no_tax_in_category : 0;
                $rootScope.no_category_images = key_value.no_category_images ? key_value.no_category_images : 0;
                $rootScope.no_banner_section = key_value.no_banner_section ? key_value.no_banner_section : 0;
                $rootScope.no_default_address = key_value.no_default_address ? key_value.no_default_address : 0;
                $rootScope.no_product_quantity = key_value.no_product_quantity ? key_value.no_product_quantity : 0;
                $rootScope.no_subcategory = key_value.no_subcategory ? key_value.no_subcategory : 0;
                $rootScope.is_dine_in = key_value.is_dine_in ? key_value.is_dine_in : 0;
                $rootScope.product_tags = key_value.product_tags ? key_value.product_tags : 0;
                $rootScope.user_id_proof = key_value.user_id_proof ? key_value.user_id_proof : 0;
                $rootScope.disable_supplier_edit_info = key_value.disable_supplier_edit_info ? key_value.disable_supplier_edit_info : 0;

                $rootScope.no_catalogue = key_value.no_catalogue ? key_value.no_catalogue : 0;
                $rootScope.no_food_item_admin = key_value.no_food_item_admin ? key_value.no_food_item_admin : 0;
                $rootScope.food_item_image_optional = key_value.food_item_image_optional ? key_value.food_item_image_optional : 0;
                $rootScope.food_item_desc_optional = key_value.food_item_desc_optional ? key_value.food_item_desc_optional : 0;
                $rootScope.category_desc_optional = key_value.category_desc_optional ? key_value.category_desc_optional : 0;
                $rootScope.category_img_optional = key_value.category_img_optional ? key_value.category_img_optional : 0;


                $rootScope.no_rating_review = key_value.no_rating_review ? key_value.no_rating_review : 0;
                $rootScope.no_send_notification = key_value.no_send_notification ? key_value.no_send_notification : 0;
                $rootScope.no_user_email = key_value.no_user_email ? key_value.no_user_email : 0;
                $rootScope.no_online_orders = key_value.no_online_orders ? key_value.no_online_orders : 0;
                $rootScope.no_cash_orders = key_value.no_cash_orders ? key_value.no_cash_orders : 0;
                $rootScope.ride_admin_url = key_value.ride_admin_url ? key_value.ride_admin_url : '';
                $rootScope.android_app_url = key_value.android_app_url ? key_value.android_app_url : '';
                $rootScope.ios_app_url = key_value.ios_app_url ? key_value.ios_app_url : '';
                $rootScope.hide_website_url = key_value.hide_website_url ? key_value.hide_website_url : 0;
                $rootScope.allow_agentwallet_to_pay_for_cashorder = key_value.allow_agentwallet_to_pay_for_cashorder ? key_value.allow_agentwallet_to_pay_for_cashorder : 0;
                $rootScope.is_sos_allow = key_value.is_sos_allow ? key_value.is_sos_allow : 0;
                $rootScope.show_status_info_settings = key_value.show_status_info_settings ? key_value.show_status_info_settings : 0;
                $rootScope.enable_user_signature = key_value.enable_user_signature ? key_value.enable_user_signature : 0;

                $rootScope.isProductCustomTabDescriptionEnable = key_value.isProductCustomTabDescriptionEnable ? key_value.isProductCustomTabDescriptionEnable : 0;
                $rootScope.addDocumentsInAgent = key_value.addDocumentsInAgent ? key_value.addDocumentsInAgent : 0;

                $rootScope.footer_type = key_value.footer_type ? parseInt(key_value.footer_type) : 0;

                $rootScope.hide_delivery_radius_vendor = key_value.hide_delivery_radius_vendor ? key_value.hide_delivery_radius_vendor : 0;
                $rootScope.hide_delivery_time_supplier = key_value.hide_delivery_time_supplier ? key_value.hide_delivery_time_supplier : 0;
                $rootScope.hide_promo_commission = key_value.hide_promo_commission ? key_value.hide_promo_commission : 0;
                $rootScope.hide_banner_category_supplier = key_value.hide_banner_category_supplier ? key_value.hide_banner_category_supplier : 0;
                $rootScope.no_website = key_value.no_website ? key_value.no_website : 0;
                $rootScope.disable_name_address_supplier = key_value.disable_name_address_supplier ? key_value.disable_name_address_supplier : 0;
                $rootScope.hide_delivery_charges_supplier = key_value.hide_delivery_charges_supplier ? key_value.hide_delivery_charges_supplier : 0;
                $rootScope.hide_agent_supplier = key_value.hide_agent_supplier ? key_value.hide_agent_supplier : 0;
                $rootScope.is_multicurrency_enable = key_value.is_multicurrency_enable ? key_value.is_multicurrency_enable : 0;
                $rootScope.enable_supplier_in_special_offer = key_value.enable_supplier_in_special_offer ? key_value.enable_supplier_in_special_offer : 0;

                $rootScope.no_supplier_delivery_charge = key_value.no_supplier_delivery_charge ? key_value.no_supplier_delivery_charge : 0;
                $rootScope.no_driver_detail_supplier = key_value.no_driver_detail_supplier ? key_value.no_driver_detail_supplier : 0;
                $rootScope.no_supplier_banner_section = key_value.no_supplier_banner_section ? key_value.no_supplier_banner_section : 0;
                $rootScope.add_variant_supplier = key_value.add_variant_supplier ? key_value.add_variant_supplier : 0;
                $rootScope.not_all_variant_required = key_value.not_all_variant_required ? key_value.not_all_variant_required : 0;
                $rootScope.addABNInAgent = key_value.addABNInAgent ? key_value.addABNInAgent : 0;
                $rootScope.disable_agent_manual_assignment_supplier = key_value.disable_agent_manual_assignment_supplier ? key_value.disable_agent_manual_assignment_supplier : 0;
                $rootScope.is_data_filter_by_country = key_value.is_data_filter_by_country ? key_value.is_data_filter_by_country : 0;

                $rootScope.hide_supplier_branch = key_value.hide_supplier_branch ? key_value.hide_supplier_branch : 0;
                $rootScope.no_supplier_promotion_section = key_value.no_supplier_promotion_section ? key_value.no_supplier_promotion_section : 0;

                $rootScope.wallet_module = key_value.wallet_module ? key_value.wallet_module : 0;
                $rootScope.is_mark_out_of_stock = key_value.is_mark_out_of_stock ? key_value.is_mark_out_of_stock : 0;
                $rootScope.is_abn_business = key_value.is_abn_business ? key_value.is_abn_business : 0;
                $rootScope.hide_supplier_accounting = key_value.hide_supplier_accounting ? key_value.hide_supplier_accounting : 0;
                $rootScope.is_laundry_theme = key_value.is_laundry_theme ? key_value.is_laundry_theme : 0;
                $rootScope.dropoff_buffer = key_value.dropoff_buffer ? key_value.dropoff_buffer : 0;

                $rootScope.is_single_menu = key_value.is_single_menu ? key_value.is_single_menu : 0;

                $rootScope.enable_size_chart_in_product = key_value.enable_size_chart_in_product ? key_value.enable_size_chart_in_product : 0;
                $rootScope.enable_country_of_origin_in_product = key_value.enable_country_of_origin_in_product ? key_value.enable_country_of_origin_in_product : 0;

                $rootScope.is_invoice_print_enable = key_value.is_invoice_print_enable ? key_value.is_invoice_print_enable : 0;
                $rootScope.is_tutorial_screen_enable = key_value.is_tutorial_screen_enable ? key_value.is_tutorial_screen_enable : 0;
                $rootScope.is_vehicle_category_enable = key_value.is_vehicle_category_enable ? key_value.is_vehicle_category_enable : 0;
                $rootScope.show_status_info_settings = key_value.show_status_info_settings ? key_value.show_status_info_settings : 0;
                $rootScope.is_update_price_enable = key_value.is_update_price_enable ? key_value.is_update_price_enable : 0;
                $rootScope.is_nhs_filter_enable = key_value.is_nhs_filter_enable ? key_value.is_nhs_filter_enable : 0;
                $rootScope.is_consider_qty_enable = key_value.is_consider_qty_enable ? key_value.is_consider_qty_enable : 0;
                $rootScope.is_minimum_distance_enable = key_value.is_minimum_distance_enable ? key_value.is_minimum_distance_enable : 0;
                $rootScope.enable_min_order_distance_wise = key_value.enable_min_order_distance_wise ? key_value.enable_min_order_distance_wise : 0;
                $rootScope.show_tags_for_suppliers = key_value.show_tags_for_suppliers ? key_value.show_tags_for_suppliers : 0;
                $rootScope.is_glassdoor_link = key_value.is_glassdoor_link ? key_value.is_glassdoor_link : 0;
                $rootScope.hide_ontheway_delivered_supplier = key_value.hide_ontheway_delivered_supplier ? key_value.hide_ontheway_delivered_supplier : 0;
                $rootScope.survey_monkey_access_token = key_value.survey_monkey_access_token ? key_value.survey_monkey_access_token : '';

                $rootScope.show_supplier_info_settings = key_value.show_supplier_info_settings ? key_value.show_supplier_info_settings : 0;

                $rootScope.is_alternate_about_us = key_value.is_alternate_about_us ? key_value.is_alternate_about_us : 0;

                $rootScope.is_variant_product_import = key_value.is_variant_product_import ? key_value.is_variant_product_import : 0;

                $rootScope.is_app_version_enable = key_value.is_app_version_enable ? key_value.is_app_version_enable : 0;

                $rootScope.is_flavor_of_week_enable = key_value.is_flavor_of_week_enable ? key_value.is_flavor_of_week_enable : 0;
                $rootScope.is_delivery_charge_weight_wise_enable = key_value.is_delivery_charge_weight_wise_enable ? key_value.is_delivery_charge_weight_wise_enable : 0;

                $rootScope.is_enable_delivery_type = key_value.is_enable_delivery_type ? key_value.is_enable_delivery_type : 0;
                $rootScope.is_enable_multiple_banner = key_value.is_enable_multiple_banner ? key_value.is_enable_multiple_banner : 0;
                $rootScope.is_enable_orderwise_gateways = key_value.is_enable_orderwise_gateways ? key_value.is_enable_orderwise_gateways : 0;

                $rootScope.allow_agent_request_popup_dynamic = key_value.allow_agent_request_popup_dynamic ? key_value.allow_agent_request_popup_dynamic : 0;

                $rootScope.dynamic_order_type_client_wise = key_value.dynamic_order_type_client_wise ? key_value.dynamic_order_type_client_wise : 0;
                $rootScope.dynamic_order_type_client_wise_delivery = key_value.dynamic_order_type_client_wise_delivery ? key_value.dynamic_order_type_client_wise_delivery : 0;
                $rootScope.dynamic_order_type_client_wise_pickup = key_value.dynamic_order_type_client_wise_pickup ? key_value.dynamic_order_type_client_wise_pickup : 0;
                $rootScope.dynamic_order_type_client_wise_dinein = key_value.dynamic_order_type_client_wise_dinein ? key_value.dynamic_order_type_client_wise_dinein : 0;

                $rootScope.enable_user_vehicle_number = key_value.enable_user_vehicle_number ? key_value.enable_user_vehicle_number : 0;
                $rootScope.tax_on_delivery_charges = key_value.tax_on_delivery_charges ? key_value.tax_on_delivery_charges : 0;

                $rootScope.enable_item_purchase_limit = key_value.enable_item_purchase_limit ? key_value.enable_item_purchase_limit : 0;
                $rootScope.is_enable_subscription_required = key_value.is_enable_subscription_required ? key_value.is_enable_subscription_required : 0;
                $rootScope.is_enable_max_discount_value = key_value.is_enable_max_discount_value ? key_value.is_enable_max_discount_value : 0;
                $rootScope.disable_supplier_profile_edit = key_value.disable_supplier_profile_edit ? key_value.disable_supplier_profile_edit : 0;

                $rootScope.enable_address_reference = key_value.enable_address_reference ? key_value.enable_address_reference : 0;
                $rootScope.supplier_subscription_revnue_graph = key_value.supplier_subscription_revnue_graph ? key_value.supplier_subscription_revnue_graph : 0;
                $rootScope.cutom_country_code = key_value.cutom_country_code ? key_value.cutom_country_code : 0;

                $rootScope.enable_agent_email_notification = key_value.enable_agent_email_notification ? key_value.enable_agent_email_notification : 0;
                $rootScope.enable_referral_bal_limit = key_value.enable_referral_bal_limit ? key_value.enable_referral_bal_limit : 0;
                $rootScope.enable_agent_leave_notes = key_value.enable_agent_leave_notes ? key_value.enable_agent_leave_notes : 0;

                $rootScope.enable_min_order_amount_for_free_delivery = key_value.enable_min_order_amount_for_free_delivery ? key_value.enable_min_order_amount_for_free_delivery : 0;
                if ($rootScope.enable_agent_leave_notes) {
                    $rootScope.leave_notes_reasons = key_value.enable_agent_leave_notes || ''
                }

                $rootScope.enable_in_out_network = key_value.enable_in_out_network ? key_value.enable_in_out_network : 0;

                $rootScope.enable_cutlery_option = key_value.enable_cutlery_option ? key_value.enable_cutlery_option : 0;

                $rootScope.is_instance_selection = key_value.is_instance_selection ? key_value.is_instance_selection : 0;
                $rootScope.enable_audio_video = key_value.enable_audio_video ? key_value.enable_audio_video : 0;

                $rootScope.enable_food_varients = key_value.enable_food_varients ? key_value.enable_food_varients : 0;
                $rootScope.cat_variant_import_sample_url = key_value.cat_variant_import_sample_url ? key_value.cat_variant_import_sample_url : 0;
                $rootScope.enable_date_of_birth = key_value.enable_date_of_birth ? key_value.enable_date_of_birth : 0;
                $rootScope.dynamic_home_screen_sections = key_value.dynamic_home_screen_sections ? key_value.dynamic_home_screen_sections : 0;
                $rootScope.is_order_types_screen_dynamic = key_value.is_order_types_screen_dynamic ? key_value.is_order_types_screen_dynamic : 0;
                $rootScope.enable_flat_user_service_charge = key_value.enable_flat_user_service_charge ? key_value.enable_flat_user_service_charge : 0;
                $rootScope.is_multicurrency_enable = key_value.is_multicurrency_enable ? key_value.is_multicurrency_enable : 0;
                $rootScope.enable_supplier_in_special_offer_admin = key_value.enable_supplier_in_special_offer_admin ? key_value.enable_supplier_in_special_offer_admin : 0;
                $rootScope.enable_admin_cat_sorting = key_value.enable_admin_cat_sorting ? key_value.enable_admin_cat_sorting : 0;

                $rootScope.enable_product_appointment = key_value.enable_product_appointment ? key_value.enable_product_appointment : 0;
                $rootScope.enable_whatsapp_contact_us = key_value.enable_whatsapp_contact_us ? key_value.enable_whatsapp_contact_us : 0;


                $rootScope.enable_product_allergy = key_value.enable_product_allergy ? key_value.enable_product_allergy : 0;


                $rootScope.enable_geofence_wise_categories = key_value.enable_geofence_wise_categories ? key_value.enable_geofence_wise_categories : 0;
                $rootScope.table_book_mac_theme = key_value.table_book_mac_theme ? key_value.table_book_mac_theme : 0;
                $rootScope.enable_min_loyality_points = key_value.enable_min_loyality_points ? key_value.enable_min_loyality_points : 0;



                $rootScope.hide_delivery_fields_for_suppliers = key_value.hide_delivery_fields_for_suppliers ? key_value.hide_delivery_fields_for_suppliers : 0;
                $rootScope.hide_account_payouts = key_value.hide_account_payouts ? key_value.hide_account_payouts : 0;
                $rootScope.enable_non_veg_filter = key_value.enable_non_veg_filter ? key_value.enable_non_veg_filter : 0;

                $rootScope.skip_in_progress = key_value.skip_in_progress ? key_value.skip_in_progress : 0;
                $rootScope.disable_preparation_time = key_value.disable_preparation_time ? key_value.disable_preparation_time : 0;
                $rootScope.enable_product_special_instruction = key_value.enable_product_special_instruction ? key_value.enable_product_special_instruction : 0;
                $rootScope.enable_block_time = key_value.enable_block_time ? key_value.enable_block_time : 0;
                $rootScope.enable_zone_geofence = key_value.enable_zone_geofence ? key_value.enable_zone_geofence : 0;
                $rootScope.enable_sequence_wise_supplier = key_value.enable_sequence_wise_supplier ? key_value.enable_sequence_wise_supplier : 0;
                $rootScope.enable_all_supplier_block_status_update = key_value.enable_all_supplier_block_status_update ? key_value.enable_all_supplier_block_status_update : 0;
                $rootScope.enable_all_supplier_scheduling_status_update = key_value.enable_all_supplier_scheduling_status_update ? key_value.enable_all_supplier_scheduling_status_update : 0;
                $rootScope.enable_video_in_banner = key_value.enable_video_in_banner ? key_value.enable_video_in_banner : 0;
                $rootScope.enable_voucher_section = key_value.enable_voucher_section ? key_value.enable_voucher_section : 0;
                $rootScope.is_flash_sale = key_value.is_flash_sale ? key_value.is_flash_sale : 0;
                $rootScope.display_slot_with_difference = key_value.display_slot_with_difference ? key_value.display_slot_with_difference : 0;
                $rootScope.cutom_country_code = key_value.cutom_country_code ? key_value.cutom_country_code : 0;

                $rootScope.enable_block_time = key_value.enable_block_time ? key_value.enable_block_time : 0;
                $rootScope.enable_zone_geofence = key_value.enable_zone_geofence ? key_value.enable_zone_geofence : 0;
                $rootScope.enable_sequence_wise_supplier = key_value.enable_sequence_wise_supplier ? key_value.enable_sequence_wise_supplier : 0;

                $rootScope.enable_no_touch_delivery = key_value.enable_no_touch_delivery ? key_value.enable_no_touch_delivery : 0;
                $rootScope.enable_updation_vendor_approval = key_value.enable_updation_vendor_approval ? key_value.enable_updation_vendor_approval : 0;
                $rootScope.is_supplier_slogan_add_edit = key_value.is_supplier_slogan_add_edit ? key_value.is_supplier_slogan_add_edit : 0;
                $rootScope.inventory_optional = key_value.inventory_optional ? parseInt(key_value.inventory_optional) : 0;
                $rootScope.is_default_order_list = key_value.is_default_order_list ? key_value.is_default_order_list : 0;
                $rootScope.enable_liquor_popup = key_value.enable_liquor_popup ? key_value.enable_liquor_popup : 0;


                $rootScope.enable_supplier_vat_value = key_value.enable_supplier_vat_value ? key_value.enable_supplier_vat_value : 0;
                $rootScope.enable_category_age_limit = key_value.enable_category_age_limit ? key_value.enable_category_age_limit : 0;
                $rootScope.enable_category_commission = key_value.enable_category_commission ? key_value.enable_category_commission : 0;


                $rootScope.enable_agent_loyality = key_value.enable_agent_loyality ? key_value.enable_agent_loyality : 0;

                $rootScope.enable_cookies_policy = key_value.enable_cookies_policy ? key_value.enable_cookies_policy : 0;
                $rootScope.enable_allergy_policy = key_value.enable_allergy_policy ? key_value.enable_allergy_policy : 0;

                $rootScope.enable_daily_sales_record = key_value.enable_daily_sales_record ? key_value.enable_daily_sales_record : 0;
                $rootScope.enable_supplier_category_timing = key_value.enable_supplier_category_timing ? key_value.enable_supplier_category_timing : 0;

                $rootScope.enable_product_calories = key_value.enable_product_calories ? key_value.enable_product_calories : 0;
                $rootScope.enable_manual_user_loyality_update = key_value.enable_manual_user_loyality_update ? key_value.enable_manual_user_loyality_update : 0;
                $rootScope.disable_supplier_to_update_profile = key_value.disable_supplier_to_update_profile ? key_value.disable_supplier_to_update_profile : 0;

                $rootScope.enable_vendor_order_creation = key_value.enable_vendor_order_creation ? key_value.enable_vendor_order_creation : 0;



                $rootScope.addDocumentsInAgent_DL = key_value.addDocumentsInAgent_DL ? key_value.addDocumentsInAgent_DL : 0;



                $rootScope.is_hide_save_customization = key_value.is_hide_save_customization ? key_value.is_hide_save_customization : 0;
                $rootScope.enable_tap_payment_gateway = key_value.enable_tap_payment_gateway ? key_value.enable_tap_payment_gateway : 0;
                $rootScope.is_customized_commision_enable = key_value.is_customized_commision_enable ? key_value.is_customized_commision_enable : 0;
                $rootScope.enable_base_delivery_charge_on_vehicle_cat = key_value.enable_base_delivery_charge_on_vehicle_cat ? key_value.enable_base_delivery_charge_on_vehicle_cat : 0;
                $rootScope.agent_occupation_optional = key_value.agent_occupation_optional ? key_value.agent_occupation_optional : 0;
                $rootScope.hide_license_number_from_signUp = key_value.hide_license_number_from_signUp ? key_value.hide_license_number_from_signUp : 0;

                $rootScope.image_placeholder = 'img/v1_images/back-placeholder.png';
                $rootScope.restriction_view_only_for_restaurant = parseInt(key_value.restriction_view_only_for_restaurant) ? key_value.restriction_view_only_for_restaurant : 0;
                $rootScope.enable_shippo_service = parseInt(key_value.enable_shippo_service ? key_value.enable_shippo_service : 0);
                $rootScope.pickit_home_theme = parseInt(key_value.pickit_home_theme ? key_value.pickit_home_theme : 0);
                $rootScope.enable_agent_withdrawl_payout_with_stripe = key_value.enable_agent_withdrawl_payout_with_stripe ? key_value.enable_agent_withdrawl_payout_with_stripe : 0;
                $rootScope.is_hide_geofence_for_supplier = parseInt(key_value.is_hide_geofence_for_supplier ? key_value.is_hide_geofence_for_supplier : 0);
                $rootScope.hide_user_email_supplier = parseInt(key_value.hide_user_email_supplier ? key_value.hide_user_email_supplier : 0);
                $rootScope.hide_gift_cards = key_value.hide_gift_cards ? key_value.hide_gift_cards : 0;
                $rootScope.enable_same_reject_order_message = key_value.enable_same_reject_order_message ? key_value.enable_same_reject_order_message : 0;
                if ($rootScope.enable_same_reject_order_message == 1) {
                    $rootScope.same_reject_order_message = key_value.same_reject_order_message ? key_value.same_reject_order_message : '';
                }



                $rootScope.enable_assign_unassign_agent_info = key_value.enable_assign_unassign_agent_info ? key_value.enable_assign_unassign_agent_info : 0;


                $rootScope.image_placeholder = 'img/v1_images/back-placeholder.png';
                $rootScope.restriction_view_only_for_restaurant = parseInt(key_value.restriction_view_only_for_restaurant) ? key_value.restriction_view_only_for_restaurant : 0;
                $rootScope.enable_shippo_service = parseInt(key_value.enable_shippo_service ? key_value.enable_shippo_service : 0);
                $rootScope.enable_tuber_theme = parseInt(key_value.enable_tuber_theme ? key_value.enable_tuber_theme : 0);
                $rootScope.hide_supplier_min_order_amount = parseInt(key_value.hide_supplier_min_order_amount ? key_value.hide_supplier_min_order_amount : 0)
                $rootScope.show_delete_subCat_in_cataogue = parseInt(key_value.show_delete_subCat_in_cataogue ? key_value.show_delete_subCat_in_cataogue : 0)
                $rootScope.disable_product_edit_for_supplier = parseInt(key_value.disable_product_edit_for_supplier ? key_value.disable_product_edit_for_supplier : 0)
                $rootScope.disable_product_price_edit_for_supplier = parseInt(key_value.disable_product_price_edit_for_supplier ? key_value.disable_product_price_edit_for_supplier : 0)
                $rootScope.remove_product_description = parseInt(key_value.remove_product_description ? key_value.remove_product_description : 0)
                $rootScope.hide_product_image = parseInt(key_value.hide_product_image ? key_value.hide_product_image : 0)
                $rootScope.hide_product_price_option_for_home_service = parseInt(key_value.hide_product_price_option_for_home_service && $rootScope.app_type == 8 ? key_value.hide_product_price_option_for_home_service : 0)
                $rootScope.enable_rush_theme = parseInt(key_value.enable_rush_theme ? key_value.enable_rush_theme : 0)
                $rootScope.enable_homenet_theme = parseInt(key_value.enable_homenet_theme ? key_value.enable_homenet_theme : 0)
                $rootScope.update_image_on_pickup = parseInt(key_value.update_image_on_pickup ? key_value.update_image_on_pickup : 0)
                $rootScope.hide_supplier_pay_option_in_accounting = parseInt(key_value.hide_supplier_pay_option_in_accounting ? key_value.hide_supplier_pay_option_in_accounting : 0)
                $rootScope.clone_branch_product = parseInt(key_value.clone_branch_product ? key_value.clone_branch_product : 0)
                $rootScope.hide_user_pricing_detail_for_supplier_in_order = parseInt(key_value.hide_user_pricing_detail_for_supplier_in_order ? key_value.hide_user_pricing_detail_for_supplier_in_order : 0)
                $rootScope.hide_revenue_for_supplier_in_dashboard = parseInt(key_value.hide_revenue_for_supplier_in_dashboard ? key_value.hide_revenue_for_supplier_in_dashboard : 0)
                $rootScope.hide_product_price_for_supplier = parseInt(key_value.hide_product_price_for_supplier ? key_value.hide_product_price_for_supplier : 0)
                $rootScope.hide_notification_for_supplier = parseInt(key_value.hide_notification_for_supplier ? key_value.hide_notification_for_supplier : 0)
                $rootScope.hide_reports_for_supplier = parseInt(key_value.hide_reports_for_supplier ? key_value.hide_reports_for_supplier : 0)
                $rootScope.enable_collapsed_navigation = parseInt(key_value.enable_collapsed_navigation ? key_value.enable_collapsed_navigation : 0)
                $rootScope.hide_my_profile_for_supplier = parseInt(key_value.hide_my_profile_for_supplier ? key_value.hide_my_profile_for_supplier : 0)
                $rootScope.enable_agent_delivery_address_detail = parseInt(key_value.enable_agent_delivery_address_detail ? key_value.enable_agent_delivery_address_detail : 0)
                $rootScope.enable_product_tax_feature = parseInt(key_value.enable_product_tax_feature ? key_value.enable_product_tax_feature : 0)

                $rootScope.enable_admin_two_way_authentication = parseInt(key_value.enable_admin_two_way_authentication ? key_value.enable_admin_two_way_authentication : 0)
                $rootScope.enable_stock_number = parseInt(key_value.enable_stock_number ? key_value.enable_stock_number : 0)
                $rootScope.enable_grading = parseInt(key_value.enable_grading ? key_value.enable_grading : 0)
                $rootScope.enable_branch_reset_pwd = parseInt(key_value.enable_branch_reset_pwd ? key_value.enable_branch_reset_pwd : 0)
                $rootScope.enable_agent_withdrawl_payout_with_stripe = parseInt(key_value.enable_agent_withdrawl_payout_with_stripe ? key_value.enable_agent_withdrawl_payout_with_stripe : 0);
                $rootScope.enable_geofence_section_in_supplier_by_admin = parseInt(key_value.enable_geofence_section_in_supplier_by_admin ? key_value.enable_geofence_section_in_supplier_by_admin : 0); //SUpplier will decide to show geofence to supplier
                $rootScope.enable_dynamic_vat_for_supplier_by_admin = parseInt(key_value.enable_dynamic_vat_for_supplier_by_admin ? key_value.enable_dynamic_vat_for_supplier_by_admin : 0); //SUpplier will decide to show add vat in website
                $rootScope.enable_dynamic_agent_section_in_supplier_by_admin = parseInt(key_value.enable_dynamic_agent_section_in_supplier_by_admin ? key_value.enable_dynamic_agent_section_in_supplier_by_admin : 0); //SUpplier will decide  to show agent tab to supplier
                $rootScope.hide_promo_module = parseInt(key_value.hide_promo_module ? key_value.hide_promo_module : 0); // Hide promo section
                $rootScope.enable_logout_in_navigation = parseInt(key_value.enable_logout_in_navigation ? key_value.enable_logout_in_navigation : 0);




                if (factories.getSettings().key_value.logo_url) {
                    $rootScope.app_image = factories.getSettings().key_value.logo_url;
                    setTimeout(() => {
                        let logo_width = document.getElementById('app_logo') ? $("#app_logo").width() : 0;
                        $rootScope.logo_height = logo_width ? (logo_width * 3) / 4 : 0;
                    }, 100);
                } else {
                    $rootScope.app_image = '';
                    $rootScope.logo_data['background'] = factories.getSettings().key_value.header_color;
                    $rootScope.logo_data['font_family'] = factories.getSettings().key_value.font_family;
                    $rootScope.logo_data['theme_color'] = factories.getSettings().key_value.theme_color;
                }

                if (localStorage.getItem('sub_plan_name')) {
                    $rootScope.sub_plan_name = localStorage.getItem('sub_plan_name');
                }

                if (localStorage.getItem('is_own_delivery')) {
                    $rootScope.is_own_delivery = !!localStorage.getItem('is_own_delivery');
                }

                if (localStorage.getItem('user_name')) {
                    $rootScope.user_name = localStorage.getItem('user_name');
                }

                if (localStorage.getItem('user_image')) {
                    $rootScope.user_image = localStorage.getItem('user_image');
                } else {
                    $rootScope.user_image = $rootScope.profile_image
                }

                if ($rootScope.profile == 'ADMIN' && $rootScope.client_code == 'sangtini_0746' && localStorage.getItem('fav_icon')) {
                    $rootScope.user_image = localStorage.getItem('fav_icon');
                }
                if ($rootScope.enable_geofence_section_in_supplier_by_admin == 1 && $rootScope.profile == 'SUPPLIER') {
                    $rootScope.allow_geofence_section_in_supplier_by_admin = JSON.parse(localStorage.getItem('allow_geofence_section_in_supplier_by_admin'))
                }
                if ($rootScope.enable_dynamic_agent_section_in_supplier_by_admin == 1 && $rootScope.profile == 'SUPPLIER') {
                    $rootScope.allow_agent_section_in_supplier_by_admin = JSON.parse(localStorage.getItem('allow_agent_section_in_supplier_by_admin'))
                }

                // if (localStorage.getItem('first_login') == 1 && $rootScope.is_db_clone == 0) {
                //   setTimeout(() => {
                //     $("#db_clone_popup").modal('show');
                //   }, 1500);
                //   setTimeout(() => {
                //     localStorage.setItem('first_login', 0);
                //   }, 60000);
                // }

            } else {
                $state.go('NotFound');
            }

            if (localStorage.getItem('total_days')) {
                let days_left = 20 - parseInt(localStorage.getItem('total_days'));
                $rootScope.total_days = days_left > 0 ? `${days_left} ${days_left == 1 ? 'day' : 'days'} left` : 'Expired';
            }

            var afterLogout = function() {
                constants.ACCESSTOKEN = "";
                localStorage.removeItem('RoyoAccessToken');
                localStorage.removeItem('section_data');
                localStorage.removeItem('adminId');
                localStorage.removeItem('is_superAdmin');
                localStorage.removeItem('profile_type');
                localStorage.removeItem('supplier_id');
                localStorage.removeItem('is_branch');
                localStorage.removeItem('branch_type');
                localStorage.removeItem('user_image');
                localStorage.removeItem('supplierSubscription');
                $state.go('login');
            }

            $rootScope.Logout = function() {
                services.CONFIRM('You want to logout from this panel.',
                    function(isConfirm) {
                        if (isConfirm) {
                            let type = localStorage.getItem('profile_type');
                            if (type === 'ADMIN') {
                                services.PUT_DATA({}, API.ADMIN_LOGOUT, function(response) {
                                    afterLogout();
                                });
                            } else if (type === 'SUPPLIER') {
                                let param_data = {
                                    languageId: 14,
                                    accessToken: localStorage.getItem('RoyoAccessToken')
                                }
                                services.POST_DATA(param_data, API.SUPPLIER_LOGOUT, function(response) {
                                    afterLogout();
                                });
                            } else if (type === 'BRANCH') {
                                let param_data = {
                                    languageId: 14,
                                    accessToken: localStorage.getItem('RoyoAccessToken')
                                }
                                services.POST_DATA(param_data, API.BRANCH_LOGOUT, function(response) {
                                    afterLogout();
                                });
                            } else if (type === 'SHIPPING') {
                                let param_data = {
                                    languageId: 14,
                                    accessToken: localStorage.getItem('RoyoAccessToken')
                                }
                                services.POST_DATA(param_data, API.SHIPPING_LOGOUT, function(response) {
                                    afterLogout();
                                });
                            }
                        }
                    });
            }

            $rootScope.permissions = function(section, type) {
                return factories.permissions(section, type);
            }

            $scope.openAgentId = function() {
                $rootScope.agent_unique_id = localStorage.getItem('unique_id');
                $("#agentUniqueId").modal('show');
            }
            $rootScope.new_admin_pass = '';
            $rootScope.confirm_new_admin_pass = '';

            $rootScope.is_resending_otp = 0;
            $rootScope.is_otp_verified = 0;
            $rootScope.otp_timer = 120;
            $rootScope.otp_time_up = 0;
            $rootScope.is_normal_pwd_reset = 0;

            $rootScope.otpObj = {
                phone_number: localStorage.getItem('phone_number') ? localStorage.getItem('phone_number') : "",
                country_code: localStorage.getItem('country_code') ? localStorage.getItem('country_code') : "",
                otp: ""
            };

            $rootScope.xx_phone_number = '';


            $rootScope.passwordReset = function(passwordResetForm, new_admin_pass) {
                if (passwordResetForm.$submitted && passwordResetForm.$invalid) return;
                services.POST_DATA({
                    password: new_admin_pass
                }, API.RESET_PASSWORD(), function(response) {
                    $("#reset_password_modal").modal('hide');
                    setTimeout(() => {
                        $("#passSuccess").modal('show');
                    }, 600);
                });
            }


            $scope.onResetPwdClick = function() {
                if ($rootScope.enable_admin_two_way_authentication == 1) {
                    $rootScope.is_normal_pwd_reset = 0;
                    $rootScope.xx_phone_number = $scope.otpObj.phone_number.substr(-4);

                    $rootScope.resendOtp();
                } else {
                    $rootScope.is_normal_pwd_reset = 1;
                }
            }

            $rootScope.submitOtpForm = function(otpForm) {
                if (otpForm.$submitted && otpForm.$invalid) return;
                var data = $rootScope.otpObj;
                services.POST_DATA(data, API.VERIFY_LOGIN_OTP, function(data) {
                    if ([4, 200].includes(data.status)) {
                        $rootScope.is_otp_verified = 1;
                    }
                });
            }

            $rootScope.resendOtpAgain = function() {
                $rootScope.otp_timer = 120;
                $rootScope.is_resending_otp = 1;
                $rootScope.resendOtp();
            }

            $rootScope.resendOtp = function() {
                var data = $rootScope.otpObj;
                delete data['otp'];
                var element = document.getElementById('resend_otp');
                if (element) {
                    element.style.display = 'none';
                }
                services.POST_DATA(data, API.RESEND_LOGIN_OTP, function(data) {
                    $rootScope.is_resending_otp = 0;
                    setTimeout(() => {
                        $rootScope.otp_timer = 120;
                        startOtpTimer();
                    }, 500);
                });
            }


            startOtpTimer = function() {
                var m = Math.floor($rootScope.otp_timer / 60);
                var s = $rootScope.otp_timer % 60;

                m = m < 10 ? '0' + m : m;
                s = s < 10 ? '0' + s : s;
                var timerSpan = document.getElementById('timer');
                if (timerSpan) {
                    timerSpan.innerHTML = m + ':' + s;
                } else {
                    return;
                }
                $rootScope.otp_timer -= 1;
                if ($rootScope.otp_timer >= 0) {
                    setTimeout(function() {
                        startOtpTimer($rootScope.otp_timer);
                    }, 1000);
                    return;
                } else {
                    setTimeout(() => {
                        $rootScope.otp_time_up = true;
                        document.getElementById('otp_timer').style.display = 'none';
                        document.getElementById('resend_otp').style.display = 'block';
                    }, 100);
                }
            }






            $rootScope.updateUserProfileImg = function() {
                if (!$rootScope.userImage) return;
                let data = {}
                data.accessToken = constants.ACCESSTOKEN;
                data.sectionId = 30
                data.supplierBranchId = JSON.parse(localStorage.getItem('branch_type')).default_branch_id
                data.logo = $scope.branchLogo

                services.POST_FORM_DATA(data, API.UPDATE_BRANCH_PROFILE_IMAGE, function(response) {
                    if (response && response.data) {
                        $rootScope.user_image = ''
                        $rootScope.user_image = response.data.logo
                        localStorage.setItem('user_image', response.data.logo)
                        $("#edit_user_image").modal('hide');
                        factories.successActionPop('Image changed Successfully');

                    }
                })
            }
            $scope.openWebsite = function() {
                if (constants.ACCESSTOKEN) {
                    let site_domain = localStorage.getItem('site_domain');
                    window.open(site_domain, "_blank");
                }
            }

            $scope.appLink = function(type) {
                if (constants.ACCESSTOKEN) {
                    let link = '';
                    switch (type) {
                        case 'ios':
                            link = factories.getSettings().key_value.ios_app_url;
                            break;
                        case 'android':
                            link = factories.getSettings().key_value.android_app_url;
                            break;
                    }
                    window.open(link, "_blank");
                }
            }

            $scope.openRoyoRides = function() {
                if (constants.ACCESSTOKEN) {
                    window.open(factories.getSettings().key_value.ride_admin_url, "_blank");
                }
            }

            $rootScope.new_admin_pass = '';
            $rootScope.confirm_new_admin_pass = '';
            $rootScope.passwordReset = function(passwordResetForm, new_admin_pass) {
                if (passwordResetForm.$submitted && passwordResetForm.$invalid) return;

                let api = ''
                let params = {}
                if ($rootScope.profile == 'BRANCH') {
                    params.password = new_admin_pass
                    params.supplierId = parseInt(localStorage.getItem('supplier_id'))
                    let branch = JSON.parse(localStorage.getItem('branch_type'))
                    params.branchId = branch.default_branch_id
                    params.accessToken = constants.ACCESSTOKEN
                    api = API.UPDATE_BRANCH_PWD
                } else {
                    params.password = new_admin_pass
                    api = API.RESET_PASSWORD()
                }
                services.POST_DATA(params, api, function(response) {
                    $("#reset_password_modal").modal('hide');
                    setTimeout(() => {
                        $("#passSuccess").modal('show');
                    }, 600);
                });
            }

            $rootScope.updateUserProfileImg = function() {
                if (!$rootScope.userImage) return;
                let data = {}
                data.accessToken = constants.ACCESSTOKEN;
                data.sectionId = 30
                data.supplierBranchId = JSON.parse(localStorage.getItem('branch_type')).default_branch_id
                data.logo = $scope.branchLogo

                services.POST_FORM_DATA(data, API.UPDATE_BRANCH_PROFILE_IMAGE, function(response) {
                    if (response && response.data) {
                        $rootScope.user_image = ''
                        $rootScope.user_image = response.data.logo
                        localStorage.setItem('user_image', response.data.logo)
                        $("#edit_user_image").modal('hide');
                        factories.successActionPop('Image changed Successfully');
                    }
                });
            }

            $rootScope.userImage = ''
            $rootScope.updateUserImage = function(img) {
                $rootScope.userImage = img
            }

            $rootScope.file_to_upload_for_user_image = function(File) {
                var file = File[0];
                if (constants.IMAGE_TYPE.includes(file.type)) {
                    if ((file.size / Math.pow(1024, 2)) <= 1) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(event) {
                            $scope.$apply(function() {
                                $rootScope.userImage = event.target.result;
                                $scope.branchLogo = file;

                            });
                        }
                    } else {
                        factories.invalidDataPop("Image size must be less than 1mb");
                    }
                } else {
                    factories.invalidDataPop("Invalid File Type");
                }
            };

            $rootScope.data_country = '';
            $rootScope.changeCountry = function(data_country, flag) {
                $rootScope.data_country = data_country;
                localStorage.setItem('data_country', ($rootScope.data_country.replace('+', '')));
                if (flag) {
                    window.location.reload();
                }
            }

            var getCountryData = function() {
                const payload = {
                    accessToken: constants.ACCESSTOKEN,
                    authSectionId: 42
                }
                services.POST_DATA(payload, '/get_all_countries', function(response) {
                    response.data.map(o => {
                        o.type = 1
                    })
                    $rootScope.countryData = [...response.data];

                    if ($rootScope.is_data_filter_by_country == 1) {
                        $rootScope.countryData.push({
                            country_code: response.data[0].country_code,
                            country_id: response.data[0].country_id,
                            country_name: 'Outside ' + response.data[0].country_name,
                            type: 0
                        })
                    }

                    if (response.data.length) {
                        let country_code = '';
                        country_code = !localStorage.getItem('data_country') ?
                            (response.data[0].country_code + ',' + response.data[0].type) :
                            ('+' + localStorage.getItem('data_country'));

                        $rootScope.changeCountry(country_code, 0);
                    }
                });
            };

            if (!!$rootScope.is_data_filter_by_country) {
                getCountryData();
            }

            $scope.is_notification_blocked = false;
            // var permission = Notification.permission;
            // if (permission == 'denied') {
            //     $scope.is_notification_blocked = true;
            // }

        }
    }
]);