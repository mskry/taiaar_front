Royo.controller('ZoneGeofenceCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.dataLoaded = false;
        $scope.zone_geofence = {
            id: 0,
            name: '',
            coordinates: []
        }

        $scope.is_updating = false;
        $scope.is_assiging = false;
        $scope.is_viewing = false;


        $scope.geofence_coordinates = [];
        $scope.geofence_areas = [];
        $scope.current_geofence_index = -1;




        $scope.zoneGeofenceList = [];
        $scope.mark_all_zones = false;
        $scope.selectedZoneList = [];



        var getZoneGeofence = function (page) {
            $stateParams
            var data = {
                limit: $scope.limit,
                skip: $scope.skip
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_LIST_ZONE_GEOFENCE, function (response) {
                $scope.geofence_areas = response.data.list;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };


        var getZoneGeofenceBy_Id = function (page) {
            var data = {
                // limit: $scope.limit,
                skip: $scope.skip,
                supplier_id: $stateParams.supplierId
            };
            $scope.is_assiging = true;
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_LIST_ZONE_GEOFENCE, function (response) {
                $scope.dataLoaded = true;
                if (response) {
                    $scope.zoneGeofenceList = response.data.list;
                    $scope.count = response.data.count;
                    $scope.zoneGeofenceList.forEach(element => {
                        if (element.is_assign) {
                            element['checked'] = true;
                            $scope.selectedZoneList.push(element.id);
                        }
                        else {
                            element['checked'] = false;
                        }
                    });
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        };

        $scope.selectZone = function (zone) {
            zone.checked = !zone.checked;
            var findZone = $scope.zoneGeofenceList.find(x => x.id == zone.id);
            $scope.zoneGeofenceList.forEach(element => {
                if (element.id == findZone.id) {
                    element['checked'] = zone.checked;
                    if (zone.checked) {
                        $scope.selectedZoneList.push(findZone.id);
                    }
                    else {
                        const index = $scope.selectedZoneList.indexOf(findZone.id);
                        if (index > -1) {
                            $scope.selectedZoneList.splice(index, 1);
                        }
                    }
                }
            });
        }

        $scope.markAllZone = function (index) {
            if (!$scope.mark_all_zones) {
                $scope.selectedZoneList = [];
                $scope.zoneGeofenceList.forEach(element => {
                    element['checked'] = true;
                    $scope.selectedZoneList.push(element.id);
                });
                $scope.mark_all_zones = true;
            }
            else {
                $scope.zoneGeofenceList.forEach(element => {
                    element['checked'] = false;
                });
                $scope.selectedZoneList = [];
                $scope.mark_all_zones = false;
            }
        }


        var getZones = function (page) {
            if ($stateParams.supplierId) {
                getZoneGeofenceBy_Id(page);
            }
            else {
                getZoneGeofence(page);
            }
        }
        getZones(1);


        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getZoneGeofence(page);
        }


        $scope.addZoneGeofence = function () {
            var addParams = $scope.zone_geofence;
            $scope.is_viewing = false;
            $scope.is_updating = false;

            if ($scope.is_updating) {
                addParams.id = $scope.zone_geofence.id;
                services.POST_DATA(addParams, API.UPDATE_ZONE_GEOFENCE, function (response) {
                    afterSaving();
                });
            }
            else {
                delete addParams['id'];
                services.POST_DATA(addParams, API.ADD_ZONE_GEOFENCE, function (response) {
                    afterSaving();
                });
            }
        }


        var afterSaving = function () {
            $scope.is_updating = false;
            $scope.is_viewing = false;
            $scope.dataLoaded = true;
            $("#geo").modal('hide');
            getZoneGeofence(1);
            $scope.message = `Zone has been added!`;
            services.SUCCESS_MODAL(true);
        }


        $scope.deleteZoneGeofence = function (zone) {
            var data = {
                id: zone.id
            }
            services.POST_DATA(data, API.DELETE_ZONE_GEOFENCE, function (response) {
                getZoneGeofence(1);
                $scope.dataLoaded = true;
                $scope.message = `Zone has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.updateZoneGeofence = function (index) {
            $scope.current_geofence_index = index;
            $scope.is_updating = true;
            $scope.is_viewing = false;

            var zone = $scope.geofence_areas[$scope.current_geofence_index];

            $scope.zone_geofence = {
                id: zone.id,
                name: zone.name,
            }

            $scope.initGeofence(index)

        }

        $scope.viewZoneGeofence = function (index) {
            $scope.current_geofence_index = index;
            $scope.is_viewing = true;

            var zone = $scope.geofence_areas[$scope.current_geofence_index];

            $scope.zone_geofence = {
                id: zone.id,
                name: zone.name,
            }

            $scope.initGeofence(index)

        }


        $scope.initGeofence = function (index = -1) {
            $("#geo").modal('show');
            $scope.current_geofence_index = index;
            var geofenceList = $scope.geofence_areas;
            if (index == -1) {
                $scope.current_geofence_index = 0;
                $scope.is_updating = false;
                $scope.zone_geofence.id = 0;
                $scope.zone_geofence.name = '';
                $scope.zone_geofence.coordinates = [];
                geofenceList = [];
                geofenceList.push($scope.zone_geofence);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
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

                    if (geofenceList.length && geofenceList[$scope.current_geofence_index].id) {
                        $scope.geofence_coordinates = geofenceList[$scope.current_geofence_index].coordinates;
                        let polygon_coordinates = $scope.geofence_coordinates.map(latlng => {
                            return {
                                lat: (latlng.x),
                                lng: (latlng.y)
                            }
                        });
                        polygon_coordinates.pop()
                        var myPolygon = new google.maps.Polygon({
                            paths: polygon_coordinates,
                            fillColor: $rootScope.primaryColor,
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        });
                        myPolygon.setMap(map);

                        google.maps.event.addListener(myPolygon, 'dragend', function () {
                            getPolygonPath(myPolygon);
                        });

                        google.maps.event.addListener(myPolygon.getPath(), 'insert_at', function () {
                            getPolygonPath(myPolygon);
                        });
                        google.maps.event.addListener(myPolygon.getPath(), 'set_at', function () {
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
                        if (geofenceList[$scope.current_geofence_index].id) {
                            myPolygon.setMap(null);
                        }
                    }

                    function setSelection(shape) {
                        clearSelection();
                        selectedShape = shape;
                        shape.setEditable(true);
                    }

                    var drawingManager = new google.maps.drawing.DrawingManager({
                        drawingMode: geofenceList[$scope.current_geofence_index].id ? null : google.maps.drawing.OverlayType.POLYGON,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                        },
                        polygonOptions: {
                            fillColor: $rootScope.primaryColor,
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

                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                        var newShape = event.overlay;
                        newShape.type = event.type;

                        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                            drawingManager.setDrawingMode(null);
                            getPolygonPath(newShape);

                            google.maps.event.addListener(newShape, 'dragend', function () {
                                setSelection(newShape);
                            });

                            setSelection(newShape);
                        }
                    });

                    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);


                });
            }
        }

        $scope.setGeofence = function (addForm) {
            if (addForm.$invalid) return;
            $scope.zone_geofence.coordinates = $scope.geofence_coordinates;
            $scope.addZoneGeofence();
            console.log($scope.geofence_areas)
        }



        $scope.assignZones = function () {
            var data = {
                supplier_id: $stateParams.supplierId,
                geofenceIds: $scope.selectedZoneList
            }
            services.POST_DATA(data, API.ASSIGN_UNASSIGN_ZONE_GEOFENCE, function (response) {
                getZoneGeofenceBy_Id(1);
                $scope.dataLoaded = true;
                $scope.message = `Zones has been assigned!`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.activeDeactiveZoneGeofence = function (zone) {
            var data = {
                id: zone.id,
                is_live: zone.is_live ? 0 : 1
            }
            services.POST_DATA(data, API.ACTIVE_DEACTIVE_ZONE_GEOFENCE, function (response) {
                getZoneGeofence(1);
                $scope.dataLoaded = true;
                $scope.message = `Zones has been ${zone.is_live ? 'Deactivated' : 'Activated'}!`;
                services.SUCCESS_MODAL(true);
            });
        }



    }]);
