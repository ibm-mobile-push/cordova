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

function updateLocationStatus() {
    MCEGeofencePlugin.geofenceEnabled(function(status) {
        console.log("Update Geofence Status");

        if (status) {
            MCELocationPlugin.locationAuthorization(function(status) {
                $('#geofences .status').removeClass('delayed').removeClass('disabled').removeClass('enabled')
                if (status == 0) {
                    $('#geofences .status').html('DELAYED (touch to enable)').addClass('delayed');
                } else if (status == -1) {
                    $('#geofences .status').html('DENIED').addClass('disabled');
                } else if (status == -2) {
                    $('#geofences .status').html('FOREGROUND (touch to enable)').addClass('delayed');
                } else if (status == 1) {
                    $('#geofences .status').html('ENABLED').addClass('enabled');
                }
            });
        } else
            $('#geofences .status').html('DISABLED').addClass('disabled');
    });
}

function setupLocationPage() {
    $('#geofences .status').click(function() {
        MCELocationPlugin.manualLocationInitialization();
    });

    MCELocationPlugin.setLocationAuthorizationCallback(function() {
        updateBeaconStatus();
        updateLocationStatus();
    });

    $('#geofences').on('pagebeforeshow', function() {
        updateLocationStatus();
    });

    updateLocationStatus();
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

function updateBeaconStatus() {
    MCEBeaconPlugin.beaconEnabled(function(status) {
        console.log("Update Beacon Status");
        if (status) {
            MCELocationPlugin.locationAuthorization(function(status) {
                $('#beacons .status').removeClass('delayed').removeClass('disabled').removeClass('enabled')
                if (status == 0) {
                    $('#beacons .status').html('DELAYED (touch to enable)').addClass('delayed');
                } else if (status == -1) {
                    $('#beacons .status').html('DENIED').addClass('disabled');
                } else if (status == -2) {
                    $('#beacons .status').html('FOREGROUND (touch to enable)').addClass('delayed');
                } else if (status == 1) {
                    $('#beacons .status').html('ENABLED').addClass('enabled');
                }
            });
        } else
            $('#beacons .status').html('DISABLED').addClass('disabled');
    });
}

function setupBeaconPage() {
    var lastRegions = [];
    var beaconStatus = {};

    $('#beacons').on('pagebeforeshow', function() {
        updateBeaconStatus();
    });

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

    $('#beacons .status').click(function() {
        MCELocationPlugin.manualLocationInitialization();
    });

    updateBeaconStatus();

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
    MCEPlugin.getPluginVersion(function(version) {
        $('#pluginVersion span').html(version);
    });
    MCEPlugin.getSdkVersion(function(version) {
        $('#sdkVersion span').html(version);
    });
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

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function setupInAppPage() {
    $('#cannedInAppBannerTop').click(function() {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        var triggerDate = new Date();
        triggerDate.setDate(triggerDate.getDate() - 1);

        MCEInAppPlugin.addInAppMessage({ "inAppMessageId": guid(), "rules": ["topBanner", "all"], "maxViews": 5, "template": "default", "content": { "orientation": "top", "action": { "type": "url", "value": "http://ibm.co" }, "text": "Canned Banner Template Text", "icon": "note", "color": "0077FF" }, "triggerDate": triggerDate.toISOString(), "expirationDate": expirationDate.toISOString() });
    });
    $('#cannedInAppBannerBottom').click(function() {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        var triggerDate = new Date();
        triggerDate.setDate(triggerDate.getDate() - 1);

        MCEInAppPlugin.addInAppMessage({ "inAppMessageId": guid(), "rules": ["bottomBanner", "all"], "maxViews": 5, "template": "default", "content": { "action": { "type": "url", "value": "http://ibm.co" }, "text": "Canned Banner Template Text", "icon": "note", "color": "0077FF" }, "triggerDate": triggerDate.toISOString(), "expirationDate": expirationDate.toISOString() });
    });
    $('#cannedInAppImage').click(function() {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        var triggerDate = new Date();
        triggerDate.setDate(triggerDate.getDate() - 1);

        MCEInAppPlugin.addInAppMessage({ "inAppMessageId": guid(), "rules": ["image", "all"], "maxViews": 5, "template": "image", "content": { "action": { "type": "url", "value": "http://ibm.co" }, "title": "Canned Image Template Title", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rhoncus, eros sed imperdiet finibus, purus nibh placerat leo, non fringilla massa tortor in tellus. Donec aliquet pharetra dui ac tincidunt. Ut eu mi at ligula varius suscipit. Vivamus quis quam nec urna sollicitudin egestas eu at elit. Nulla interdum non ligula in lobortis. Praesent lobortis justo at cursus molestie. Aliquam lectus velit, elementum non laoreet vitae, blandit tempus metus. Nam ultricies arcu vel lorem cursus aliquam. Nunc eget tincidunt ligula, quis suscipit libero. Integer velit nisi, lobortis at malesuada at, dictum vel nisi. Ut vulputate nunc mauris, nec porta nisi dignissim ac. Sed ut ante sapien. Quisque tempus felis id maximus congue. Aliquam quam eros, congue at augue et, varius scelerisque leo. Vivamus sed hendrerit erat. Mauris quis lacus sapien. Nullam elit quam, porttitor non nisl et, posuere volutpat enim. Praesent euismod at lorem et vulputate. Maecenas fermentum odio non arcu iaculis egestas. Praesent et augue quis neque elementum tincidunt. ", "image": "https://www.ibm.com/us-en/images/homepage/leadspace/01172016_ls_dynamic-pricing-announcement_bg_14018_2732x1300.jpg" }, "triggerDate": triggerDate.toISOString(), "expirationDate": expirationDate.toISOString() });
    });
    $('#cannedInAppVideo').click(function() {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        var triggerDate = new Date();
        triggerDate.setDate(triggerDate.getDate() - 1);

        MCEInAppPlugin.addInAppMessage({ "inAppMessageId": guid(), "rules": ["video", "all"], "maxViews": 5, "template": "video", "content": { "action": { "type": "url", "value": "http://ibm.co" }, "title": "Canned Video Template Title", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rhoncus, eros sed imperdiet finibus, purus nibh placerat leo, non fringilla massa tortor in tellus. Donec aliquet pharetra dui ac tincidunt. Ut eu mi at ligula varius suscipit. Vivamus quis quam nec urna sollicitudin egestas eu at elit. Nulla interdum non ligula in lobortis. Praesent lobortis justo at cursus molestie. Aliquam lectus velit, elementum non laoreet vitae, blandit tempus metus. Nam ultricies arcu vel lorem cursus aliquam. Nunc eget tincidunt ligula, quis suscipit libero. Integer velit nisi, lobortis at malesuada at, dictum vel nisi. Ut vulputate nunc mauris, nec porta nisi dignissim ac. Sed ut ante sapien. Quisque tempus felis id maximus congue. Aliquam quam eros, congue at augue et, varius scelerisque leo. Vivamus sed hendrerit erat. Mauris quis lacus sapien. Nullam elit quam, porttitor non nisl et, posuere volutpat enim. Praesent euismod at lorem et vulputate. Maecenas fermentum odio non arcu iaculis egestas. Praesent et augue quis neque elementum tincidunt. ", "video": "http://techslides.com/demos/sample-videos/small.mp4" }, "triggerDate": triggerDate.toISOString(), "expirationDate": expirationDate.toISOString() });
    });

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
    var valueType = getValueForId('value-type');
    $('#' + valueType + '-type').prop("checked", true);
    
    var action = getValueForId('action');
    $('#' + action + "-action").prop("checked", true);

    updateActions();

    $('input[name=action]').change(function() {
        saveValueForId("action", $(this).attr('value'));
        updateActions();
    });

    MCEPlugin.setAttributeQueueCallbacks(function(details) {
        console.log("attribute success");
        $('#sendAttributesStatus').css({"color":"green"}).html( JSON.stringify(details) );
        animateGreen($('#sendAttributes'));

    }, function(error) {
        console.log("attribute failure")
        $('#sendAttributesStatus').css({"color":"red"}).html( JSON.stringify(error) );
        animateRed($('#sendAttributes'));
    });
    
    updateValueType();
    $('[name=type]').change(function () {
        updateValueType();
    })
  
    $('#value').click(function () {
        clickValueField();
    }).keypress(function (event) {
        editValueField();
    });
    
    $('#sendAttributes').click(function() {
        var valueType = $('[name=type]:checked').val();
        if(valueType == "bool") {
            var value = $('[name=bool-value]:checked').val() == "true";
        } else {
            var value = $('#value').val();
            if(valueType == "number") {
                value = parseFloat(value);
                if(isNaN(value)) {
                    value = 0;
                }
            } else if(valueType == "date") {
                value = Date.parse(value);
                if(isNaN(value)) {
                    value = new Date();
                } else {
                    value = new Date(value);
                }
            }
        }
        var attribute = $('#attribute').val();

        var action = getValueForId("action");
        var json = {};
        json[attribute] = value;

        if (action == 'update') {
            MCEPlugin.queueUpdateUserAttributes(json);
            $('#sendAttributesStatus').css({"color":"gray"}).html("Queued attribute update " + attribute + "=" + value);
        } else if (action == 'delete') {
            MCEPlugin.queueDeleteUserAttributes([attribute]);
            $('#sendAttributesStatus').css({"color":"gray"}).html("Queued attribute delete " + attribute);
        } else {
            console.log("unknown action value")
        }
    });
}

function editValueField() {
    var valueType = $('[name=type]:checked').val();
    if(valueType == "number") {
        if (!event.key.match(/[\d\.]/) ) {
            event.preventDefault();
        }
    }
}

function updateValueType() {
    var valueType = $('[name=type]:checked').val();
    saveValueForId("value-type", valueType);
    if(valueType=="bool") {
        $('#bool-value-container').show();
        $('#value-container').hide();
    } else {
        $('#bool-value-container').hide();
        $('#value-container').show();
        if(valueType=="date") {
            var value = Date.parse($('#value'));
            if(isNaN(value)) {
                value = new Date();
            }
            $('#value').val( value.toISOString() );
        } else if(valueType=="number") {
            var value = parseFloat($('#value').val() );
            if(isNaN(value)) {
                value = 0;
            }
            $('#value').val(value);
        } else if(valueType=="string") {

        }
    }
}

function clickValueField() {
    $('#value').attr("type", "text");
    var type = $('[name=type]:checked').val();
    if(type == "date") {
        cordova.plugins.DateTimePicker.show({
            mode:"datetime", 
            allowOldDates: true, 
            allowFutureDates: true, 
            okText: "Select", 
            cancelText: "Cancel",
            success: function(newDate) {
                $('#value').val(newDate.toISOString());
            }        
        });
    } else if(type == "number") {
        $('#value').attr("type", "number")
    }
}

function updateActions() {
    var action = getValueForId('action');
    if (action == 'update')
        $('#value-container-container').show();
    else
        $('#value-container-container').hide();
}

function setupEventPage() {
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

var registrationComplete = false;

function updateRegistration(details) {
    var userId = "";
    var channelId = "";
    var status = "";
    if (typeof details['userId'] == "undefined" || typeof details['channelId'] == "undefined") {
        registrationComplete = false;
        status = "Click to register";
        userId = "not registered";
        channelId = "not registered";
    } else {
        registrationComplete = true;
        status = "Registered";
        userId = details['userId'];
        channelId = details['channelId'];
    }
    MCEPlugin.userInvalidated(function(invalidated) {
        if (invalidated) {
            status += " (Invalidated State)";
        }
        $('#registration_status').html(status);
        $('.userId').html(userId);
        $('.channelId').html(channelId);
    });
}

function setupRegistrationPage() {
    $('#registration_status').click(function() {
        if (!registrationComplete) {
            $('#registration_status').html("Registering");
            MCEPlugin.manualInitialization();
        }
    });
    MCEPlugin.setRegistrationCallback(function(details) {
        updateRegistration(details);
    });

    MCEPlugin.getRegistrationDetails(function(details) {
        updateRegistration(details);
    });

    MCEPlugin.getAppKey(function(appKey) {
        $('.appKey').html(appKey);
    });
}
