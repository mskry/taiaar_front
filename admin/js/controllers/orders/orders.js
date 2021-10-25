Royo.controller('OrderManagerCtrl', ['$scope', '$location', 'services', 'factories', '$stateParams', 'pagerService', '$rootScope', 'API', 'constants', '$translate', '$state', '$interval',
  function ($scope, $location, services, factories, $stateParams, pagerService, $rootScope, API, constants, $translate, $state, $interval) {

    $scope.tabStatus = 0;
    $scope.orderStatus = 0;
    $scope.is_grid = true;
    $scope.skip = 0;
    $scope.limit = 10;
    $scope.currentPage = 1;
    $scope.payment_method = 2;
    $scope.orders = [];
    $scope.dataLoaded = false;
    $scope.order_status = '';
    $scope.msg_description = '';
    $scope.selected_status = 1;
    $scope.settings = factories.getSettings();
    $scope.search = '';
    $scope.agents = [];
    $scope.selected_agent = [];
    $scope.start_date = '';
    $scope.end_date = '';
    $scope.selectedProducts = [];
    $scope.selected_order = {};
    $scope.prep_time = '00:00:00';
    $scope.zelle_order = null;
    $scope.orderRequests = [];
    $scope.prescription_image = '';
    $scope.rejection_reason = '';
    $scope.profile = $rootScope.profile
    $scope.is_head_branch = $rootScope.is_head_branch;
    $scope.startTime = '';
    $scope.filter_by = 0;
    $scope.hideAgentSelection = false

    if (factories.getSettings().key_value.is_default_order_list && factories.getSettings().key_value.is_default_order_list == 1) {
      $scope.is_grid = false;
    }

    if ($rootScope.profile == 'SHIPPING') {
      $scope.delivery_company_id = localStorage.getItem('delivery_company_id');
    }

    $scope.orderRequestStatus = ['Pending', 'Approved', 'Rejected By Admin', 'Cancelled By User'];

    $scope.vehicleCatList = [];
    $scope.selected_order_for_assign = {};
    $scope.selected_agent_vehicle_cat = "";


    $scope.changeTab = function (tab) {
      // if ($stateParams.status) {
      //   $location.search({});
      // }

      $state.go('.', {
        status: tab
      }, {
        notify: true
      });

      // $scope.tabStatus = tab;
      // $scope.skip = 0;
      // $scope.orderStatus = 0;
      // $scope.payment_method = 2;

      // console.log($scope.tabStatus)
      // if (tab == 3) {
      //   $scope.getOrderRequests(1);
      // } else if (tab == 4) {
      //   $scope.returnRequests(1);
      // } else if (tab == 5) {
      //   $scope.tableBookings(1);
      // } else {
      //   $scope.getOrderData(1);
      // }

      $scope.filter_by = 0;
    }


    $scope.changeOrderStatus = function (status) {
      $scope.orderStatus = status;
      $scope.getOrderData(1);
    }

    $scope.changeView = function (value) {
      $scope.is_grid = value;
    }

    $scope.filterRatingWise = function (filter_by) {
      if (filter_by == 1) {
        $scope.filter_by = 2;
      } else {
        $scope.filter_by = filter_by;
      }
      $scope.getOrderData(1);
    }
    $scope.filterByAssign = function (filter_by) {
      if (filter_by == 1) {
        $scope.filter_by = 1;
      } else if (filter_by == 3) {
        $scope.filter_by = 3;
      } else {
        $scope.filter_by = filter_by;
      }
      $scope.getOrderData(1);
    }

    $scope.getOrderData = function (page) {
      $scope.orders = [];
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 36;
      param_data.limit = $scope.limit;
      param_data.serachText = $scope.search;
      param_data.serachType = $scope.search ? 1 : 0;
      param_data.offset = $scope.skip;
      param_data.tab_status = $scope.tabStatus;
      if ($scope.tabStatus != 0 && $scope.orderStatus) {
        param_data.sub_status = $scope.orderStatus;
      }
      param_data.payment_type = $scope.payment_method;
      param_data.start_date = $scope.start_date;
      param_data.end_date = $scope.end_date;

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }

      if ($scope.agent_id_for_orders && $stateParams.agent_id) {
        param_data.agent_id = (Number)($scope.agent_id_for_orders);
      }

      if ($rootScope.profile == 'SHIPPING') {
        param_data.delivery_company_id = $scope.delivery_company_id
      }

      $scope.dataLoaded = false;

      if ($scope.filter_by) {
        param_data.filter_by = $scope.filter_by;
      }

      services.POST_DATA(param_data, API.GET_ORDER_LIST(), function (response) {
        $scope.count = response.data.total_order;
        $scope.orders = response.data.orders ? response.data.orders : [];
        if (factories.getSettings().key_value.is_table_booking == 1) {
          $scope.orders.forEach(order => {
            if (order.is_dine_in) {
              order['dine_in_deliver_disable'] = moment().format('YYYY-MM-DD HH:mm:ss') < moment.utc(order.schedule_date).format('YYYY-MM-DD HH:mm:ss');
            }
          });
        }
        $scope.dataLoaded = true;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
      });
    };
    // $scope.getOrderData(1);

    $scope.$on('order_page_refresh', refreshOrders);

    function refreshOrders($event, data) {
      if (data) {
        $scope.tabStatus = 0;
        $scope.orderStatus = 0;
        $scope.skip = 0;
        $scope.currentPage = 1;
        $scope.getOrderData(1);
      }
    }

    var afterStatusUpdate = function () {
      $scope.getOrderData();
      $scope.msg_description = 'Order Status updated successfully';
      services.SUCCESS_MODAL(true);
    }

    $scope.updateOrderStatus = function (val, orderId, self_pickup) {

      if (self_pickup == 1 && val == 3 || val == 4) {
        return;
      }

      let offset = moment().format('Z');
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 36;
      param_data.orderId = orderId;
      param_data.status = val;
      param_data.offset = offset;

      switch (parseInt(val)) {
        case 3:
          services.POST_DATA(param_data, API.SHIPPED_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;
        case 10:
          services.POST_DATA(param_data, API.NEARBY_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;
        case 5:
          services.POST_DATA(param_data, API.DELIVERED_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;
        case 11:
          services.POST_DATA(param_data, API.IN_PROGRESS_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;
      }
    };

    $scope.orderConfirmation = function (status, order, add_prep_time) {
      if ($rootScope.enable_vendor_order_creation == 1 && !$scope.selected_agent_vehicle_cat) {
        $scope.hideAgentSelection = true
        $("#prep_time").modal('hide');
        if(status == 1) {
        getVehicleCatList()
          $("#agent_request_order_confirm").modal('show');
        return

        }
      }
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 36;
      param_data.orderId = order.id;
      param_data.status = status;
      param_data.offset = moment().format('Z');
      param_data.reason = "";
      if (status == 2) {
        param_data.reject_reasons = $scope.rejection_reason;
      }
      if ($rootScope.enable_vendor_order_creation == 1 && $scope.selected_agent_vehicle_cat) {
        param_data.vehicle_id = $scope.selected_agent_vehicle_cat
      }

      

      if (($rootScope.app_type == 1 || order.type == 1) && status == 1) {
        param_data.preparation_time = add_prep_time == 1 ? moment($scope.prep_time, 'HH:mm').format('HH:mm:ss') : order.preparation_time;
      }
      services.POST_DATA(param_data, API.CONFIRM_REJECT_ORDER(), function (response) {
        $("#prep_time").modal('hide');
        $("#agent_request_order_confirm").modal('hide');
        let order_index = $scope.orders.findIndex(el => el.id == order.id);
        $scope.orders.splice(order_index, 1);
        $scope.selected_agent_vehicle_cat = ''
        $scope.msg_description = `Order ${status == 1 ? 'Confirmed' : 'Rejected'}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.ConfirmUpdate = function (status, order) {
      if (order.payment_source === 'zelle' || order.payment_source === 'PipolPay') {
        if (order.is_payment_confirmed === 0) {
          factories.invalidDataPop('Payment has not been confirmed for this order!');
          return false;
        }
      }
      if (status == 1 && ($rootScope.app_type == 1 || order.type == 1)) {
        $scope.prep_time = order.preparation_time;
        $scope.selected_order = order;
        $("#prep_time").modal('show');
      } else if (status == 2) {
        $scope.rejection_reason = '';
        if ($rootScope.enable_same_reject_order_message == 1) {
          $scope.rejection_reason = $rootScope.same_reject_order_message;
        }
        $("#order_rejection").modal('show');
        $scope.selected_order = order;
      } else {
        $scope.orderConfirmation(status, order, 0);
      }
    };

    $scope.setPage = function (page) {
      if ($scope.currentPage !== page) {
        $scope.currentPage = page;
        $scope.skip = $scope.limit * (page - 1);
        if ($scope.tabStatus == 3) {
          $scope.getOrderRequests(page);
        } else if ($scope.tabStatus == 4) {
          $scope.returnRequests(page);
        } else if ($scope.tabStatus == 5) {
          $scope.tableBookings(page);
        } else {
          $scope.getOrderData(page);
        }
      }
    }

    $scope.searchOrder = function (keyEvent, search) {
      $scope.search = search;
      if (keyEvent.which === 13) {
        $scope.skip = 0;
        $scope.getOrderData(1);
      }
    }

    $scope.openDriverAssign = function (order) {
      $scope.vehicleCatList = [];
      $scope.selected_order_for_assign = {};
      $scope.selected_agent_vehicle_cat = "";
      $scope.selected_order_for_assign = order;
      if ($rootScope.is_vehicle_category_enable == '1') {
        getVehicleCatList();
      } else {
        $scope.listAgents($scope.selected_order_for_assign);
      }
    }

    var getVehicleCatList = function () {
      var data = {};
      $scope.dataLoaded = false;
      services.GET_DATA(data, API.LIST_VEHICLE_CATEGORY, function (response) {
        $scope.vehicleCatList = response.data;
        $scope.dataLoaded = true;
      });
    };

    $scope.listAgents = function (order) {
      $scope.selected_agent = [];
      var param_data = {};
      param_data.sectionId = 36;
      param_data.agent_category_id = $scope.selected_agent_vehicle_cat ? $scope.selected_agent_vehicle_cat : '';

      if ($rootScope.profile == 'SHIPPING') {
        param_data.delivery_company_id = $scope.delivery_company_id
      } else {
        param_data.supplierId = order.supplier_id ? order.supplier_id : 0;
      }

      services.GET_DATA(param_data, API.AGENT_ACC_TO_AREA(), function (response) {
        $scope.agents = response.data;
        $scope.selected_order = order;
        $scope.agents.forEach(el => {
          el['total_active_orders'] = ` | ${el.active_orders} ${$rootScope.localisation.dashboard_active_orders}`;
        });
        if (order.agent_id) {
          let agent = $scope.agents.find(el => el.id == order.agent_id);
          agent.ticked = true;
          $scope.selected_agent.push(agent);
        }
      });
    }

    $scope.onSelectAgentVehicle = function (vehicle) {
      if (!vehicle || vehicle == "") {
        return;
      }
      $scope.selected_agent_vehicle_cat = vehicle;
      if (!$scope.hideAgentSelection) {
        $scope.listAgents($scope.selected_order_for_assign);
      }
    }

    $scope.assignAgent = function () {
      var data = {};
      data.agentIds = [parseInt($scope.selected_agent[0].id)];
      data.orderId = $scope.selected_order.id;
      data.sectionId = 36;
      services.POST_DATA(data, API.ASSIGN_AGENT(), function (response) {
        $scope.getOrderData();
        $("#assign_agent_to_order").modal('hide');
        $scope.msg_description = `${(factories.localisation()).agent} ${$translate.instant('assigned successfully')}`;
        services.SUCCESS_MODAL(true);
      });
    }
    $scope.showTimer = function (orderCreated_on) {
      var createdOn = new Date(orderCreated_on);
      var now = new Date();
      var tzDifference = 11.00 * 60 + now.getTimezoneOffset();
      var offsetTime = new Date(now.getTime() + tzDifference * 60 * 1000);
      var timeDiff = Math.abs(offsetTime.getTime() - createdOn.getTime());
      // var minutes = Math.floor(timeDiff / 60000);
      // var seconds = ((timeDiff % 60000) / 1000).toFixed(0);

      var days = Math.floor(timeDiff / (24 * 3600000));
      var hours = Math.floor((timeDiff % (24 * 3600000)) / 3600000);
      var minutes = Math.floor(((timeDiff % (24 * 3600000)) % 3600000) / 60000);
      var seconds = ((((timeDiff % (24 * 3600000)) % 3600000) % 60000) / 1000).toFixed(0);

      let result = '';
      if (days > 0) {
        result = days + " Days ";
      }
      if (hours > 0 || days > 0) {
        result = result + hours + " Hrs. ";
      }
      result = result + minutes + " Mins. " + seconds + " Sec."

      return result;
    }
    $interval($scope.showTimer, 1000);

    $scope.totalDeliveyTime = function (order) {
      var createdOn = new Date(order.created_on);
      var deliverdOn = new Date(order.delivered_on);
      var timeDiff = Math.abs(deliverdOn.getTime() - createdOn.getTime());

      // var minutes = Math.floor(timeDiff / 60000);
      // var seconds = ((timeDiff % 60000) / 1000).toFixed(0);

      var days = Math.floor(timeDiff / (24 * 3600000));
      var hours = Math.floor((timeDiff % (24 * 3600000)) / 3600000);
      var minutes = Math.floor(((timeDiff % (24 * 3600000)) % 3600000) / 60000);
      var seconds = ((((timeDiff % (24 * 3600000)) % 3600000) % 60000) / 1000).toFixed(0);

      let result = '';
      if (days > 0) {
        result = days + " Days ";
      }
      if (hours > 0 || days > 0) {
        result = hours + " Hrs. ";
      }
      result = result + minutes + " Min. " + seconds + " seconds"

      return result;
    }
    $scope.changePaymentMethod = function (payment_method) {
      $scope.payment_method = payment_method;
      $scope.skip = 0;
      $scope.getOrderData(1);
    }

    $scope.selectProduct = function (order) {
      $scope.selectedProducts = order.product;
    }

    $scope.viewPaymentreceipt = function (order) {
      $scope.zelle_order = order;
      $("#zelle_confirmation").modal('show');
    }

    $scope.getOrderRequests = function (page) {
      $scope.dataLoaded = false;
      $scope.orderRequests = [];
      let param_data = {};
      param_data.sectionId = 36;
      param_data.limit = $scope.limit;
      param_data.offset = $scope.skip;
      services.GET_DATA(param_data, API.ORDER_REQUEST(), function (response) {
        $scope.orderRequests = response.data.data;
        $scope.count = response.data.totalCount;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });
    }

    $scope.openPrescription = function (prescription_image) {
      $scope.prescription_image = prescription_image;
      $("#order_prescription").modal('show');
    }

    $scope.rejectOrder = function (order) {
      $scope.rejection_reason = '';
      $("#order_rejection").modal('show');
      $scope.selected_order = order;
    }

    $scope.submitRejection = function () {
      var param_data = {
        sectionId: 36,
        id: $scope.selected_order.id,
        status: 0,
        reason: $scope.rejection_reason
      };
      services.PUT_DATA(param_data, API.OREDER_REQUEST_REJECT(), function (response) {
        $("#order_rejection").modal('hide');
        $scope.msg_description = `Request Rejected`;
        services.SUCCESS_MODAL(true);
        $scope.skip = 0;
        $scope.getOrderRequests(1);
      });
    }
    $scope.ConfirmPayment = function (status, order) {
      if (status == 1 && order.type == 1) {
        $scope.selected_order = order;
        $("#payment_confirmation").modal('hide');
      } else if (status == 0) {
        $("#payment_confirmation").modal('hide');
        $scope.selected_order = order;
      }
      $scope.updatePaymentStatus(status, order);
    };
    $scope.openDialogForConfirmation = function (order) {
      $scope.zelle_order = order;
      $("#payment_confirmation").modal('show');
    }
    $scope.updatePaymentStatus = function (status, order) {
      var param_data = {
        is_payment_confirmed: status,
        order_id: order.id
      };
      services.PUT_DATA(param_data, API.CONFIRM_PAYMENT_STATUS, function (response) {
        $scope.msg_description = `Payment has been confirmed for this order`;
        services.SUCCESS_MODAL(true);
        $scope.skip = 0;
        $scope.getOrderData(1);
      });
    }
    $scope.returnRequests = function (page) {
      $scope.dataLoaded = false;
      $scope.orderRequests = [];
      let param_data = {};
      param_data.sectionId = 36;
      param_data.limit = $scope.limit;
      param_data.offset = $scope.skip;
      services.GET_DATA(param_data, API.LIST_RETURN_REQUESTS(), function (response) {
        $scope.orderRequests = response.data.data;
        $scope.count = response.data.totalCount;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });
    }

    $scope.returnStatusUpdate = function (product) {
      let param_data = {
        sectionId: 36,
        id: product.id,
        status: product.status,
        orderId: product.order_id
      }
      services.PUT_DATA(param_data, API.UPDATE_RETURN_REQUEST_STATUS(), function (response) {
        $scope.msg_description = `Status updated successfully`;
        services.SUCCESS_MODAL(true);
        $scope.skip = 0;
        $scope.returnRequests(1);
      });
    }

    $scope.assignAgentForRetunOrder = function () {
      let param_data = {
        sectionId: 36,
        orderPriceId: $scope.selected_order.order_price_id,
        agentId: $scope.selected_agent[0].id
      }
      services.POST_DATA(param_data, API.AGENT_ASSIGNMENT_FOR_ORDER_RETURN(), function (response) {
        $("#assign_agent_to_order").modal('hide');
        $scope.skip = 0;
        $scope.returnRequests(1);
        $scope.msg_description = `${(factories.localisation()).agent} assigned successfully`;
        services.SUCCESS_MODAL(true);
      });
    }


    $scope.tableBookings = function (page) {
      $scope.dataLoaded = false;
      $scope.orders = [];
      let param_data = {};
      param_data.limit = $scope.limit;
      param_data.offset = $scope.skip;
      services.GET_DATA(param_data, API.GET_TABLE_BOOKINGS(), function (response) {
        $scope.orders = response.data.list;
        $scope.count = response.data.count;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });
    }

    $scope.tableBookingStatus = function (booking, status, text) {
      services.CONFIRM(`You want to ${text} this booking`,
        function (isConfirm) {
          if (isConfirm) {
            let param_data = {
              id: booking.id,
              status: status
            };
            if ($scope.rejection_reason) {
              param_data.reason = $scope.rejection_reason;
            }
            services.POST_DATA(param_data, API.UPDATE_TABLE_BOOKING_REQUEST(), function (response) {
              $scope.message = 'Booking status updated';
              services.SUCCESS_MODAL(true);
              $scope.tableBookings(1);
              $("#order_rejection").modal('hide');
            });
          }
        });
    }

    $scope.tables = [];
    $scope.selected_table = '';
    $scope.selected_table_booking = '';

    $scope.tableSelection = function (booking) {
      $scope.selected_table = '';
      $scope.tables = [];
      $scope.selected_table_booking = booking;
      let param_data = {
        limit: 200,
        offset: 0,
        supplier_id: booking.supplier_id,
        branch_id: booking.branch_id || booking.supplier_branch_id
      }
      services.GET_DATA(param_data, API.LIST_SUPPLIER_TABLE(), function (response) {
        if (response) {
          $scope.tables = response.data.list;
          $("#updateTable").modal('show');
        }
      });
    }

    $scope.selectTable = function (table) {
      $scope.selected_table = table;
    }

    $scope.updateTable = function () {
      let params = {
        id: $scope.selected_table_booking.id,
        table_id: $scope.selected_table
      }

      if ($rootScope.table_book_mac_theme && $scope.selected_table_booking.is_dine_in) {
        params['order_id'] = $scope.selected_table_booking.id
      }

      services.POST_DATA(params, API.UPDATE_BOOKING_TABLE(), function (response) {
        $scope.message = 'Booking table updated';
        services.SUCCESS_MODAL(true);

        if ($rootScope.table_book_mac_theme && $scope.selected_table_booking.is_dine_in) {
          $scope.getOrderData($scope.currentPage);
        } else {
          $scope.tableBookings(1);
        }

        $("#updateTable").modal('hide');
      });
    }

    $scope.selected_table_booking = '';
    $scope.rejectBooking = function (booking) {
      $scope.selected_table_booking = booking;
      $("#order_rejection").modal('show');
    }

    $scope.orderCreation = function (order) {
      localStorage.setItem('prescription_request', JSON.stringify({
        pres_img: order.prescription_image,
        pres_desc: order.prescription
      }));
      $state.go('orders.ordersCreation', {
        sup_id: order.supplier_id,
        b_id: order.supplier_branch_id,
        user_id: order.user_id,
        id: order.id,
        lat: order.latitude,
        lng: order.longitude
      });
    }

    var datepicker = function () {
      setTimeout(() => {
        var picker = new Lightpick({
          field: document.getElementById("datepicker_order"),
          singleDate: false,
          footer: true,
          onSelect: function (start, end) {
            console.log(start, end)
            if (start && end) {
              $scope.start_date = start.format('YYYY-MM-DD');
              $scope.end_date = end.format('YYYY-MM-DD');
              $scope.skip = 0;
              $scope.getOrderData(1);
            } else if (!start && !end) {
              picker.hide();
              $scope.start_date = '';
              $scope.end_date = '';
              $scope.skip = 0;
              $scope.getOrderData(1);
            }
          }
        });
      }, 500);
    }

    if ($stateParams.status) {
      $scope.tabStatus = $stateParams.status ? parseInt($stateParams.status) : 0;
      $scope.orderStatus = $stateParams.order_status ? parseInt($stateParams.order_status) : 0;

      $scope.skip = 0;
      $scope.payment_method = 2;

      if ($stateParams.status == 3) {
        $scope.getOrderRequests(1);
      } else if ($stateParams.status == 4) {
        $scope.returnRequests(1);
      } else if ($stateParams.status == 5) {
        $scope.tableBookings(1);
      } else {
        $scope.getOrderData(1);
        datepicker();
      }
    } else {
      $scope.getOrderData(1);
    }

    $scope.viewRejectionReason = function (order) {
      $scope.rejection_reason = order.approve_rejection_reason;
    }

  }
]);