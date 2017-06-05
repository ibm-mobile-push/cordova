/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

$(function() {
    checkDensity();
});

// Geofence Page

function setupLocationPage() {
    MCEGeofencePlugin.geofenceEnabled(function(status) {
        if (status)
            $('#geofences .status').html('ENABLED').addClass('enabled');
        else
            $('#geofences .status').html('DISABLED').addClass('disabled');
    });

    MCEGeofencePlugin.geofencesNear(function(geofences) {}, 10, 10, 1000);

    MCELocationPlugin.setLocationUpdatedCallback(function() {
        $(document).trigger('locationUpdate');
    });

    $(document).on('pageshow', '#geofences', function(e, data) {
        setTimeout(function() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15
            });

            var mappedCircles = {};

            function updateGeofences(geolocate) {
                var newGeofences = new Set();
                MCEGeofencePlugin.geofencesNear(function(geofences) {
                    geofences.forEach(function(geofence) {
                        var key = JSON.stringify(geofence);
                        newGeofences.add(key);
                        if (!mappedCircles[key]) {
                            mappedCircles[key] = new google.maps.Circle({
                                strokeColor: '#0000FF',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: '#0000FF',
                                fillOpacity: 0.35,
                                map: map,
                                center: new google.maps.LatLng(geofence.latitude, geofence.longitude),
                                radius: geofence.radius
                            });
                        }
                    });

                    var deleteMaps = [];
                    for (key in mappedCircles) {
                        if (!newGeofences.has(key)) {
                            mappedCircles[key].setMap(null);
                            deleteMaps.push(key);
                        }
                    }

                    deleteMaps.forEach(function(map) {
                        delete mappedCircles[map];
                    });

                }, geolocate.lat(), geolocate.lng(), 1000);
            }

            var lastLocation;

            $(document).on('locationUpdate', function() {
                updateGeofences(lastLocation);
            });

            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                lastLocation = geolocate;
                var currentLocation = new google.maps.Marker({
                    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    icon: 'images/blue.png',
                    map: map
                });

                updateGeofences(geolocate);
                map.setCenter(geolocate);

                var autoCenter = true;
                $('#gps_refresh').click(function() {
                    MCELocationPlugin.syncLocations();
                });

                $('#gps_button').css('opacity', 1).click(function() {
                    autoCenter = !autoCenter;
                    if (autoCenter) {
                        $('#gps_button').css('opacity', 1);
                        map.setCenter(lastLocation);
                    } else {
                        $('#gps_button').css('opacity', 0.5);
                    }
                });


                map.addListener('drag', function() {
                    autoCenter = false;
                    $('#gps_button').css('opacity', 0.5);
                });

                navigator.geolocation.watchPosition(function(position) {
                    var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    lastLocation = geolocate;
                    if (autoCenter) {
                        map.setCenter(geolocate);
                        map.setZoom(15);
                    }
                    currentLocation.setPosition(geolocate);

                    updateGeofences(geolocate);
                });
            });

        }, 250);
    });
}

document.addEventListener("backbutton", function() {
    if ($.mobile.activePage.is('#sample')) {
        navigator.app.exitApp();
    } else {
        navigator.app.backHistory()
    }
}, false);

function setupBeaconPage() {
    var lastRegions = [];
    var beaconStatus = {};

    $('#beacon_refresh').click(function() {
        MCELocationPlugin.syncLocations();
    });

    function updateBeaconRegions() {
        $('#beaconRegions').empty()
        lastRegions.forEach(function(region) {
            $('#beaconRegions').append($('<li>', { 'class': 'ui-li-static ui-body-inherit ui-grid-a' })
                .append($('<div>', { 'class': 'ui-block-a' }).html(region.major))
                .append($('<div>', { 'class': 'ui-block-b right' }).html(beaconStatus[region.major] ? beaconStatus[region.major] : ''))
            );
        });
    }

    MCEBeaconPlugin.beaconEnabled(function(status) {
        if (status)
            $('#beacons .status').html('ENABLED').addClass('enabled');
        else
            $('#beacons .status').html('DISABLED').addClass('disabled');
    });

    MCEBeaconPlugin.beaconUUID(function(uuid) {
        $('#uuid').html(uuid)
    });

    $(document).on('locationUpdate', function() {
        MCEBeaconPlugin.beaconRegions(function(regions) {
            lastRegions = regions;
            updateBeaconRegions();
        });
    });

    MCEBeaconPlugin.setBeaconEnterCallback(function(beacon) {
        beaconStatus[beacon.major] = 'Entered Minor ' + beacon.minor;
        updateBeaconRegions();
    });

    MCEBeaconPlugin.setBeaconExitCallback(function(beacon) {
        beaconStatus[beacon.major] = 'Exited Minor ' + beacon.minor;
        updateBeaconRegions();
    });

    MCEBeaconPlugin.beaconRegions(function(regions) {
        lastRegions = regions;
        updateBeaconRegions();
    });
}


