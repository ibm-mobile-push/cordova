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
    cordova.exec(callback, this.error, "MCELocationPlugin", "setLocationUpdatedCallback", []);
}

/**
Ask SDK to syncronize the geofences with the server. This can only be called once every 5 minutes.
 */
exports.syncLocations = function() {
    cordova.exec(null, this.error, "MCELocationPlugin", "syncLocations", []);
}