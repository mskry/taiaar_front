/*** Royo ***/

Royo.filter('toTrusted', function ($sce) {
    return function (value) {
        return $sce.trustAsHtml(value);
    };
});

Royo.filter('limitHtml', function () {
    return function (text, limit) {

        var changedString = String(text).replace(/<[^>]+>/gm, '');
        var length = changedString.length;

        return length > limit ? changedString.substr(0, limit - 1) : changedString;
    }
});

Royo.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

Royo.filter('utcToLocal', function ($filter) {
    return function (utcDateString, format) {
        if (!utcDateString) {
            return;
        }

        // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
        if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
            utcDateString += 'Z';
        }

        return $filter('date')(utcDateString, format);
    };
});

Royo.filter('myDate', function ($filter) {
    var angularDateFilter = $filter('date');
    return function (theDate) {
        var newDate_param = theDate.split('T');
        var newDate_1 = newDate_param[0];
        var newDate_2 = newDate_param[1].split('.000Z')[0];
        var newDate = newDate_1 + " " + newDate_2;
        return angularDateFilter(newDate, 'dd MMMM yyyy HH:mm:ss');
    }
});

Royo.filter('prepTime', function () {
    return function (value) {
        let time = '';
        let hour = moment(value, 'HH:mm:ss').hour();
        let minute = moment(value, 'HH:mm:ss').minute();
        if (hour) {
            time = hour + (hour > 1 ? ' Hours' : ' Hour');
        }
        if (minute) {
            time += ' ' + minute + (minute > 1 ? ' Minutes' : ' Minute');
        }
        return time;
    }
});

Royo.filter('capitalLetters', function () {
    return function (value) {
        if (value) {
            let text = '';
            text = value.toUpperCase();
            return text;
        }
        return ''
    }
});

// Royo.directive('capitalLetters', function ($parse) {
//     return {
//         require: 'ngModel',
//         link: function (scope, element, attrs, modelCtrl) {
//             var capitalize = function (inputValue) {
//                 if (inputValue === undefined) {
//                     inputValue = '';
//                 }
//                 var capitalized = inputValue.toUpperCase();
//                 if (capitalized !== inputValue) {
//                     modelCtrl.$setViewValue(capitalized);
//                     modelCtrl.$render();
//                 }
//                 return capitalized;
//             }
//             modelCtrl.$parsers.push(capitalize);
//             capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
//         }
//     };
// });


Royo.filter('status', function () {
    return function (selected_status, is_original = false, type = -1, flow_terminology = null, is_dine_in = 0) {

        let settings = JSON.parse(localStorage.getItem('settings_data'));
        if (settings) {
            const app_type = type > -1 && settings.screenFlow[0].app_type > 10 ? type : settings.screenFlow[0].app_type;
            let status_terminologies = {};
            let terminologies = !!flow_terminology && type > -1 && settings.screenFlow[0].app_type > 10 ? JSON.parse(flow_terminology) : ((settings.key_value).terminology ? JSON.parse((settings.key_value).terminology) : null);

            if (!!terminologies) {
                if (localStorage.getItem('lang') === 'en') {
                    status_terminologies = terminologies.english.status;
                } else {
                    status_terminologies = terminologies.other.status;
                }
            }

            if (!!terminologies && !!status_terminologies[selected_status] && !is_original) {
                return status_terminologies[selected_status];
            } else {

                /****************
                 *Outer Switch status
                 *Inner Switch app_type
                 Food => 1
                 Ecommerce => 2
                 Grocery => 3
                 Books => 4
                 Car Rental => 5
                 Product Rental => 6
                 Space Rental => 7
                 Home Service => 8
                 Laundary => 9
                 Beauty => 10
                *****************/
                let status = '';
                switch (selected_status) {
                    case -1:
                        status = 'Unapproved';
                        break;
                    case 0:
                        status = 'Pending';
                        break;
                    case 1:
                        status = 'Confirmed';
                        break;
                    case 2:
                        status = 'Rejected';
                        break;
                    case 3:
                        switch (app_type) {
                            case 1: case 3: case 4:
                                status = 'On The Way';
                                break;
                            case 8:
                                status = 'Started';
                                break;
                            case 2:
                                status = 'Out For Delivery';
                                break;
                            default:
                                status = 'On The Way';
                                break;

                        }
                        break;
                    case 4:
                        switch (app_type) {
                            case 1:
                                status = 'Arrived';
                                break;
                            default:
                                status = 'Near You';
                                break;
                        }
                        break;
                    case 5:
                        switch (app_type) {
                            case 8:
                                status = 'Ended';
                                break;
                            case 1: case 2:
                                status = is_dine_in == 1 ? 'Served' : 'Delivered';
                                break;
                            default:
                                status = 'Completed';
                                break;
                        }
                        break;
                    case 6:
                        status = 'Rating Given';
                        break;
                    case 7:
                        status = 'Track';
                        break;
                    case 8:
                        status = 'Customer Cancelled';
                        break;
                    case 9:
                        status = 'Scheduled';
                        break;
                    case 10:
                        switch (app_type) {
                            case 1:
                                status = is_dine_in == 1 ? 'Ready To Serve' : 'Ready To Be Picked';
                                break;
                            case 8:
                                status = 'Reached';
                                break;
                            default:
                                status = 'Shipped';
                                break;
                        }
                        break;
                    case 11:
                        switch (app_type) {
                            case 2: case 4: case 3:
                                status = 'Packed';
                                break;
                            case 1:
                                status = 'In Kitchen';
                                break;
                            case 8:
                                status = 'On The Way';
                                break;
                            default:
                                status = 'Packed';
                                break;
                        }
                        break;
                }
                return status;
            }
        }
    }
});

Royo.filter('return_status', function () {
    return function (selected_status, is_original = false) {

        let settings = JSON.parse(localStorage.getItem('settings_data'));
        if (settings) {

            let terminologies = JSON.parse((settings.key_value).terminology);
            let status_terminologies = {};
            if (!!terminologies) {
                if (localStorage.getItem('lang') === 'en') {
                    status_terminologies = terminologies.english.return_status;
                } else {
                    status_terminologies = terminologies.other.return_status;
                }
            }

            if (!!terminologies && !!status_terminologies && !!status_terminologies[selected_status] && !is_original) {
                return status_terminologies[selected_status];
            } else {

                let status = '';
                switch (selected_status) {
                    case 0:
                        status = 'RETURN REQUESTED';
                        break;
                    case 1:
                        status = 'AGENT ON THE WAY';
                        break;
                    case 2:
                        status = 'PRODUCT PICKED';
                        break;
                    case 3:
                        status = 'RETURNED';
                        break;
                }
                return status;
            }
        }
    }
});

Royo.filter('time', function () {
    return function (value, args) {
        const format = 'HH:mm:ss';
        if (!args) {
            return moment(value).format(format);
        }

        switch (args) {
            case 'ago':
                return moment(value).fromNow(true);

            case 'merged':
                const now = new Date();
                const momentValue = moment(value);
                if (momentValue.isBefore(now, 'd')) {
                    if (momentValue.isBefore(now, 'y')) {
                        return moment(value).format('DD-MM-YYYY');
                    } else {
                        return moment(value).format('MMM DD');
                    }
                } else {
                    return moment(value).format('HH:mm');
                }
        }

        return moment(value).format(args);
    }
})
