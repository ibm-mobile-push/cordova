/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
IBM MCE Geofence Cordova Plugin
@module MCEGeofencePlugin
*/

exports.geofencesNear = function (callback, latitude, longitude, radius) {
    cordova.exec(callback, this.error, "MCEGeofencePlugin", "geofencesNear", [latitude, longitude, radius]);
}

exports.setGeofenceEnterCallback = function (callback) {
    cordova.exec(callback, this.error, "MCEGeofencePlugin", "setGeofenceEnterCallback", []);
}

exports.setGeofenceExitCallback = function (callback) {
    cordova.exec(callback, this.error, "MCEGeofencePlugin", "setGeofenceExitCallback", []);
}

exports.geofenceEnabled = function (callback) {
    cordova.exec(callback, this.error, "MCEGeofencePlugin", "geofenceEnabled", []);
}