document.addEventListener('deviceready', function() {
    setupLocationPage();
    FastClick.attach(document.body);
    setupInAppPage();
    setupDefaults();
    setupRegistrationPage();
    setupPushActionsPage();
    standardTypeSelection();
    setupEventPage();
    setupAttributesPage();
    setupPhoneHomePage();
    setupBeaconPage();

    if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
        setupCategoriesPage();
    } else {
        $('#categoryNavigation').hide()
        return;
    }
}, false);

function setupPhoneHomePage() {
    $('#phonehome_button').click(function() {
        MCEPlugin.phoneHome();
    });
}

function setupInAppPage() {
    $('#inAppBannerTop').click(function() {
        MCEInAppPlugin.executeInAppRule(['topBanner']);
    });

    $('#inAppBannerBottom').click(function() {
        MCEInAppPlugin.executeInAppRule(['bottomBanner']);
    });

    $('#inAppImage').click(function() {
        MCEInAppPlugin.executeInAppRule(['image']);
    });

    $('#inAppVideo').click(function() {
        MCEInAppPlugin.executeInAppRule(['video']);
    });

    $('#inAppNext').click(function() {
        MCEInAppPlugin.executeInAppRule(['all']);
    });
}

function checkDensity() {
    if (window.devicePixelRatio > 2) {
        $('div.header').css("background-image", "url(css/images/logo@3x.png)");
    } else if (window.devicePixelRatio > 1) {
        $('div.header').css("background-image", "url(css/images/logo@2x.png)");
    }
}

function setupCategoryCallback() {
    var categoryName = getValueForId('categoryName');
    var button1 = getValueForId('button1');
    var button2 = getValueForId('button2');

    MCEPlugin.setCategoryCallbacks(function(message) {
        if (message["identifier"]) {
            alert("Push message with category received, " + message['identifier'] + ' button selected');
        } else {
            alert("Push message with category received, no button selected");
        }
    }, categoryName, [{ "destructive": false, "authentication": true, "name": button1, "identifier": button1 }, { "destructive": true, "authentication": false, "name": button2, "identifier": button2 }]);
}

function setupCategoriesPage() {
    setupCategoryCallback();
}

function animateGreen(item) {
    setTimeout(function() {
        $(item).animate({ "background-color": "green", "border-color": "green" }, 500, "swing", function() {
            $(item).animate({ "background-color": "#4e6d8d", "border-color": "#4e6d8d" }, 500, "swing", function() {
                $(item).attr("style", "")
            });
        });
    });
}

function animateRed(item) {
    setTimeout(function() {
        $(item).animate({ "background-color": "red", "border-color": "red" }, 500, "swing", function() {
            $(item).animate({ "background-color": "#4e6d8d", "border-color": "#4e6d8d" }, 500, "swing", function() {
                $(item).attr("style", "")
            });
        });
    });
}

function setupAttributesPage() {
    var action = getValueForId('action');
    $('#' + action + "-action").prop("checked", true);

    updateActions();

    $('input[name=action]').change(function() {
        saveValueForId("action", $(this).attr('value'));
        updateActions();
    });

    $('#sendAttributes').click(function() {
        var action = getValueForId("action");
        var attribute = getValueForId("attribute");
        var value = getValueForId("value");
        var json = {};
        json[attribute] = value;

        if (action == 'update') {
            MCEPlugin.updateUserAttributes(json, function() {
                console.log("update attribute success");
                animateGreen($('#sendAttributes'));
            }, function(error) {
                console.log("attribute failure")
                animateRed($('#sendAttributes'));
            });
        } else if (action == 'set') {
            MCEPlugin.setUserAttributes(json, function() {
                console.log("set attribute success");
                animateGreen($('#sendAttributes'));
            }, function(error) {
                console.log("attribute failure")
                animateRed($('#sendAttributes'));
            });
        } else if (action == 'delete') {
            MCEPlugin.deleteUserAttributes([attribute], function() {
                console.log("delete attribute success");
                animateGreen($('#sendAttributes'));
            }, function(error) {
                console.log("attribute failure")
                animateRed($('#sendAttributes'));
            });
        } else {
            console.log("unknown action value")
        }
    });
}

function updateActions() {
    var action = getValueForId('action');
    if (action == 'set' || action == 'update')
        $('#valuerow').show();
    else
        $('#valuerow').hide();
}

function setupEventPage() {
    $('#send_click').click(function() {
        MCEPlugin.addEvent({ type: "simpleNotification", name: "appOpened", timestamp: new Date() }, function() {
            console.log("event success")
            animateGreen($('#send_click'));
        }, function() {
            console.log("event failure")
            animateRed($('#send_click'));
        });
    });

    MCEPlugin.setEventQueueCallbacks(function(events) {
        animateGreen($('#send_click_queue'));
        console.log("event queue success");
    }, function(events) {
        animateRed($('#send_click_queue'));
        console.log("event queue fail");
    });
    $('#send_click_queue').click(function() {
        MCEPlugin.queueAddEvent({ type: "simpleNotification", name: "appOpened", timestamp: new Date() });
    });
}

