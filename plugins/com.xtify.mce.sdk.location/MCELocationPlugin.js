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

exports.setLocationUpdatedCallback = function (callback) {
    cordova.exec(callback, this.error, "MCELocationPlugin", "setLocationUpdatedCallback", []);
}

exports.syncLocations = function () {
    cordova.exec(null, this.error, "MCELocationPlugin", "syncLocations", []);
}
