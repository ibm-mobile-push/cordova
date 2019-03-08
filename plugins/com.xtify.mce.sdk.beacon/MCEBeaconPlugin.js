/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
IBM MCE iBeacon Cordova Plugin
@module MCEBeaconPlugin
*/

/**
@typedef BeaconMajor
@property major {integrer} Major of beacon region
*/

/**
@callback beaconRegionsCallback
@param beacons {Array.<BeaconMajor>} List of current beacon regions.
*/

/**
Query the current iBeacon regions.
@param callback {beaconRegionsCallback} The callback with the current iBeacon regions.
 */
exports.beaconRegions = function(callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "beaconRegions", []);
}

/**
@typedef Beacon
@property major {integrer} Major of beacon region
@property minor {integrer} Minor of beacon region
@property locationId {string} Identifier of beacon region
*/

/**
@callback beaconCallback
@param beacon {Beacon} Beacon region entered or left.
*/

/**
Set callback for entering iBeacon regions
@param callback {beaconCallback} Callback function for entering iBeacon regions.
 */
exports.setBeaconEnterCallback = function(callback) {
    MCEPlugin.pauseResumeCallback(function () {
        cordova.exec(null, null, "MCEBeaconPlugin", "setBeaconEnterCallback", []);
    }, function () {
        cordova.exec(callback, this.error, "MCEBeaconPlugin", "setBeaconEnterCallback", []);
    });
}

/**
Set callback for exiting iBeacon regions
@param callback {beaconCallback} Callback function for exiting iBeacon regions.
 */
exports.setBeaconExitCallback = function(callback) {
    MCEPlugin.pauseResumeCallback(function () {
        cordova.exec(null, null, "MCEBeaconPlugin", "setBeaconExitCallback", []);
    }, function () {
        cordova.exec(callback, this.error, "MCEBeaconPlugin", "setBeaconExitCallback", []);
    });
}

/**
@callback beaconEnabledCallback
@param status {boolean} True if iBeacons are enabled, false otherwise.
*/

/**
Query if iBeacons are enabled or disabled
@param callback {beaconEnabledCallback} response callback.
 */
exports.beaconEnabled = function(callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "beaconEnabled", []);
}

/**
@callback beaconUUIDCallback
@param status {string} iBeacon global UUID setup.
*/

/**
Query if iBeacon global UUID currently setup.
@param callback {beaconUUIDCallback} response callback.
 */
exports.beaconUUID = function(callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "beaconUUID", []);
}