function getValueForId(id) {
    var value = window.localStorage.getItem(id);
    if (value == undefined || value.length == 0)
        value = $('#' + id).attr('default');
    //console.log('getValueForId(' + id + ") = " + value)
    return value;
}

function saveValueForId(id, value) {
    window.localStorage.setItem(id, value);
    //console.log('saveValueForId(' + id + ", " + value + ")")
}

function saveValueForElement(item) {
    var id = $(item).attr('id');
    var value = undefined;
    if (item.nodeName == "INPUT")
        value = $(item).val();
    else if (item.nodeName == "DIV")
        value = $(item).html();

    //console.log('saveValueForElement(' + item + ")")
    saveValueForId(id, value);
}

function restoreValueForElement(item) {
    if (item.nodeName == "INPUT")
        $(item).val(getValueForElement(item));
    else if (item.nodeName == "DIV")
        $(item).html(getValueForElement(item));

    //console.log('restoreValueForElement(' + item + ")")
}

function getValueForElement(item) {
    var id = $(item).attr('id');
    var value = getValueForId(id);

    //console.log('getValueForElement(' + item + ") id:" + id + " = " + value)
    return value;
}

function setupDefaults() {
    $('[default]').each(function() {
        restoreValueForElement(this);
    });

    $('input[type=text]').change(function() {
        saveValueForElement(this);
    });
}

function standardTypeSelection() {
    var standardTypes = ['dial', 'url', 'openApp']
    var setStandardType = function(buttonIndex) {
        var standardType = standardTypes[buttonIndex - 1];
        $('#standardType').html(standardType);
        saveValueForElement($('#standardType').get(0));
        displayStandardValue();
    }

    $('#standardTypeSelector').click(function() {
        window.plugins.actionsheet.show({
            'title': 'Select Standard Action',
            'buttonLabels': standardTypes,
            'androidEnableCancelButton': true,
            'winphoneEnableCancelButton': true,
            'addCancelButtonWithLabel': 'Cancel'
        }, setStandardType);
    });
}

function setupPushActionsPage() {
    MCEPlugin.setRegisteredActionCallback(function(action, payload) {
        if (navigator.userAgent.match(/Android/)) {
            window.open('mailto:' + action['value']['recipient'] + '?subject=' + encodeURIComponent(action['value']['subject']) + '&body=' + encodeURIComponent(action['value']['body']), '_system');
        } else {
            cordova.plugins.email.open({ to: [action['value']['recipient']], subject: action['value']['subject'], body: action['value']['body'] }, function() {});
        }
    }, "sendEmail");

    displayStandardValue();
    updateCustomTypeJSON();

    $('#standardUrlValue, #standardDialValue, #standardUrlName, #standardDialName, #standardOpenAppName').change(function() {
        updateStandardTypeJSON();
    });

    $('#customValue, #customType').change(function() {
        updateCustomTypeJSON()
    });
}

function getStandardValue() {
    var standardType = getValueForId("standardType");
    if (standardType == 'url') {
        return JSON.parse(getValueForId('standardUrlValue'));
    } else if (standardType == 'dial') {
        return JSON.parse(getValueForId('standardDialValue'));
    }
    return undefined;
}

function getStandardName() {
    var standardType = getValueForId("standardType");
    if (standardType == 'url') {
        return getValueForId("standardUrlName");
    } else if (standardType == 'dial') {
        return getValueForId('standardDialName');
    } else if (standardType == 'openApp') {
        return getValueForId('standardOpenAppName');
    }
    return undefined;
}

function updateStandardTypeJSON() {
    var standardType = getValueForId("standardType");
    var json = { "type": standardType }
    var value = getStandardValue();
    if (value != undefined) {
        json["value"] = value;
    }
    $('#standardJSON').html(JSON.stringify(json));
}

function updateCustomTypeJSON() {
    var standardType = getValueForId("customType");
    var value = JSON.parse(getValueForId("customValue"));
    var json = { "type": standardType, "value": value };
    $('#customJSON').html(JSON.stringify(json));
}

function displayStandardValue() {
    var standardType = getValueForId('standardType');

    if (standardType == 'url') {
        $('.standardUrlRow').show()
        $('.standardDialRow').hide()
        $('.standardOpenAppRow').hide()
    } else if (standardType == 'dial') {
        $('.standardDialRow').show()
        $('.standardUrlRow').hide()
        $('.standardOpenAppRow').hide()
    } else {
        $('.standardOpenAppRow').show()
        $('.standardDialRow').hide()
        $('.standardUrlRow').hide()
    }
    updateStandardTypeJSON();
}

function setupRegistrationPage() {
    MCEPlugin.setRegistrationCallback(function(details) {
        $('#userId').html(details['userId']);
        $('#channelId').html(details['channelId']);
    });

    MCEPlugin.getRegistrationDetails(function(details) {
        $('#userId').html(details['userId']);
        $('#channelId').html(details['channelId']);
    });

    MCEPlugin.getAppKey(function(appKey) {
        $('#appKey').html(appKey);
    });
}