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

exports.beaconRegions = function (callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "beaconRegions", []);
}

exports.setBeaconEnterCallback = function (callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "setBeaconEnterCallback", []);
}

exports.setBeaconExitCallback = function (callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "setBeaconExitCallback", []);
}

exports.beaconEnabled = function (callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "beaconEnabled", []);
}

exports.beaconUUID = function (callback) {
    cordova.exec(callback, this.error, "MCEBeaconPlugin", "beaconUUID", []);
}
