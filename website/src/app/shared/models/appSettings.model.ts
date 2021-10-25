import { GlobalVariable } from './../../core/global';
export class AppSettings {

  public app_type: number;
  public type: number;
  public countryISO: string;
  public webMetaDescription: string;
  public webMetaTitle: string;
  public admin_order_priority: number;
  public cart_flow: number;
  public branch_flow: number;
  public is_pickup_order: number;
  public is_scheduled: number;
  public schedule_time: number;
  public vendor_status: number;
  public is_social_module: number;
  public booking_track_status: number;
  public interval: number;
  public temp_banners: Array<{ display_image: string, website_image: string }>;
  public site_logo: string;
  public android_app_url: string;
  public ios_app_url: string;
  public app_color: string;
  public payment_method: string;
  public is_single_vendor: number;
  public single_vendor_id: number;
  public hasDafaultAddrees: boolean;
  public terminology: object;
  public privacyPolicy: number;
  public termsAndConditions: number;
  public aboutUs: number;
  public faqs: number;
  public template_section: number;
  public referral_feature: number;
  public notification_message_permission: number;
  public chat_enable: number;
  public search_by: number;
  public referral_given_price: string | number;
  public referral_receive_price: string | number;
  public delivery_charge_type: number;
  public supplier_service_fee: number;
  public cart_image_upload: number;
  public order_instructions: number;
  public email: number | string;
  public header_theme: number;
  public isCustomFlow: boolean = false;
  public dynamic_home_section: number;
  public selected_template: number;
  public tag_search: number = 0;
  public user_register_flow: number;
  public service_booking_flow: number = 0;
  public gift_card: number;
  public extra_instructions: number = 0;
  public agent_tip: number = 0;
  public secondary_language: any = 0;
  public things_to_remember: string = '';
  public product_detail: number = 0;
  public bypass_otp: number = 0;
  public payment_card_images: number = 0;
  public is_return_request: number = 0;
  public delivery_distance_unit: number = 0
  public show_prescription_requests: number = 0;
  public category_selection: number = 0;
  public footer_type: number = 0;
  public is_tax_geofence: number = 0;
  public isProductCustomTabDescriptionEnable: number = 0;
  public show_variants_in_cart: number = 0;
  public productCustomTabDescriptionLabel: any = [];
  public laundary_service_flow: number = 0;
  public is_product_wishlist: number = 0;
  public is_supplier_wishlist: number = 0;
  public is_agent_rating: number = 0;
  public is_supplier_rating: number = 0;
  public is_product_rating: number = 0;
  public addCollectFieldInAddress: number = 0;
  public social_media_icons: number = 0;
  public product_prescription: number = 0;
  public categories_above_supplier: number = 0;
  public single_vendor_popular_text: string = '';
  public single_vendor_offer_text: string = '';
  public is_dine_in: number = 0;
  public user_id_proof: number = 0;
  public disable_tax: number = 0;
  public disable_user_cancel_order: number = 0;
  public is_user_subscription: number = 0;
  public singleFoodStoryBackground: number = 0;
  public agentTipPercentage: number = 0;
  public is_loyality_enable: number = 0;
  public is_feedback_form_enabled: number = 0;
  public is_product_weight: number = 0;
  public hideAgentList: number = 0;
  public addon_type_quantity: number = 0;
  public no_default_product_sort: number = 0;
  public logo_background_color: number = 0;
  public order_request: number = 0;
  public auth_terms_check: number = 0;
  public disable_image_force_compression: number = 0;
  public agentsignup: number = 0;
  public enable_multi_supplier_delivery_charge_distance_wise: number = 0;
  public google_pay_merchant_id: string = '';
  public webMetaKeywords: string = '';

  public not_all_variant_required: number = 0;
  public hide_supplier_timing: number = 0;
  public hide_supplier_delivery_time: number = 0;
  public web_custom_domain_theme: number = 0;
  public is_vendor_registration: number = 0;
  public ecom_agent_module: number = 0;
  public price_decimal_length: number = 2;
  public show_expected_delivery_between: number = 0;
  public is_product_border: number = 0;
  public category_popup_width: number = 250;
  public disable_zoom_in_product: number = 0;
  public separate_images_product_detail: number = 0;
  public show_barcode: number = 0;
  public setlogoHeight: number = 0;
  public logoHeight: number = 0;
  public hide_offers_category_home: number = 0;
  public wallet_module: number = 0;
  public is_unify_search: number = 0;
  public is_decimal_quantity_allowed: number = 0;
  public is_social_ecommerce: number = 0;
  public hide_supplier_address: number = 0;
  public disable_user_cancel_after_confirm: number = 0;
  public hide_pickup_status: number = 0;
  public hide_supplier_license_number: number = 0;

  public footer_mockup_image: string = '';
  public footer_mockup_title: string = '';
  public footer_mockup_description: string = '';
  public fackbook_link: string = '';
  public twitter_link: string = '';
  public google_link: string = '';
  public linkedin_link: string = '';
  public instagram_link: string = '';
  public youtube_link: string = '';

  public is_schdule_order: number = 0;
  public payment_through_wallet_discount: number = 0;
  public default_language: number = 0;
  public isFirebaseAnalytics: string = "0";
  public admin_to_user_chat: number = 0;
  public is_segment: string = "0";
  public supplier_to_user_chat: number = 0;
  public is_branch_image_optional: number = 0;
  public agent_android_app_url: string = '';
  public agent_ios_app_url: string = '';
  public can_user_edit: string = '';
  public is_enabled_multiple_base_delivery_charges: number = 0;
  public hide_supplier_phone_email: string = '';
  public is_currency_exchange_rate: number = 0;
  public show_wallet_on_home: number = 0;
  public agent_verification_code_enable: number = 0;
  public enable_promo_code_list: number = 0;
  public hide_supplier_email: number = 0;
  public hide_agent_tip: number = 0;
  public disbale_user_cancel_pending_order: number = 0;
  public footer_color_same_as_header: number = 0;
  public hide_agent_details: number = 0;
  public food_list_pagination: number = 0;
  public disable_login_with_phone: number = 0;
  public no_default_address: number = 0;
  public fetch_current_location_first: number = 0;
  public glassdoor_link: string = '';
  public singleVendorBottomBanner: any = {};

  public by_pass_tables_selection: string = "0";
  public is_table_booking: number;
  public is_table_invite_allowed: string = "0";
  public is_coin_exchange: number = 0;
  public is_abn_business: string = "0";
  public table_booking_add_food_allow: string = "0";

