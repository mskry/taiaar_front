Royo.controller('OrderChatCtrl', ['$scope', 'services', '$stateParams', 'API', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, constants, $rootScope) {

        $scope.orderId = $stateParams.order_id;
        $scope.receiverId = $stateParams.id;
        $scope.createdId = $stateParams.created_id;
        $scope.name = $stateParams.name;
        $scope.message_id = localStorage.getItem('profile_type') == 'ADMIN' ? $stateParams.message_id : localStorage.getItem('message_id');
        $scope.adminId = localStorage.getItem('profile_type') == 'ADMIN' ? localStorage.getItem('adminId') : localStorage.getItem('supplier_id');
        $scope.user_created_id = localStorage.getItem('user_created_id');
        $scope.receiver_type = parseInt($stateParams.type);

        var socket = io.connect(constants.BASEURL + `?id=${$scope.adminId}&userType=${localStorage.getItem('profile_type') == 'ADMIN' ? '4' : '3'}&secretdbkey=${localStorage.getItem('dbKey')}`);

        $scope.messages = [];
        $scope.msgText = '';
        $scope.chatPersons = [];
        $scope.isNothing = false;

        var scrollBottom = function () {
            setTimeout(() => {
                var objDiv = document.getElementById("chatBox");
                if (objDiv) {
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
            }, 200);
        }

        var joinRoom = function () {
       
            let payload = {
                message_id: $scope.message_id && $scope.message_id != 'null' ? $scope.message_id : '',
                username: localStorage.getItem('user_name')
            }
            console.log(payload)
            socket.emit('join_room', payload, (response) => { console.log(response)});
        }

        var fetchConversation = function () {
            const query = {
                limit: 200,
                skip: 0,
                userType: $rootScope.profile == 'ADMIN' ? '4' : '3',
                order_id: $scope.orderId ? $scope.orderId : '',
                receiver_created_id: $scope.createdId ? $scope.createdId : '',
                accessToken: localStorage.getItem('RoyoAccessToken'),
                message_id: $scope.message_id && $scope.message_id != 'null' ? $scope.message_id : ''
            }
            if (!$scope.createdId && !$scope.message_id && $scope.receiver_type != 4) {
                $scope.isNothing = true;
            }
            if (localStorage.getItem('profile_type') == 'ADMIN') {
                query.message_id = $scope.message_id ? $scope.message_id : '';
            }
            console.log(query)
            services.GET_DATA(query, API.GET_CHAT, function (response) {
                $scope.messages = response.data.reverse();
                // if (([2, 3].includes($scope.receiver_type) && localStorage.getItem('profile_type') == 'ADMIN') || ([4].includes($scope.receiver_type) && localStorage.getItem('profile_type') == 'SUPPLIER')) {
                    // if($scope.message_id) {
                        joinRoom();
                    // }
                // }
                scrollBottom();
            });
        }
        // fetchConversation();


        var geMessageId = function () {
            let params = {
                userType: localStorage.getItem('profile_type') == 'SUPPLIER' ? 'Supplier' : 'Admin',
                user_created_id: $scope.user_created_id
            }
            if (localStorage.getItem('profile_type') == 'ADMIN' || (localStorage.getItem('profile_type') == 'SUPPLIER' && $scope.receiver_type == 4)) {
                params['receiver_created_id'] = $scope.createdId
            }
            services.GET_DATA(params, API.GET_MESSAGE_ID, function (response) {
                if (response.data.message_id) {
                    $scope.message_id = response.data.message_id;
                }
                fetchConversation();
            });
        }

        //   if(localStorage.getItem('profile_type') == 'SUPPLIER' && $scope.receiver_type == 4) {
        geMessageId();
        //   } else {
        //     fetchConversation();
        //   }

        $scope.sendMessage = function (text, type, keyEvent) {
            if (!text || (!!keyEvent && keyEvent.which !== 13 && type == 1)) return;

            const msg = {
                text: text,
                chat_type: 'text',
                type: $scope.receiver_type,
                sent_at: new Date(),
                offset: '+05:30',
                receiver_created_id: $scope.createdId ? $scope.createdId : '',//$scope.receiver_type == 1 ? $scope.createdId : $scope.receiverId
                order_id: $scope.orderId,
                sender_created_id: $scope.user_created_id
            }
            if ($scope.message_id) {
                msg.message_id = $scope.message_id;
            } else {
                msg.message_id = $scope.receiver_type == 4 ? '' : 0;
            }
            if ($rootScope.profile === 'ADMIN') {
                msg.sender_type = 4;
            } 
            else {
                msg.sender_type = 3;
            }
            msg.type = 2

            const payload = new Object({
                detail: msg
            });
            console.log(payload)
            socket.emit('sendMessage', payload, (response) => {
                console.log(response)
                $scope.message_id = response.data.detail.message_id;
            });
            

            $scope.messages.push({
                c_id: 0,
                sent_at: msg.sent_at,
                send_by: $scope.user_created_id,
                send_to: $scope.createdId,
                chat_type: msg.chat_type,
                message_id: $scope.message_id ? $scope.message_id : '',
                order_id: $scope.orderId,
                text: msg.text
            });

            $scope.msgText = '';
            document.getElementById('msgInput').value = '';

            scrollBottom();
        }

        // var getSendMessage = function () {
        //     socket.on('sendMessage', (data) => {
        //         if (data.detail) {
        //             $scope.messages.push(data.detail);
        //             scrollBottom();
        //         }
        //     });
        // }
        // getSendMessage();

        var getMessage = function () {
            socket.on('receiveMessage', (data) => {
                $scope.$apply(function () {
                    console.log(data)
                    $scope.messages.push(data.detail);
                });
                scrollBottom();
            });
        }
        getMessage();

        $scope.$on('$destroy', function () {
            socket.on('disconnect', function () { });
            socket.close();
        });


        var getChatPersonList = function () {
            const query = {
                limit: 200,
                skip: 0,
                type: $scope.receiver_type,
                accessToken: localStorage.getItem('RoyoAccessToken')
            }
            services.GET_DATA(query, API.GET_CHAT_LIST(), function (response) {
                $scope.chatPersons = response.data.reverse();
            });
        }
        getChatPersonList();

    }]);
