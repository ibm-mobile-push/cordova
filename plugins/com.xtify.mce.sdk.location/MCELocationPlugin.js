/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
IBM MCE Location Cordova Plugin
@module MCELocationPlugin
*/

/**
The location callback includes no data. When it is received you should refresh your inbox database.
@typedef locationCallback
 */

/**
Set callback for location database updates
@param callback {locationCallback} Callback which will be called when the database is updated.
 */
exports.setLocationUpdatedCallback = function(callback) {
    MCEPlugin.pauseResumeCallback(function () {    
        cordova.exec(null, null, "MCELocationPlugin", "setLocationUpdatedCallback", []);
    }, function () {
        cordova.exec(callback, this.error, "MCELocationPlugin", "setLocationUpdatedCallback", []);
    });
}

/**
Ask SDK to syncronize the geofences with the server. This can only be called once every 5 minutes.
 */
exports.syncLocations = function() {
    cordova.exec(null, this.error, "MCELocationPlugin", "syncLocations", []);
}

/**
Manually initialize location services for SDK, requires AUTO_INITIALIZE_LOCATION=FALSE 
in the com.xtify.mce.sdk.location Cordova config 
This is used to delay location services initalization until desired.
*/
exports.manualLocationInitialization = function() {
    cordova.exec(null, null, "MCELocationPlugin", "manualLocationInitialization", []);
}

/**
This method reports if the App has authorization to use location services. 
It can report the following values:
-2 The App has foreground only access to location services (use manualLocationInitialization)
-1 The App is not authorized to use location services
0 The App has not yet requested to use location services (use manualLocationInitialization)
1 The App has complete access to location services
 */
exports.locationAuthorization = function(callback) {
    cordova.exec(callback, null, "MCELocationPlugin", "locationAuthorization", []);
}

/**
This callback is called when access to the location services changes.
 */
exports.setLocationAuthorizationCallback = function(callback) {
    cordova.exec(callback, null, "MCELocationPlugin", "setLocationAuthorizationCallback", []);
}