  public is_sos_allow: string = "0";
  public is_survey_monkey_allow: string = "0";

  public content_id: string = "0";

  public is_custom_category_template: string = "0";
  public is_laundry_theme: string = "0";
  public dropoff_buffer: string = "";
  public signup_declaration: string = "";
  public enable_size_chart_in_product: string = "";
  public enable_country_of_origin_in_product: string = "";
  public show_reward_home_button: string = "";

  public is_guest_user_feedback_enable: string = "";
  public is_compare_products: string = "";
  public enable_min_order_distance_wise: string;
  public show_tags_for_suppliers: number;
  public is_glassdoor_link: number = 0;
  public allow_dynamic_image_on_fotter = '0';
  public show_supplier_info_settings: number;
  public show_supplier_categories: number;
  public show_supplier_phone: number;
  public show_supplier_email: number;
  public show_supplier_delivery_timing: number;
  public show_supplier_open_close: number;
  public show_supplier_nationality: number;
  public show_supplier_speciality: number;
  public show_supplier_brand_name: number;
  public display_image_on_customization: number;
  public skip_payment_option: number;
  public is_near_by_supplier_enable: number;
  public is_zoom_call_enabled: number;
  public enable_best_sellers: string = "0";

  public is_alternate_about_us: number;
  public aboutus_two_english: string = "";
  public aboutus_two_other: string = "";
  public enable_tax_on_total_amt: number;
  public is_flavor_of_week_enable: number;
  public flavor_of_week: string;
  public is_delivery_charge_weight_wise_enable: number;

  public is_eligible_order_amount: number;
  public eligible_order_amount: number;


  public is_enable_delivery_type: number;
  public is_enable_multiple_banner: number;

  public is_enable_orderwise_gateways: number;

  public dynamic_order_type_client_wise: number;
  public dynamic_order_type_client_wise_delivery: number;
  public dynamic_order_type_client_wise_pickup: number;
  public dynamic_order_type_client_wise_dinein: number;

  public enable_user_vehicle_number: number;
  public enable_rest_pagination_category_wise: number;

  public address_reference_char_limit: number;
  public enable_item_purchase_limit: number;
  public is_enable_subscription_required: number;
  public is_enable_max_discount_value: number;

  public enable_address_reference: number;

  public enable_referral_bal_limit: number;
  public referral_bal_limit_per_order: number;
  public enable_agent_leave_notes: number;
  public leave_notes_reasons: string;

  public enable_cutlery_option: number;
  public enable_in_out_network: number;
  public enable_audio_video: number;
  public enable_contact_us: number;
  public show_user_subscription_home_button: string;
  public is_instance_selection: number;
  public countryCodes = [];
  public enable_date_of_birth: number;

  public dynamic_home_screen_sections: number;
  public home_screen_sections: any;
  public is_crop_banner: number;

  public trending_rest_section: HomeScreenSection;
  public special_offer_section: HomeScreenSection;
  public best_seller_section: HomeScreenSection;
  public top_selling_section: HomeScreenSection;
  public fastest_del_section: HomeScreenSection;
  public recomm_items_section: HomeScreenSection;
  public near_you_section: HomeScreenSection;
  public cat_wise_rest_section: HomeScreenSection;
  public rating_wise_rest_section: HomeScreenSection;
  public new_rest_section: HomeScreenSection;
  public recent_order_section: HomeScreenSection;

  public enable_food_varients: number;
  public enable_freelancer_flow: number;
  public enable_rating_wise_sorting: number;
  public is_twilio_authy_enable: number;
  public is_number_masking_enable: number;
  public enable_flat_user_service_charge: number;
  public enable_product_allergy: number;

  public enable_supplier_review_list: number;
  public enable_supplier_promo_list: number;

  public enable_supplier_in_special_offer: number;
  public enable_supplier_in_special_offer_user: Number;
  public table_book_mac_theme: number;
  public is_multicurrency_enable: number;

  public enable_min_loyality_points: number;
  public min_loyalty_points_to_redeem: number;
  public min_order_amount_for_loyality_points: number;
  public loyality_point_per_order: number;
  public loyality_point_value: number;

  public enable_non_veg_filter: number;
  public enable_signup_phone_only: number;
  public enable_id_for_invoice_in_profile: number;
  public footer_ad_image = '';
  public loyality_discount_on_product_listing: number;
  public enable_whatsapp_contact_us: number;
  public cutom_country_code: number;
  public enable_product_appointment: number;
  public show_filter_on_home: number;
  public display_slot_with_difference: number;
  public enable_video_in_banner: number;

  public enable_product_special_instruction: number;
  public enable_zone_geofence: number;
  public enable_sequence_wise_supplier: number;

  public enable_no_touch_delivery: number = 0;

  public is_flash_sale: number;
  public plt_liquor_tax: number;
  public liquor_bottle_tax: number;
  public enable_liquor_popup: number;

  public enable_cookies_policy: number;
  public enable_allergy_policy: number;
  public enable_category_age_limit: number;
  public enable_product_calories: number;
  public refund_amount_payment_status: number;
  public enable_custom_footer_home_service: number;
  public is_address_phone_no_optional: Number;
  public is_custom_cart_icon: Number;
  public enable_bypassing_cart: Number;
  public enable_no_order_without_scheduling: Number;
  public is_customized_commision_enable: Number;
  public enable_comma_separation_text: Number;
  public home_section_padding_bottom: Number;
  public home_supplier_section_padding_top: Number;
  public enable_custom_header_contant: Number;
  public enable_min_order_amount_for_free_delivery: Number;
  public min_order_amount_for_free_delivery: Number;
  public min_next_day_scheduling: number;
  public enable_base_delivery_charge_on_vehicle_cat: number
  public pickit_home_theme: number
  public enable_shippo_service: number
  public is_Hide_tableNumber: number
  public enable_restaurant_design_with_cart: number;
  public enable_faindy_changes: number
  public show_header_social_link: number
  public hide_agent_number: number
  public enable_pearwheel_theme: number;
  public show_header_useful_link: number;
  public enable_cravv_theme: number;
  public enable_address_on_rejected_location_permission: number;
  public enable_dynamic_vat_for_supplier_by_admin: number;
  public hide_promo_module: number;
  public enable_address_pin_code: number;
  public tax_on_delivery_charges: number;
  public enable_product_tax_feature : number;
  public enable_supplier_config_closing_day: number;



