Royo.controller('SupplierProfileCtrl', ['$scope', 'services', 'factories', 'constants', '$rootScope', 'API', 'pagerService',
  function ($scope, services, factories, constants, $rootScope, API, pagerService) {

    $scope.suppliers = [];
    $scope.is_add = false;
    $scope.search = '';
    $scope.count = 0;
    $scope.currentPage = 1;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.order_by = 0;
    $scope.is_desc = 0;
    $scope.dataLoaded = false;
    $scope.is_active = 1;
    $scope.categories = [];
    $scope.subCategories = [];
    $scope.detSubCategories = [];
    $scope.supplier = {
      name: '',
      nameAr: '',
      email: '',
      mobile: '',
      commission: '',
      address: '',
      latitude: 0,
      longitude: 0,
      self_pickup: 2,
      is_multibranch: 0,
      pickupCommision: '',
      license_number: '',
      gst_price: '',
      country_of_origin: '',
      is_out_network: 0
    };
    $scope.message = '';
    $scope.mark_all = false;
    $scope.mark_all_sub = false;
    $scope.mark_all_det = false;
    $scope.invalid_phone_no = false;
    $scope.selectedTabs = [];

    $scope.isCsv = false;
    $scope.selectedCsv = {};

    $scope.supplierTagsList = [];
    $scope.mark_all_tags = false;
    $scope.selectedTagList = [];


    $scope.notification_open = false;
    $scope.notification = { msg: '' };
    $scope.checkall = false;
    $scope.selected_users = [];
    $scope.selected_emails = [];
    $scope.message = '';
    $scope.message_type = 1;
    $scope.email = {
      body: '',
      subject: ''
    };



    $scope.suppliersForIndexing = [];


    $scope.is_hide_delivery = false;
    $scope.is_hide_pickup = false;
    $scope.is_hide_dinin = false;

    $scope.disable_delivery_mode = false;

    $scope.is_out_network = 0;
    $scope.isStripeConnected = 0;

    $scope.countries = [];

    $scope.is_suppliers_schedule = 0;


    $scope.read_more_text = '';
    $scope.read_more_label = '';

    if (factories.getSettings().key_value.supplier_country_of_origin == 1) {
      $.getJSON("/js/components/countries.json", function (data) {
        if (data) {
          $scope.countries = Object.values(data);
        }
      });
    }
    $scope.selectCountry = function (country) {
      $scope.supplier.country_of_origin = country;
    }


    $scope.isProductCustomTabDescEnable = factories.getSettings().key_value.isProductCustomTabDescriptionEnable ? JSON.parse(factories.getSettings().key_value.isProductCustomTabDescriptionEnable) : 0;
    if ($scope.isProductCustomTabDescEnable == 1) {
      let arr = factories.getSettings().key_value.productCustomTabDescriptionLabel ? JSON.parse(factories.getSettings().key_value.productCustomTabDescriptionLabel) : [];
      $scope.productCustomTabLabel = [...arr];
      console.log('', $scope.productCustomTabLabel);
    }

    var initialize = function () {
      var input = document.querySelector("#supp_phone");
      $scope.iti = window.intlTelInput(input, {
        preferredCountries: [factories.getSettings().adminDetails[0].iso]
      });
      $scope.iti.setCountry(factories.getSettings().adminDetails[0].iso);
      var input = document.getElementById('addressSearchTextField');
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        $scope.supplier.latitude = place.geometry.location.lat();
        $scope.supplier.longitude = place.geometry.location.lng();
        $scope.supplier.address = place.formatted_address;
      });
    }

    $scope.changeSelfPickup = function (is_self_pickup) {
      $scope.supplier.self_pickup = parseInt(is_self_pickup);
    }

    $scope.checkFlow = function (types) {
      return $rootScope.app_type > 10 && $rootScope.flow_data.length && types.length ? $rootScope.flow_data.some(flow => types.includes(flow.flow_type)) : false;
    }

    $scope.changeView = function (val) {
      $scope.is_add = val;
      if (val) {
        $scope.supplier = {
          name: '',
          nameAr: '',
          email: '',
          mobile: '',
          address: '',
          latitude: 0,
          longitude: 0,
          self_pickup: $rootScope.is_dine_in == 1 ? 1 : 2,
          is_multibranch: 0,
          commission: '',
          pickupCommision: '',
          license_number: '',
          gst_price: '',
          country_of_origin: '',
          is_out_network: 0,
          slogan_en: '',
          slogan_ol: ''
        };
        $scope.categories = [];
        $scope.subCategories = [];
        $scope.detSubCategories = [];
        setTimeout(() => {
          initialize();
        }, 500);
        getCategories();

        $scope.setOrderTypeClientWise();
      }
    }

    $scope.summernote_config = {
      height: 200,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
      ]
    }

    if($rootScope.is_pickup) {
      $scope.is_hide_delivery = [1].includes($scope.is_pickup) ? true : false;
      $scope.is_hide_pickup = [0].includes($scope.is_pickup) ? true : false;
      $scope.tabStatus = ($scope.is_hide_delivery && $scope.is_hide_pickup) ? 3 : ($scope.is_hide_delivery && !$scope.is_hide_pickup) ? 2 : 1
  }

    $scope.selectTabs = function (tabId) {
      if ($scope.selectedTabs.includes(tabId)) {
        $scope.selectedTabs.splice($scope.selectedTabs.indexOf(tabId), 1);
      } else {
        $scope.selectedTabs.push(tabId);
      }
    }



    $scope.setOrderTypeClientWise = function () {
      if ($rootScope.dynamic_order_type_client_wise) {
        if ($rootScope.dynamic_order_type_client_wise_delivery != 1) {
          $scope.is_hide_delivery = true;
          $scope.supplier.self_pickup = '1';
        }
        if ($rootScope.dynamic_order_type_client_wise_pickup != 1) {
          $scope.is_hide_pickup = true;
          $scope.supplier.self_pickup = '0';
        }
        if ($rootScope.dynamic_order_type_client_wise_dinein != 1) {
          $scope.is_hide_dinin = true;
        }
      }
    }



    $scope.filterByInOutNetwork = function (is_out_network) {
      $scope.is_out_network = is_out_network;
      $scope.getRegSuppliers(1);
    }

    $scope.filterByStripe = function (value) {
      if ($scope.isStripeConnected !== value) {
        $scope.isStripeConnected = value;
        $scope.skip = 0;
      }
      $scope.getRegSuppliers(1);
    }

    //Call Get Registered Suppliers Data Service
    $scope.getRegSuppliers = function (page) {
      $scope.dataLoaded = false;
      $scope.suppliers = [];
      let params = {
        limit: $scope.limit,
        offset: $scope.skip,
        order_by: $scope.order_by,
        is_desc: $scope.is_desc,
        is_active: $scope.is_active
      }
      if ($scope.isStripeConnected !== 0) {
        params.is_stripe_connected = $scope.isStripeConnected
      }
      params.search = ($scope.search).trim() ? $scope.search : '';

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }

      params.is_out_network = $scope.is_out_network;

      services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
        if (!!response && response.status === 4) {
          $scope.suppliers = response.data.suppliersList;
          $scope.count = response.data.count;
          if ($rootScope.enable_all_supplier_scheduling_status_update == 1) {
            $scope.is_suppliers_schedule = response.data.is_suppliers_schedule;
          }

          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
          $scope.dataLoaded = true;


          // if($rootScope.is_secondary_language) {
          //   $scope.langData();
          // }
        }
      });
    };
    $scope.getRegSuppliers(1);

    $scope.changeTab = function (status) {
      $scope.is_active = status;
      $scope.skip = 0;
      $scope.order_by = 0;
      $scope.is_desc = 0;
      $scope.is_out_network = 0;
      $scope.getRegSuppliers(1);
    }

    $scope.changeBranchType = function (branch_type) {
      $scope.supplier.is_multibranch = branch_type;
    }

    $scope.changePhone = function (phone) {
      if ($scope.iti.isValidNumber()) {
        $scope.invalid_phone_no = false;
      } else {
        $scope.invalid_phone_no = true;
      }
    }

    $scope.registerSupplier = function (addSupplierForm) {

      getMarkedCategories();

      if (addSupplierForm.$submitted && addSupplierForm.$invalid) return;

      console.log($scope.iti.isValidNumber())

      if ($scope.iti.isValidNumber()) {
        $scope.invalid_phone_no = false;
      } else {
        $scope.invalid_phone_no = true;
        return;
      }

      if (!$scope.supplier.latitude || !$scope.supplier.longitude) {
        factories.invalidDataPop("Please choose a valid address");
        return;
      }

      // if (!$scope.selectedCategories.length && $rootScope.supplier_category_not_required == 0) {
      //   factories.invalidDataPop("Please select category");
      //   return;
      // }

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 22;

      if (JSON.stringify($scope.selectedCategories)) {
        param_data.categoryIds = JSON.stringify($scope.selectedCategories);
      }

      param_data.supplierName = $scope.supplier.name;
      param_data.supplierNameOl = $scope.supplier.nameAr ? $scope.supplier.nameAr : $scope.supplier.name;
      param_data.supplierAddress = $scope.supplier.address;
      param_data.supplierMobileNo = $scope.supplier.mobile;
      param_data.supplierEmail = $scope.supplier.email;
      param_data.commission = $scope.supplier.commission ? $scope.supplier.commission : 0;
      param_data.latitude = $scope.supplier.latitude;
      param_data.longitude = $scope.supplier.longitude;
      param_data.is_multibranch = $scope.supplier.is_multibranch;
      param_data.pickupCommision = $scope.supplier.pickupCommision ? $scope.supplier.pickupCommision : 0;
      param_data.license_number = $scope.supplier.license_number;
      param_data.supplierNameOl = $scope.supplier.nameAr ? $scope.supplier.nameAr : $scope.supplier.name;

      if ($rootScope.is_supplier_slogan_add_edit == 1) {
        param_data.slogan_en = $scope.supplier.slogan_en;
        param_data.slogan_ol = $scope.supplier.slogan_ol;
      }

      param_data.supplier_tags = $scope.selectedTagList;

      if ($rootScope.supplier_country_of_origin == 1) {
        param_data.country_of_origin = $scope.supplier.country_of_origin;
      }
      if ($scope.supplier.gst_price) param_data.gst_price = $scope.supplier.gst_price;
      if ($scope.selectedTabs.length) param_data.productCustomTabDescriptionLabelSelected = $scope.selectedTabs;

      if ($scope.isProductCustomTabDescEnable == 1) {
        $scope.productCustomTabLabel.forEach(col => {
          if (col.addByAdmin) {
            param_data[col.labelDBColName] = $scope.supplier[col.labelDBColName]
          }
        });
      }

      let phone_data = $scope.iti.getSelectedCountryData();
      if (!!phone_data) {
        param_data['iso'] = phone_data['iso2'];
        param_data['country_code'] = phone_data['dialCode'];
      }

      if ($rootScope.is_pickup == 2) {
        param_data.self_pickup = parseInt($scope.supplier.self_pickup);
      } else {
        param_data.self_pickup = $rootScope.is_pickup;
      }

      if ($rootScope.enable_in_out_network == 1) {
        param_data['is_out_network'] = $scope.supplier.is_out_network;
      }

      services.POST_DATA(param_data, API.REGISTER_SUPPLIER, function (response) {
        $scope.message = `${factories.localisation().supplier} Successfully Registered`;
        services.SUCCESS_MODAL(true);
        $scope.getRegSuppliers(1);
        $scope.is_blocked = false;
        $scope.is_add = false;
      });
    }

    $scope.activateRegSupplier = function (Id, status) {
      if (typeof Id == "number") {
        Id = Id.toString();
      }
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.supplierId = Id;
      param_data.authSectionId = 22;
      param_data.status = +status;

      services.POST_DATA(param_data, API.CHANGE_SUPPLIER_STATUS, function (response) {
        $scope.skip = 0;
        $scope.getRegSuppliers(1);
        $scope.message = `${factories.localisation().supplier} status has been updated`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.updateSupplierStatus = function (status, type) {

      var param_data = {};
      if (type == 1) {
        param_data.status = +status;
      } else {
        param_data.is_block = +(!status);
      }

      services.PUT_DATA(param_data, type == 1 ? API.SUPPLIER_SCHEDULE_UPDATE : API.SUPPLIER_BLOCK_UPDATE, function (response) {
        if (type == 1) {
          $scope.is_suppliers_schedule = status;
        } else {
          $scope.skip = 0;
          $scope.getRegSuppliers(1);
        }
        $scope.message = `${factories.localisation().suppliers} status have been updated`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      $scope.getRegSuppliers(page);
    }

    $scope.sortBy = function (col) {
      $scope.skip = 0;
      if ($scope.order_by == col) {
        $scope.is_desc = +(!$scope.is_desc);
      } else {
        $scope.is_desc = 1;
      }
      $scope.order_by = col;
      $scope.getRegSuppliers(1);
    }

    $scope.searchSupplier = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.skip = 0;
        $scope.getRegSuppliers(1);
      }
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
          $scope.categoryData = [{ arr: $scope.categories, mark_all: false }];
        }
      });
    };

    $scope.viewSubCat = function (parentIndex, category) {
      $scope.categoryData.splice(parentIndex + 1, $scope.categoryData.length);
      if (category.sub_category && (category.sub_category).length) {
        $scope.categoryData.push({ arr: category.sub_category, mark_all: false, category: category });
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
      if (cat.sub_category && (cat.sub_category).length && cat.id == selectedCat.id) {
        (cat.sub_category).map((col) => {
          if (col.checked) {
            selectedCat.data.push({ id: col.id, data: [] });
            (selectedCat.data).forEach(el => {
              makeDataArr(col, el);
            });
          }
        });
      }
    }

    var getMarkedCategories = function () {
      $scope.selectedCategories = [];
      $scope.categories.map((cat) => {
        if (cat.checked) {
          $scope.selectedCategories.push({ id: cat.id, data: [] });
          $scope.selectedCategories.forEach(el => {
            makeDataArr(cat, el);
          });
        }
      });


      let selectedCategories = [...$scope.selectedCategories];
      let arrayWithSubcat = [], arrayWithoutSubcat = [];
      selectedCategories.forEach(col => {
        if (col.data.length) {
          arrayWithSubcat.push(col);
        } else {
          arrayWithoutSubcat.push(col);
        }
      });

      $scope.selectedCategories = [...arrayWithSubcat, ...arrayWithoutSubcat];

      console.log('$scope.selectedCategories', $scope.selectedCategories);

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

    // $scope.deleteSupplier = function (Id) {
    //   services.deletePop($scope.dumped_suppliers, Id, function (data) {
    //     var param_data = {};
    //     param_data.id = Id;
    //     param_data.section_id = 22;
    //     services.deleteDumpSupplier($scope, param_data, function (data) {
    //       factories.spliceOnDelete($scope.dumped_suppliers, Id);
    //       swal("Deleted!", "", "success");
    //     });
    //   });
    // };




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

    getSupplierTags();

    $scope.selectTag = function (tag) {
      tag.checked = !tag.checked;
      var findTag = $scope.supplierTagsList.find(x => x.id == tag.id);
      $scope.supplierTagsList.forEach(element => {
        if (element.id == findTag.id) {
          element['checked'] = tag.checked;
          if (tag.checked) {
            $scope.selectedTagList.push(findTag.id);
          }
          else {
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
      }
      else {
        $scope.supplierTagsList.forEach(element => {
          element['checked'] = false;
        });
        $scope.selectedTagList = [];
        $scope.mark_all_tags = false;
      }
    }


    $scope.changeNetworkType = function (is_out_network) {
      if (is_out_network == 1) {
        $scope.supplier.self_pickup = 0;
        $scope.disable_delivery_mode = true;
        $scope.supplier.pickupCommision = 0;
        $scope.supplier.is_out_network = 1;
        $scope.selectedCategories = [];
        $scope.selectedTagList = [];
      }
      else {
        $scope.disable_delivery_mode = false;
        $scope.supplier.is_out_network = 0;
      }
    }


    $scope.check = function (user) {
      if ($scope.selected_users.includes(user.id)) {
        $scope.selected_users.splice($scope.selected_users.indexOf(user.id), 1);
        $scope.selected_emails.splice($scope.selected_emails.indexOf(user.supplier_email), 1);
      } else {
        $scope.selected_users.push(user.id);
        $scope.selected_emails.push(user.supplier_email);
      }
    }

    $scope.checkAll = function () {
      $scope.checkall = !$scope.checkall;
      $scope.selected_users = [];
      $scope.selected_emails = [];
      if ($scope.checkall) {
        $scope.suppliers.forEach(user => {
          $scope.selected_users.push(user.id);
          $scope.selected_emails.push(user.supplier_email);
        });
      }
    }

    $scope.changeMsgType = function (msgType) {
      $scope.message_type = msgType;
    }

    $scope.sendNotificationOrEmail = function () {
      if ($scope.selected_users.length == 0) {
        factories.invalidDataPop("Please select users");
        return;
      } else if ($scope.message_type == 1 && $scope.notification.msg == '') {
        factories.invalidDataPop(`Please enter the notification message`);
        return;
      } else if ($scope.message_type == 2 && $scope.email.subject == '') {
        factories.invalidDataPop("Please enter the subject");
        return;
      } else if ($scope.message_type == 2 && $scope.email.body == '') {
        factories.invalidDataPop("Please enter the email body");
        return;
      }

      let userTypeArr = ($scope.selected_users.slice()).fill(1);

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 52;
      param_data.ids = $scope.selected_users.join('#');

      if ($scope.message_type == 1) {
        param_data.content = $scope.notification.msg;
        param_data.userType = userTypeArr.join('#');
        services.POST_DATA(param_data, API.SEND_PUSH, function (response) {
          $scope.message = 'Notification has been sent successfully';
          services.SUCCESS_MODAL(true);
        });
      } else {
        param_data.content = $scope.email.body;
        param_data.receiverType = userTypeArr.join('#');
        param_data.receiverEmail = $scope.selected_emails.join('#');
        param_data.subject = $scope.email.subject;
        services.POST_DATA(param_data, API.SEND_EMAIL, function (response) {
          $scope.message = 'Email has been sent successfully';
          services.SUCCESS_MODAL(true);
        });
      }
    }

    $scope.notificationOpen = function () {
      $scope.notification_open = !$scope.notification_open;
    }


    $scope.downloadSampleFile = () => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = $scope.settings.key_value.supplier_csv_file;
      a.setAttribute('style', 'display: none');
      a.download = 'Supplier-Csv';
      a.click();
      document.body.removeChild(a);
    }

    $scope.removeCsv = () => {
      $scope.selectedCsv = null;
      $scope.isCsv = false;
      var upload = document.getElementById('upload');
      upload.value = null;
    }

    $scope.uploadCsv = () => {
      if (!$scope.isCsv) { return; }
      var param_data = {
        "file": $scope.selectedCsv,
        "sectionId": 22,
      }

      services.POST_FORM_DATA(param_data, API.SUPPLIER_IMPORT, function (response) {
        var csvCloseBtn = document.getElementById('close-csv-btn');
        csvCloseBtn.click();
        $scope.message = `File Successfully Uploaded`;
        services.SUCCESS_MODAL(true);
        $scope.refresh();
      })
    }


    var upload = document.getElementById('upload');
    function onFile() {
      file = upload.files[0];
      $scope.selectedCsv = file;
      $scope.$apply(function () {
        $scope.selectedCsv = file;
        $scope.isCsv = true;
      });
      name = file.name.replace(/.[^/.]+$/, '');
    }

    upload.addEventListener('dragenter', function (e) {
      upload.parentNode.className = 'area dragging';
    }, false);

    upload.addEventListener('dragleave', function (e) {
      upload.parentNode.className = 'area';
    }, false);

    upload.addEventListener('drop', function (e) {
      onFile();
    }, false);

    upload.addEventListener('change', function (e) {
      onFile();
    }, false);




    $scope.getRegSuppliersForIndexing = function (page) {
      $scope.dataLoaded = false;
      let params = {
        limit: 20,
        offset: $scope.skip,
        order_by: $scope.order_by,
        is_desc: $scope.is_desc,
        is_active: $scope.is_active,
        sequence_wise: 1
      }
      if ($scope.isStripeConnected !== 0) {
        params.is_stripe_connected = $scope.isStripeConnected
      }
      params.search = ($scope.search).trim() ? $scope.search : '';

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }

      params.is_out_network = $scope.is_out_network;

      services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
        if (!!response && response.status === 4) {
          $scope.suppliersForIndexing = response.data.suppliersList;
          $scope.dataLoaded = true;
        }
      });
    };


    $scope.setSupplierOrder = function () {
      $("#orderCatModal").modal('show');
      $scope.getRegSuppliersForIndexing(1);
    }


    $scope.orderedSuppliers = [];
    $scope.SubmitSupplierSequence = function () {
      $scope.orderedSuppliers = []
      $scope.suppliersForIndexing.forEach(item => {
        $scope.orderedSuppliers.push(item)
      })
      let supplierOrder = []
      for (let i = 0; i <= $scope.orderedSuppliers.length - 1; i++) {
        var obj = { sequence_no: ($scope.orderedSuppliers.length - i), supplier_id: $scope.orderedSuppliers[i].id };

        supplierOrder.push(obj)
      }
      let param_data = {
        supplierSequence: supplierOrder
      }
      services.POST_DATA(param_data, API.UPDATE_SUPPLIER_SEQUENCE, function (response) {
        if (response) {
          document.getElementById('closeCatOrder').click()
          getCategories()
        }
      })

    }

    $scope.showIntroduction = function (data) {
      $scope.read_more_text = data;
      $scope.read_more_label = 'Introduction';
      $("#readMore").modal('show');
    }

    $scope.langData = function () {
      services.getLanguagesData($scope, function (lang_data) {
        let lang_id_data = [];
        let lang_name_data = [];
        for (var i = 0; i < lang_data.length; i++) {
          lang_id_data.push(lang_data[i].id);
          lang_name_data.push(lang_data[i].language_name);
        }
        $scope.lang_ids = lang_id_data.toString();
        $scope.language_name = lang_name_data.toString();
      });
    };

  }]);