  public appStyle?: {
    headerBackgroundColor?: string;
    headerTextColor?: string;
    topHeaderTextColor?: string;
    topHeaderBackgroundColor?: string;
    headerFontFamily?: string;
    primaryColor?: string;
    baseColor?: string;
  };



  public logo?: {
    background?: string;
    thumb_url?: string;
    url?: string
  };

  public placeholder: Placeholder;
  public card_gateway: object = {};


  public descriptionSections: Array<{
    title?: string;
    description?: string;
    image?: string;
  }>;

  public default_address?: {
    address?: string,
    latitude?: number
    longitude?: number
  };

  public phone_registration_flag: number;

  constructor(settingObj: any) {
    if (settingObj) {
      this.app_type = settingObj['app_type'];
      this.type = settingObj['app_type'];
      this.countryISO = settingObj['iso'];
      this.webMetaDescription = settingObj['web_meta_description'] || '';
      this.webMetaTitle = settingObj['web_meta_title'] || '';
      this.admin_order_priority = settingObj['admin_order_priority'];
      this.cart_flow = settingObj['cart_flow'];
      this.branch_flow = settingObj['branch_flow'] || 0;
      this.is_pickup_order = settingObj['is_pickup_order'];
      this.is_scheduled = settingObj['is_scheduled'];
      this.schedule_time = settingObj['schedule_time'];
      this.vendor_status = settingObj['vendor_status'];
      this.booking_track_status = settingObj['booking_track_status'];
      this.is_social_module = settingObj['is_social_module'];
      this.interval = settingObj['interval'];
      this.android_app_url = settingObj['android_app_url'];
      this.app_color = settingObj['app_color'];
      this.ios_app_url = settingObj['ios_app_url'];
      this.site_logo = settingObj['logo_url'];
      this.payment_method = settingObj['payment_method'];
      this.is_single_vendor = settingObj['is_single_vendor'];
      this.single_vendor_id = settingObj['single_vendor_id'];
      this.termsAndConditions = settingObj['termsAndConditions'];
      this.privacyPolicy = settingObj['privacyPolicy'];
      this.aboutUs = settingObj['aboutUs'];
      this.countryCodes = settingObj['countryCodes'] || [];
      this.allow_dynamic_image_on_fotter = settingObj['allow_dynamic_image_on_fotter'];
      this.faqs = settingObj['faqs'];
      this.template_section = !!settingObj['template_section'] ? parseInt(settingObj['template_section']) : 0;
      this.referral_feature = settingObj['referral_feature'] || 0;
      this.notification_message_permission = parseInt(settingObj['notification_message_permission']) || 0;
      this.search_by = settingObj['search_by'] ? parseInt(settingObj['search_by']) : 0;
      this.chat_enable = settingObj['chat_enable'];
      this.referral_given_price = settingObj['referral_given_price'] || 0;
      this.referral_receive_price = settingObj['referral_receive_price'] || 0;
      this.delivery_charge_type = settingObj['delivery_charge_type'] || 0;
      this.supplier_service_fee = settingObj['user_service_fee'] || 0;
      this.cart_image_upload = settingObj['cart_image_upload'] || 0;
      this.order_instructions = settingObj['order_instructions'] || 0;
      this.email = settingObj['email'] || 0;
      this.header_theme = settingObj['header_theme'] || 0;
      this.dynamic_home_section = settingObj['dynamic_home_section'] || 0;
      this.selected_template = !!settingObj['selected_template'] ? parseInt(settingObj['selected_template']) : 0;
      this.phone_registration_flag = settingObj['phone_registration_flag'] || 0;
      this.tag_search = settingObj['tag_search'] || 0;
      this.card_gateway = settingObj['card_gateway'] ? jsonParser(settingObj['card_gateway']) : {};
      this.user_register_flow = !!settingObj['user_register_flow'] ? parseInt(settingObj['user_register_flow']) : 0;
      this.descriptionSections = settingObj['description_sections'] ? jsonParser(settingObj['description_sections']) : [];
      this.service_booking_flow = settingObj['service_booking_flow'] || 0;
      this.gift_card = settingObj['gift_card'] || 0;
      this.things_to_remember = settingObj['things_to_remember'] || '';
      this.extra_instructions = settingObj['extra_instructions'] || 0;
      this.secondary_language = settingObj['secondary_language'] || 0;
      this.agent_tip = settingObj['agent_tip'] || 0;
      this.product_detail = settingObj['product_detail'] || 0;
      this.bypass_otp = settingObj['bypass_otp'] || 0;
      this.footer_ad_image = settingObj['footer_ad_image'];
      this.payment_card_images = settingObj['payment_card_images'] || 0;
      this.is_return_request = settingObj['is_return_request'] || 0;
      this.delivery_distance_unit = settingObj['delivery_distance_unit'] || 0;
      this.show_prescription_requests = settingObj['show_prescription_requests'] || 0;
      this.category_selection = settingObj['category_selection'] || 0;
      this.footer_type = settingObj['footer_type'] || 0;
      this.is_tax_geofence = settingObj['is_tax_geofence'] || 0;
      this.isProductCustomTabDescriptionEnable = settingObj['isProductCustomTabDescriptionEnable'] || 0;
      this.show_variants_in_cart = settingObj['show_variants_in_cart'] || 0;
      this.social_media_icons = settingObj['social_media_icons'] || 0;
      this.product_prescription = settingObj['product_prescription'] || 0;
      this.categories_above_supplier = settingObj['categories_above_supplier'] || 0;
      this.is_dine_in = settingObj['is_dine_in'] || 0;
      this.user_id_proof = settingObj['user_id_proof'] || 0;
      this.disable_tax = settingObj['disable_tax'] || 0;
      this.is_user_subscription = settingObj['is_user_subscription'] || 0;
      this.agentTipPercentage = settingObj['agentTipPercentage'] || 0;
      this.is_loyality_enable = settingObj['is_loyality_enable'] || 0;
      this.is_feedback_form_enabled = settingObj['is_feedback_form_enabled'] || 0;
      this.is_product_weight = settingObj['is_product_weight'] || 0;
      this.admin_to_user_chat = settingObj['admin_to_user_chat'] || 0;
      this.supplier_to_user_chat = settingObj['supplier_to_user_chat'] || 0;
      this.can_user_edit = settingObj['can_user_edit'] || 0;
      this.hideAgentList = settingObj['hideAgentList'] || 0;
      this.addon_type_quantity = settingObj['addon_type_quantity'] || 0;
      this.is_unify_search = settingObj['is_unify_search'] || 0;
      this.is_decimal_quantity_allowed = settingObj['is_decimal_quantity_allowed'] || 0;
      this.is_social_ecommerce = settingObj['is_social_ecommerce'] || 0;
      this.is_enabled_multiple_base_delivery_charges = settingObj['is_enabled_multiple_base_delivery_charges'] || 0;
      this.hide_supplier_phone_email = settingObj['hide_supplier_phone_email'] || 0;
      this.is_currency_exchange_rate = settingObj['is_currency_exchange_rate'] || 0;
      this.show_wallet_on_home = settingObj['show_wallet_on_home'] || 0;
      this.agent_verification_code_enable = settingObj['agent_verification_code_enable'] || 0;
      this.no_default_product_sort = settingObj['no_default_product_sort'] || 0;
      this.logo_background_color = settingObj['logo_background_color'] || 0;
      this.hide_supplier_email = settingObj['hide_supplier_email'] || 0;
      this.hide_agent_tip = settingObj['hide_agent_tip'] || 0;
      this.footer_color_same_as_header = settingObj['footer_color_same_as_header'] || 0;
      this.hide_agent_details = settingObj['hide_agent_details'] || 0;
      this.disbale_user_cancel_pending_order = settingObj['disbale_user_cancel_pending_order'] || 0;
      this.disable_user_cancel_after_confirm = settingObj['disable_user_cancel_after_confirm'] || 0;
      this.order_request = settingObj['order_request'] || 0;
      this.food_list_pagination = settingObj['food_list_pagination'] || 0;
      this.disable_login_with_phone = settingObj['disable_login_with_phone'] || 0;
      this.auth_terms_check = settingObj['auth_terms_check'] || 0;
      this.hide_pickup_status = settingObj['hide_pickup_status'] || 0;
      this.no_default_address = settingObj['no_default_address'] || 0;
      this.fetch_current_location_first = settingObj['fetch_current_location_first'] || 0;
      this.disable_image_force_compression = settingObj['disable_image_force_compression'] || 0;
      this.agentsignup = settingObj['agentsignup'] || 0;
      this.is_glassdoor_link = settingObj['is_glassdoor_link'] || 0;
      this.glassdoor_link = settingObj['glassdoor_link'] || '';
      this.enable_multi_supplier_delivery_charge_distance_wise = settingObj['enable_multi_supplier_delivery_charge_distance_wise'] || 0;
      this.google_pay_merchant_id = settingObj['google_pay_merchant_id'] || '';
      this.webMetaKeywords = settingObj['web_meta_keywords'] || '';
      this.show_user_subscription_home_button = settingObj['show_user_subscription_home_button'];
      this.show_reward_home_button = settingObj['show_reward_home_button'];
      this.is_crop_banner = settingObj['is_crop_banner'] ? (Number)(settingObj['is_crop_banner']) : 0;

      if (settingObj['productCustomTabDescriptionLabel']) {
        this.productCustomTabDescriptionLabel = jsonParser(settingObj['productCustomTabDescriptionLabel']);
      }
      this.laundary_service_flow = settingObj['laundary_service_flow'] || 0;
      this.web_custom_domain_theme = settingObj['web_custom_domain_theme'] || 0;
      this.ecom_agent_module = settingObj['ecom_agent_module'] || 0;
      this.is_product_wishlist = settingObj['is_product_wishlist'] || 0;
      this.is_supplier_wishlist = settingObj['is_supplier_wishlist'] || 0;

      this.is_agent_rating = settingObj['is_agent_rating'] || 0;
      this.is_supplier_rating = settingObj['is_supplier_rating'] || 0;
      this.is_product_rating = settingObj['is_product_rating'] || 0;

      this.addCollectFieldInAddress = settingObj['addCollectFieldInAddress'] || 0;
      this.hide_supplier_timing = settingObj['hide_supplier_timing'] || 0;
      this.hide_supplier_delivery_time = settingObj['hide_supplier_delivery_time'] || 0;
      this.wallet_module = settingObj['wallet_module'] || 0;

      this.show_expected_delivery_between = settingObj['show_expected_delivery_between'] || 0;
      this.is_schdule_order = settingObj['is_schdule_order'] || 0;
      this.not_all_variant_required = settingObj['not_all_variant_required'] || 0;
      this.is_product_border = settingObj['is_product_border'] || 0;
      this.category_popup_width = settingObj['category_popup_width'] || 250;
      this.disable_zoom_in_product = settingObj['disable_zoom_in_product'] || 0;
      this.separate_images_product_detail = settingObj['separate_images_product_detail'] || 0;
      this.show_barcode = settingObj['show_barcode'] || 0;
      this.setlogoHeight = settingObj['setlogoHeight'] || 0;
      this.logoHeight = settingObj['logoHeight'] || 0;
      this.disable_user_cancel_order = settingObj['disable_user_cancel_order'] || 0;

      this.payment_through_wallet_discount = settingObj['payment_through_wallet_discount'] ? parseInt(settingObj['payment_through_wallet_discount']) : 0;
      this.default_language = settingObj['default_language'] ? parseInt(settingObj['default_language']) : 0;
      this.hide_offers_category_home = settingObj['hide_offers_category_home'] || 0;
      this.display_image_on_customization = settingObj['display_image_on_customization'] ? (Number)(settingObj['display_image_on_customization']) : 0;
      this.is_vendor_registration = settingObj['is_vendor_registration'] || 0;
      this.price_decimal_length = settingObj['price_decimal_length'] ? parseInt(settingObj['price_decimal_length']) : 2;

      this.footer_mockup_image = settingObj['footer_mockup_image'] || '';
      this.footer_mockup_title = settingObj['footer_mockup_title'] || '';
      this.footer_mockup_description = settingObj['footer_mockup_description'] || '';
      this.fackbook_link = settingObj['fackbook_link'] || '';
      this.twitter_link = settingObj['twitter_link'] || '';
      this.google_link = settingObj['google_link'] || '';
      this.linkedin_link = settingObj['linkedin_link'] || '';
      this.instagram_link = settingObj['instagram_link'] || '';
      this.youtube_link = settingObj['youtube_link'] || '';
      this.is_branch_image_optional = settingObj['is_branch_image_optional'] || 0;
      this.agent_android_app_url = settingObj['agent_android_app_url'] || '';
      this.agent_ios_app_url = settingObj['agent_ios_app_url'] || '';
      this.enable_id_for_invoice_in_profile = settingObj['enable_id_for_invoice_in_profile'] ? parseInt(settingObj['enable_id_for_invoice_in_profile']) : 0;
      this.single_vendor_popular_text = settingObj['single_vendor_popular_text'] || '';
      this.single_vendor_offer_text = settingObj['single_vendor_offer_text'] || '';
      this.singleFoodStoryBackground = settingObj['singleFoodStoryBackground'] || '';
      this.loyality_discount_on_product_listing = settingObj['loyality_discount_on_product_listing'] ? parseInt(settingObj['loyality_discount_on_product_listing']) : 0;
      this.enable_whatsapp_contact_us = settingObj['enable_whatsapp_contact_us'] ? parseInt(settingObj['enable_whatsapp_contact_us']) : 0;
      this.cutom_country_code = settingObj['cutom_country_code'] ? parseInt(settingObj['cutom_country_code']) : 0;
      this.enable_product_appointment = settingObj['enable_product_appointment'] ? parseInt(settingObj['enable_product_appointment']) : 0;
      this.refund_amount_payment_status = settingObj['refund_amount_payment_status'] ? parseInt(settingObj['refund_amount_payment_status']) : 0;
      this.show_filter_on_home = settingObj['show_filter_on_home '] || 0;
      this.min_next_day_scheduling = settingObj['min_next_day_scheduling'] || 0
      this.enable_base_delivery_charge_on_vehicle_cat = settingObj['enable_base_delivery_charge_on_vehicle_cat'] || 0
      this.pickit_home_theme = settingObj['pickit_home_theme'] || 0;
      this.enable_shippo_service = settingObj['enable_shippo_service'] || 0;
      this.is_Hide_tableNumber = settingObj['is_Hide_tableNumber'] || 0
      this.enable_faindy_changes = settingObj['enable_faindy_changes'] || 0
      this.show_header_social_link = settingObj['show_header_social_link'] || 0
      this.hide_agent_number = settingObj['hide_agent_number'] || 0
      this.enable_address_on_rejected_location_permission = settingObj['enable_address_on_rejected_location_permission'] || 0
      this.enable_dynamic_vat_for_supplier_by_admin = settingObj['enable_dynamic_vat_for_supplier_by_admin'] || 0
      this.hide_promo_module = settingObj['hide_promo_module'] || 0
      this.enable_address_pin_code = settingObj['enable_address_pin_code'] || 0

      this.singleVendorBottomBanner = {
        banner1: settingObj['singleFoodBottomBanner1'] || '',
        banner2: settingObj['singleFoodBottomBanner2'] || '',
        offer_Text: settingObj['single_vendor_offer_text'] || '',
        popular_Text: settingObj['single_vendor_popular_text'] || '',
      }

      const placeholder = {};
      if (settingObj['user_location']) {
        placeholder['user_location'] = jsonParser(settingObj['user_location']);
      }

      if (settingObj['empty_cart']) {
        placeholder['empty_cart'] = jsonParser(settingObj['empty_cart']);
      }

      if (settingObj['order_loader']) {
        placeholder['order_loader'] = jsonParser(settingObj['order_loader']);
      }

      if (settingObj['website_background']) {
        placeholder['website_background'] = jsonParser(settingObj['website_background']);
      }

      if (settingObj['user_subscription_placeholder']) {
        placeholder['user_subscription_placeholder'] = jsonParser(settingObj['user_subscription_placeholder']);
      }

      this.placeholder = new Placeholder(placeholder);

      if (settingObj['terminology']) {
        try {
          this.terminology = JSON.parse(settingObj['terminology']);
        } catch {
          this.terminology = {};
        }
      }

      this.appStyle = {
        baseColor: settingObj['element_color'],
        primaryColor: settingObj['theme_color'],
        headerFontFamily: settingObj['font_family'],
        headerBackgroundColor: settingObj['header_color'],
        headerTextColor: settingObj['header_text_color'],
        topHeaderBackgroundColor: settingObj['header_color'],
        topHeaderTextColor: settingObj['header_text_color']
      };

      this.logo = {
        background: settingObj['logo_background'],
        url: settingObj['logo_url'],
        thumb_url: settingObj['logo_thumb_url']
      }

      this.temp_banners = [
        { display_image: settingObj['banner_one_thumb'], website_image: settingObj['banner_one'] },
        { display_image: settingObj['banner_two_thumb'], website_image: settingObj['banner_two'] },
        { display_image: settingObj['banner_three_thumb'], website_image: settingObj['banner_three'] },
        { display_image: settingObj['banner_four_thumb'], website_image: settingObj['banner_four'] }
      ];

      // if (!!settingObj['banner_url']) {
      //   this.temp_banners.unshift({
      //     display_image: settingObj['banner_thumb_url'],
      //     website_image: settingObj['banner_url']
      //   });
      // }

      if (GlobalVariable.flowData && GlobalVariable.flowData.length) {
        if (GlobalVariable.flowData.length > 1) {
          this.isCustomFlow = true;
        } else {
          this.app_type = GlobalVariable.flowData[0].flow_type;
          this.isCustomFlow = false;
        }
      }

      if (settingObj.default_address) {
        this.default_address = {
          address: settingObj['default_address']['address'],
          latitude: settingObj['default_address']['latitude'],
          longitude: settingObj['default_address']['longitude']
        }
      }

      this.isFirebaseAnalytics = settingObj['isFirebaseAnalytics'] || "0";
      this.is_segment = settingObj['is_segment'] || "0";
      this.by_pass_tables_selection = settingObj['by_pass_tables_selection'] || "0";
      this.is_table_booking = (Number)(settingObj['is_table_booking']) ?
        (Number)(settingObj['is_table_booking']) : 0;
      this.is_table_invite_allowed = settingObj['is_table_invite_allowed'] || "0";
      this.is_coin_exchange = settingObj['is_coin_exchange'] || 0;
      this.is_abn_business = settingObj['is_abn_business'] || "0";
      this.table_booking_add_food_allow = settingObj['table_booking_add_food_allow'] || "0";
      this.is_sos_allow = settingObj['is_sos_allow'] || "0";
      this.is_survey_monkey_allow = settingObj['is_survey_monkey_allow'] || "0";

      this.content_id = settingObj['content_id'] || "0";

      this.is_custom_category_template = settingObj['is_custom_category_template'] || "0";
      this.enable_best_sellers = settingObj['enable_best_sellers'] || "0";

      this.is_alternate_about_us = settingObj['is_alternate_about_us'] ? (Number)(settingObj['is_alternate_about_us']) : 0;
      if (this.is_alternate_about_us) {
        this.aboutus_two_english = settingObj['aboutus_two_english'] || "";
        this.aboutus_two_other = settingObj['aboutus_two_other'] || "";
      }
      this.is_laundry_theme = settingObj['is_laundry_theme'] || "0";
      this.dropoff_buffer = settingObj['dropoff_buffer'] || "0";

      this.signup_declaration = settingObj['signup_declaration'] || "0";

      this.enable_size_chart_in_product = settingObj['enable_size_chart_in_product'] || "0";
      this.enable_country_of_origin_in_product = settingObj['enable_country_of_origin_in_product'] || "0";

      this.is_guest_user_feedback_enable = settingObj['is_guest_user_feedback_enable'] || "0";
      this.is_compare_products = settingObj['is_compare_products'] || "0";
      this.enable_promo_code_list = settingObj['enable_promo_code_list'] || "0";
      this.enable_best_sellers = settingObj['enable_best_sellers'] || "0";
      this.enable_min_order_distance_wise = settingObj['enable_min_order_distance_wise'] || "0";
      this.show_tags_for_suppliers = settingObj['show_tags_for_suppliers'] ? (Number)(settingObj['show_tags_for_suppliers']) : 0;


      this.show_supplier_info_settings = settingObj['show_supplier_info_settings'] ? (Number)(settingObj['show_supplier_info_settings']) : 0;
      this.hide_supplier_address = settingObj['hide_supplier_address'] ? (Number)(settingObj['hide_supplier_address']) : 0;
      this.hide_supplier_license_number = settingObj['hide_supplier_license_number'] ? (Number)(settingObj['hide_supplier_license_number']) : 0;

      if (this.show_supplier_info_settings) {
        this.show_supplier_categories = settingObj['show_supplier_categories'] ? (Number)(settingObj['show_supplier_categories']) : 0;
        this.show_supplier_phone = settingObj['show_supplier_phone'] ? (Number)(settingObj['show_supplier_phone']) : 0;
        this.show_supplier_email = settingObj['show_supplier_email'] ? (Number)(settingObj['show_supplier_email']) : 0;
        this.show_supplier_delivery_timing = settingObj['show_supplier_delivery_timing'] ? (Number)(settingObj['show_supplier_delivery_timing']) : 0;
        this.show_supplier_open_close = settingObj['show_supplier_open_close'] ? (Number)(settingObj['show_supplier_open_close']) : 0;
        this.show_supplier_nationality = settingObj['show_supplier_nationality'] ? (Number)(settingObj['show_supplier_nationality']) : 0;
        this.show_supplier_speciality = settingObj['show_supplier_speciality'] ? (Number)(settingObj['show_supplier_speciality']) : 0;
        this.show_supplier_brand_name = settingObj['show_supplier_brand_name'] ? (Number)(settingObj['show_supplier_brand_name']) : 0;
      }

      this.is_near_by_supplier_enable = settingObj['is_near_by_supplier_enable'] ? (Number)(settingObj['is_near_by_supplier_enable']) : 0;
      this.is_zoom_call_enabled = settingObj['is_zoom_call_enabled'] ? (Number)(settingObj['is_zoom_call_enabled']) : 0;
      this.enable_tax_on_total_amt = settingObj['enable_tax_on_total_amt'] ? (Number)(settingObj['enable_tax_on_total_amt']) : 0;
      this.is_flavor_of_week_enable = settingObj['is_flavor_of_week_enable'] ? (Number)(settingObj['is_flavor_of_week_enable']) : 0;
      if (this.is_flavor_of_week_enable) {
        this.flavor_of_week = settingObj['flavor_of_week'] ? settingObj['flavor_of_week'] : '';
      }
      this.is_delivery_charge_weight_wise_enable = settingObj['is_delivery_charge_weight_wise_enable'] ?
        (Number)(settingObj['is_delivery_charge_weight_wise_enable']) : 0;

      this.is_eligible_order_amount = settingObj['is_eligible_order_amount'] ? (Number)(settingObj['is_eligible_order_amount']) : 0;
      this.eligible_order_amount = settingObj['eligible_order_amount'] ? (Number)(settingObj['eligible_order_amount']) : 0;
      this.is_enable_delivery_type = settingObj['is_enable_delivery_type'] ? (Number)(settingObj['is_enable_delivery_type']) : 0;
      this.is_enable_multiple_banner = settingObj['is_enable_multiple_banner'] ? (Number)(settingObj['is_enable_multiple_banner']) : 0;

      this.is_enable_orderwise_gateways = settingObj['is_enable_orderwise_gateways'] ? (Number)(settingObj['is_enable_orderwise_gateways']) : 0;

      this.dynamic_order_type_client_wise = settingObj['dynamic_order_type_client_wise'] ?
        (Number)(settingObj['dynamic_order_type_client_wise']) : 0;

      if (this.dynamic_order_type_client_wise) {
        this.dynamic_order_type_client_wise_delivery = (Number)(settingObj['dynamic_order_type_client_wise_delivery']) ?
          (Number)(settingObj['dynamic_order_type_client_wise_delivery']) : 0;
        this.dynamic_order_type_client_wise_pickup = (Number)(settingObj['dynamic_order_type_client_wise_pickup']) ?
          (Number)(settingObj['dynamic_order_type_client_wise_pickup']) : 0;
        if (this.is_table_booking) {
          this.dynamic_order_type_client_wise_dinein = (Number)(settingObj['dynamic_order_type_client_wise_dinein']) ?
            (Number)(settingObj['dynamic_order_type_client_wise_dinein']) : 0;
        }
      }

      this.hide_supplier_license_number = settingObj['hide_supplier_license_number'] ? (Number)(settingObj['hide_supplier_license_number']) : 0;

      this.enable_user_vehicle_number = settingObj['enable_user_vehicle_number'] ? (Number)(settingObj['enable_user_vehicle_number']) : 0;

      this.enable_rest_pagination_category_wise = settingObj['enable_rest_pagination_category_wise'] ?
        (Number)(settingObj['enable_rest_pagination_category_wise']) : 0;


      this.address_reference_char_limit = (Number)(settingObj['address_reference_char_limit']) || 0;

      this.enable_item_purchase_limit = settingObj['enable_item_purchase_limit'] ?
        (Number)(settingObj['enable_item_purchase_limit']) : 0;
      this.is_enable_subscription_required = settingObj['is_enable_subscription_required'] ?
        (Number)(settingObj['is_enable_subscription_required']) : 0;
      this.is_enable_max_discount_value = settingObj['is_enable_max_discount_value'] ?
        (Number)(settingObj['is_enable_max_discount_value']) : 0;


      this.enable_address_reference = settingObj['enable_address_reference'] ?
        (Number)(settingObj['enable_address_reference']) : 0;

      this.enable_referral_bal_limit = settingObj['enable_referral_bal_limit'] ?
        (Number)(settingObj['enable_referral_bal_limit']) : 0;
      if (this.enable_referral_bal_limit) {
        this.referral_bal_limit_per_order = settingObj['referral_bal_limit_per_order'] ?
          (Number)(settingObj['referral_bal_limit_per_order']) : 0;
      }

      this.enable_agent_leave_notes = settingObj['enable_agent_leave_notes'] ?
        (Number)(settingObj['enable_agent_leave_notes']) : 0;
      if (this.enable_agent_leave_notes) {
        this.leave_notes_reasons = settingObj['leave_notes_reasons'] || ''
      }

      this.enable_cutlery_option = settingObj['enable_cutlery_option'] ?
        (Number)(settingObj['enable_cutlery_option']) : 0;


      this.is_instance_selection = settingObj['is_instance_selection'] ?
        (Number)(settingObj['is_instance_selection']) : 0;
      this.enable_in_out_network = settingObj['enable_in_out_network'] ?
        (Number)(settingObj['enable_in_out_network']) : 0;

      this.enable_audio_video = settingObj['enable_audio_video'] ?
        (Number)(settingObj['enable_audio_video']) : 0;

      this.enable_contact_us = settingObj['enable_contact_us'] ?
        (Number)(settingObj['enable_contact_us']) : 0;
      this.enable_date_of_birth = settingObj['enable_date_of_birth'] ?
        (Number)(settingObj['enable_date_of_birth']) : 0;

      this.dynamic_home_screen_sections = settingObj['dynamic_home_screen_sections'] ?
        (Number)(settingObj['dynamic_home_screen_sections']) : 0;
      if (this.dynamic_home_screen_sections) {
        this.home_screen_sections = settingObj['home_screen_sections'] ? JSON.parse(settingObj['home_screen_sections']) : null;
        if (this.home_screen_sections) {
          this.home_screen_sections = this.home_screen_sections.sort(function (a, b) { return a.section_place - b.section_place });
          this.trending_rest_section = this.home_screen_sections.find(x => x.code == 'trending_rest');
          this.special_offer_section = this.home_screen_sections.find(x => x.code == 'special_offer');
          this.best_seller_section = this.home_screen_sections.find(x => x.code == 'best_seller');
          this.top_selling_section = this.home_screen_sections.find(x => x.code == 'top_selling');
          this.fastest_del_section = this.home_screen_sections.find(x => x.code == 'fastest_del');
          this.recomm_items_section = this.home_screen_sections.find(x => x.code == 'recomm_items');
          this.near_you_section = this.home_screen_sections.find(x => x.code == 'near_you');
          this.cat_wise_rest_section = this.home_screen_sections.find(x => x.code == 'category_wise_rest');
          this.rating_wise_rest_section = this.home_screen_sections.find(x => x.code == 'highest_rating_resturant');
          this.new_rest_section = this.home_screen_sections.find(x => x.code == 'new_resturant');
          this.recent_order_section = this.home_screen_sections.find(x => x.code == 'recent_orders');

        }
      }

      this.enable_food_varients = settingObj['enable_food_varients'] ?
        (Number)(settingObj['enable_food_varients']) : 0;

      this.enable_freelancer_flow = settingObj['enable_freelancer_flow'] ?
        (Number)(settingObj['enable_freelancer_flow']) : 0;

      this.enable_rating_wise_sorting = settingObj['enable_rating_wise_sorting'] ?
        (Number)(settingObj['enable_rating_wise_sorting']) : 0;

      this.is_twilio_authy_enable = settingObj['is_twilio_authy_enable'] ?
        (Number)(settingObj['is_twilio_authy_enable']) : 0;

      this.is_number_masking_enable = settingObj['is_number_masking_enable'] ?
        (Number)(settingObj['is_number_masking_enable']) : 0;

      this.enable_flat_user_service_charge = settingObj['enable_flat_user_service_charge'] ?
        (Number)(settingObj['enable_flat_user_service_charge']) : 0;

      this.enable_product_allergy = settingObj['enable_product_allergy'] ?
        (Number)(settingObj['enable_product_allergy']) : 0;


      this.enable_supplier_review_list = settingObj['enable_supplier_review_list'] ?
        (Number)(settingObj['enable_supplier_review_list']) : 0;
      this.enable_supplier_promo_list = settingObj['enable_supplier_promo_list'] ?
        (Number)(settingObj['enable_supplier_promo_list']) : 0;

      this.enable_supplier_in_special_offer = settingObj['enable_supplier_in_special_offer'] ?
        (Number)(settingObj['enable_supplier_in_special_offer']) : 0;

      this.enable_supplier_in_special_offer_user = settingObj['enable_supplier_in_special_offer_user'] ?
        (Number)(settingObj['enable_supplier_in_special_offer_user']) : 0;

      this.table_book_mac_theme = settingObj['table_book_mac_theme'] ?
        (Number)(settingObj['table_book_mac_theme']) : 0;

      this.is_multicurrency_enable = settingObj['is_multicurrency_enable'] ?
        (Number)(settingObj['is_multicurrency_enable']) : 0;

      this.enable_min_loyality_points = settingObj['enable_min_loyality_points'] ?
        (Number)(settingObj['enable_min_loyality_points']) : 0;

      if (this.enable_min_loyality_points) {
        this.min_loyalty_points_to_redeem = settingObj['min_loyalty_points_to_redeem'] ?
          (Number)(settingObj['min_loyalty_points_to_redeem']) : 0;
        this.min_order_amount_for_loyality_points = settingObj['min_order_amount_for_loyality_points'] ?
          (Number)(settingObj['min_order_amount_for_loyality_points']) : 0;
        this.loyality_point_per_order = settingObj['loyality_point_per_order'] ?
          (Number)(settingObj['loyality_point_per_order']) : 0;
        this.loyality_point_value = settingObj['loyality_point_value'] ?
          (Number)(settingObj['loyality_point_value']) : 0;
      }

      this.enable_non_veg_filter = settingObj['enable_non_veg_filter'] ?
        (Number)(settingObj['enable_non_veg_filter']) : 0;

      this.enable_signup_phone_only = settingObj['enable_signup_phone_only'] ?
        (Number)(settingObj['enable_signup_phone_only']) : 0;

      this.tax_on_delivery_charges = settingObj['tax_on_delivery_charges'] ?
        (Number)(settingObj['tax_on_delivery_charges']) : 0;

        this.enable_product_tax_feature = settingObj['enable_product_tax_feature'] ?
        (Number)(settingObj['enable_product_tax_feature']) : 0;


        this.enable_product_special_instruction = settingObj['enable_product_special_instruction'] ?
        (Number)(settingObj['enable_product_special_instruction']) : 0;

      this.skip_payment_option = settingObj['skip_payment_option'] ?
        (Number)(settingObj['skip_payment_option']) : 0;

      this.enable_custom_footer_home_service = settingObj['enable_custom_footer_home_service'] ?
        (Number)(settingObj['enable_custom_footer_home_service']) : 0;

      this.is_address_phone_no_optional = settingObj['is_address_phone_no_optional'] ?
        (Number)(settingObj['is_address_phone_no_optional']) : 0;

      this.enable_zone_geofence = settingObj['enable_zone_geofence'] ?
        (Number)(settingObj['enable_zone_geofence']) : 0;

      this.enable_sequence_wise_supplier = settingObj['enable_sequence_wise_supplier'] ?
        (Number)(settingObj['enable_sequence_wise_supplier']) : 0;

      this.enable_no_touch_delivery = settingObj['enable_no_touch_delivery'] ?
        (Number)(settingObj['enable_no_touch_delivery']) : 0;

      this.display_slot_with_difference = settingObj['display_slot_with_difference'] ?
        (Number)(settingObj['display_slot_with_difference']) : 0;

      this.enable_video_in_banner = settingObj['enable_video_in_banner'] ?
        (Number)(settingObj['enable_video_in_banner']) : 0;

      this.is_flash_sale = settingObj['is_flash_sale'] ?
        (Number)(settingObj['is_flash_sale']) : 0;

      this.plt_liquor_tax = settingObj['plt_liquor_tax'] ?
        (Number)(settingObj['plt_liquor_tax']) : 0;

      this.liquor_bottle_tax = settingObj['liquor_bottle_tax'] ?
        (Number)(settingObj['liquor_bottle_tax']) : 0;

      this.enable_liquor_popup = settingObj['enable_liquor_popup'] ?
        (Number)(settingObj['enable_liquor_popup']) : 0;

      this.enable_cookies_policy = settingObj['enable_cookies_policy'] ?
        (Number)(settingObj['enable_cookies_policy']) : 0;

      this.enable_allergy_policy = settingObj['enable_allergy_policy'] ?
        (Number)(settingObj['enable_allergy_policy']) : 0;

      this.enable_category_age_limit = settingObj['enable_category_age_limit'] ?
        (Number)(settingObj['enable_category_age_limit']) : 0;

      this.enable_product_calories = settingObj['enable_product_calories'] ?
        (Number)(settingObj['enable_product_calories']) : 0;
      this.is_custom_cart_icon = settingObj['is_custom_cart_icon'] ?
        (Number)(settingObj['is_custom_cart_icon']) : 0;

      this.enable_supplier_config_closing_day = settingObj['enable_supplier_config_closing_day'] ?
        (Number)(settingObj['enable_supplier_config_closing_day']) : 0;


      this.enable_bypassing_cart = settingObj['enable_bypassing_cart'] ?
        (Number)(settingObj['enable_bypassing_cart']) : 0;

      this.enable_no_order_without_scheduling = settingObj['enable_no_order_without_scheduling'] ?
        (Number)(settingObj['enable_no_order_without_scheduling']) : 0;

      this.is_customized_commision_enable = settingObj['is_customized_commision_enable'] ?
        (Number)(settingObj['is_customized_commision_enable']) : 0;

      this.enable_comma_separation_text = settingObj['enable_comma_separation_text'] ?
        (Number)(settingObj['enable_comma_separation_text']) : 0;

      this.home_section_padding_bottom = settingObj['home_section_padding_bottom'] ?
        (Number)(settingObj['home_section_padding_bottom']) : 40;

      this.home_supplier_section_padding_top = settingObj['home_supplier_section_padding_top'] ?
        (Number)(settingObj['home_supplier_section_padding_top']) : 60;

      this.enable_custom_header_contant = settingObj['enable_custom_header_contant'] ?
        (Number)(settingObj['enable_custom_header_contant']) : 0;

      this.enable_min_order_amount_for_free_delivery = settingObj['enable_min_order_amount_for_free_delivery'] ?
        (Number)(settingObj['enable_min_order_amount_for_free_delivery']) : 0;

      this.min_order_amount_for_free_delivery = settingObj['min_order_amount_for_free_delivery'] ?
        (Number)(settingObj['min_order_amount_for_free_delivery']) : 0;

      this.enable_restaurant_design_with_cart = settingObj['enable_restaurant_design_with_cart'] ? (Number)(settingObj['enable_restaurant_design_with_cart']) : 0
      this.enable_pearwheel_theme = settingObj['enable_pearwheel_theme'] ?
        (Number)(settingObj['enable_pearwheel_theme']) : 0;

        this.show_header_useful_link = settingObj['show_header_useful_link'] ? (Number)(settingObj['show_header_useful_link']) : 0;
        this.enable_cravv_theme = settingObj['enable_cravv_theme'] ? (Number)(settingObj['enable_cravv_theme']) : 0;


    }
  }
}

class Placeholder {
  user_location: PlaceholderKey;
  empty_cart: PlaceholderKey;
  order_loader: PlaceholderKey;
  website_background: PlaceholderKey;

  constructor(obj?: any) {
    if (!obj) return;
    this.user_location = new PlaceholderKey(obj.user_location)
    this.empty_cart = new PlaceholderKey(obj.empty_cart)
    this.order_loader = new PlaceholderKey(obj.order_loader)
    this.website_background = new PlaceholderKey(obj.website_background)
  }

}

class PlaceholderKey {
  id: number;
  app: string;
  web: string;
  constructor(obj?: any) {
    if (!obj) return;
    this.id = obj.id;
    this.app = obj.app;
    this.web = obj.web;
  }
}

class HomeScreenSection {
  id: number;
  code: string;
  section_name: string;
  section_place: string;
  is_active: number;
}


function jsonParser(json: string) {
  if (!json) return;
  try {
    return JSON.parse(json);
  } catch (err) {
    return;
  }
}
