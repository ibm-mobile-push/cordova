/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
IBM MCE Cordova Plugin
@module MCEPlugin
*/

/**
@callback sdkVersionCallback
@param version {string} a short string representing SDK version
*/

/**  
Allow Cordova developer to get the current native SDK version in use
@param callback {sdkVersionCallback} The callback that handles the response
*/
exports.getSdkVersion = function(callback) {
    cordova.exec(callback, null, "MCEPlugin", "getSdkVersion", []);
};

/**
@typedef Registration
@property userId {string} A short string identifying the user, possibly multiple devices
@property channelId {string} A short string identifying the channel or device
@property deviceToken {string} A medium string that represents the iOS device on APNS
@property registrationId {string} A medium string that represents the Android device on GCM
*/

/** 
@callback registrationCallback
@param registration {Registration} Registration Details
*/

/**
Allow Cordova developer to know when registration occurs.
This will only be called once when the application registers with the IBM servers.
If the application is not active when this happens the callback will be queued 
until the next time this method is called to register a callback handler
@param callback {registrationCallback} The callback that handles the response
*/
exports.setRegistrationCallback = function(callback) {
    cordova.exec(callback, null, "MCEPlugin", "setRegistrationCallback", []);
}

/** 
@callback registeredActionCallback
@param actionPayload {Object} is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
@param payload {Object} Entire Android or iOS payload for example &#123;"aps":&#123;"alert":"hello world", "category":"example"&#125;&#125;
*/

/** 
Allow Cordova developer to handle custom actions
@param callback {registeredActionCallback} The callback that handles the response
@param type {string} Custom Action type from the "notification-action" or the "category-actions" section of the payload
*/
exports.setRegisteredActionCallback = function(callback, type) {
    cordova.exec(callback, null, "MCEPlugin", "setRegisteredActionCallback", [type]);
}

/**
@typedef Event
@property type {string} Event type, SDK automatically sends events of "simpleNotification" and "application" types
@property name {string} Event name, SDK automatically sends events of "sessionStart", "sessionEnd", "urlClicked", "appOpened", "phoneNumberClicked" names
@property timestamp {Date} Timestamp that event occurred
@property attributes {Object} Details about event, freeform key value pairs
@property attribution {string} campaign name associated with event, optional
*/

/**
@callback eventQueueFailureCallback
@param result {Object}
@param result.events {Array.<Event>} List of events that were sent
@param result.error {string} Description of the error
*/

/**
@callback eventQueueSuccessCallback
@param events {Array.<Event>} List of events that were sent
*/

/** 
Allow Cordova developer to know when events are sent to the server.
If the event is sent while the application is not active, the callback will be queued
until the next time this method is called to register a callback handler
    
@param callback {eventQueueSuccessCallback} The callback that handles the response
@param callback {eventQueueFailureCallback} The callback that handles the response
*/
exports.setEventQueueCallbacks = function(successCallback, errorCallback) {
        cordova.exec(function (events) {
            successCallback(MCEPlugin.translateEvents(events));
        }, function (eventsAndError) {
            MCEPlugin.translateEvents(eventsAndError['events']);
            errorCallback(eventsAndError);
        }, "MCEPlugin", "setEventQueueCallbacks", []);
    }
    
/** 
Internal function to translate timestamps from integers or strings to JavaScript date objects
@param events {Array.<Event>} List of events to translate
@return {Array.<Event>} List of events translated
*/
exports.translateEvents = function(events) {
    for(index in events)
    {
        var event = events[index];
        event['timestamp'] = new Date(event['timestamp']);
        events[index]=event;
    }
    return events;
}
    
/**
@callback attributeQueueSuccessCallback
@param result {Object}
@param result.operation {string} Either "update", "set" or "delete" depending on which method was called
@param result.domain {string} Either "channel" or "user" depending on which method was called
@param result.attributes {Object} Key value pairs that were updated if the operation was set or update
@param result.keys {Array} A list of keys that were deleted when the operation is delete
*/

/**
@callback attributeQueueFailureCallback
@param result {Object}
@param result.operation {string} Either "update", "set" or "delete" depending on which method was called
@param result.domain {string} Either "channel" or "user" depending on which method was called
@param result.attributes {Object} Key value pairs that were updated if the operation was set or update
@param result.keys {Array} A list of keys that were deleted when the operation is delete
@param result.error {string} Description of the error
*/ 

/**
Allow Cordova developer to know when attributes are sent to the server.
If the attribute is sent while the application is not active, the callback will be
queued until the next time this method is called to register a callback handler
@param callback {attributeQueueSuccessCallback} The callback that handles the response
@param callback {attributeQueueFailureCallback} The callback that handles the response
*/
exports.setAttributeQueueCallbacks = function(successCallback, errorCallback) {
        cordova.exec(function (details) { 
            details["attributes"] = MCEPlugin.translateAttributesCallback(details["attributes"])
            successCallback(details);
        }, function (details) {
            details["attributes"] = MCEPlugin.translateAttributesCallback(details["attributes"])
            errorCallback(details)
        }, "MCEPlugin", "setAttributeQueueCallbacks", []);
    }
    
/** 
Internal function to translate a dictionary of attributes with dates represented as integers back into JavaScript date objects
@param attributes {Array.<Object>} Attributes to be converted
@return {Array.<Object>}
*/
exports.translateAttributesCallback = function (attributes) {
    for(key in attributes)
    {
        var value = attributes[key]
        if(value["mcedate"])
        {
            attributes[key] = new Date(value["mcedate"]);
        }
    }
    return attributes;
}

/**
@callback getBadgeCallback
@param badgeCount {integer}
*/
    
/**
Allow Cordova developer to get the current badge count
@param callback {getBadgeCallback} The callback that handles the response
*/
exports.getBadge = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "getBadge", []);
}

/**
@callback registrationDetailsCallback
@param {Registration} Registration Details
*/

/**
Allow Cordova developer to get the current channelId, userId and deviceToken or registrationId
@param callback {registrationDetailsCallback} The callback that handles the response
*/
exports.getRegistrationDetails = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "getRegistrationDetails", []);
}

/**
@callback appKeyCallback
@param appKey {string} A short string for identifying the app in IBMs system
*/

/** 
Allow Cordova developer to get the current appKey
@param callback {appKeyCallback} The callback that handles the response
*/
exports.getAppKey = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "getAppKey", []);
}

/**
@callback registeredCallback
@param ibmRegistered {boolean} will be either true or false and represents the device registering with the IBM infrastructure
@param providerRegistered {boolean} will be either true or false and represents the device registering the push provider system (APNS or GCM)
@param providerName {string} name of provider, eg "APNS" or "GCM"

/**
Allow Cordova developer to determine if the device has registered with the push provider's service and if it has registered with the IBM infrastructure
@param callback {registeredCallback} The callback that handles the response
*/
exports.isRegistered = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "isRegistered", []);
}
    
/** 
Internal function to translate a dictionary of attributes with dates into integers so they can be processed by SDK
@param attributes {Array.<Object>} Attributes to be converted
@return {Array.<Object>}
*/
exports.translateAttributes = function (attributes) {
    var toClass = {}.toString;
    for(key in attributes)
    {
        var value = attributes[key]
        if(toClass.call(value) == "[object Date]")
        {
            attributes[key] = {"mcedate":value.getTime()};
        }
    }
    return attributes;
}

/** 
Allow Cordova developer to replace all channel attributes with a specified set of attributes
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Object} a list of attributes in key, value format
*/
exports.queueSetChannelAttributes = function(attributes) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(null, this.error, "MCEPlugin", "queueSetChannelAttributes", [attributes]);
}
    
/**
Allow Cordova developer to replace all user attributes with a specified set of attributes
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Object} a list of attributes in key, value format
*/
exports.queueSetUserAttributes = function(attributes) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(null, this.error, "MCEPlugin", "queueSetUserAttributes", [attributes]);
}

/**
Allow Cordova developer to update any channel attributes while leaving the existing attributes alone
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Object} a list of attributes in key, value format
*/
exports.queueUpdateChannelAttributes = function(attributes) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(null, this.error, "MCEPlugin", "queueUpdateChannelAttributes", [attributes]);
}
    
/** 
Allow Cordova developer to update any user attributes while leaving the existing attributes alone
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Object} a list of attributes in key, value format
*/
exports.queueUpdateUserAttributes = function(attributes) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(null, this.error, "MCEPlugin", "queueUpdateUserAttributes", [attributes]);
}
    
/**
Allow Cordova developer to remove specific channel attributes
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Array} a list of attribute keys to be removed
*/
exports.queueDeleteChannelAttributes = function(attributes) {
    cordova.exec(null, this.error, "MCEPlugin", "queueDeleteChannelAttributes", [attributes]);
}
    
/** 
Allow Cordova developer to remove specific user attributes
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Array} a list of attribute keys to be removed
*/
exports.queueDeleteUserAttributes = function(attributes) {
    cordova.exec(null, this.error, "MCEPlugin", "queueDeleteUserAttributes", [attributes]);
}

/**
@callback basicSuccessCallback
*/

/**
@callback basicFailureCallback
@param error {string} Description of the error
*/

/**
Allow Cordova developer to replace all channel attributes with a specified set of attributes
@param attributes {Object} a list of attributes in key, value format
@param successCallback {basicSuccessCallback}
@param failureCallback {basicFailureCallback}
*/
exports.setChannelAttributes = function(attributes, successCallback, errorCallback) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(successCallback, errorCallback, "MCEPlugin", "setChannelAttributes", [attributes]);
}

/** 
Allow Cordova developer to replace all user attributes with a specified set of attributes
@param attributes {Object} a list of attributes in key, value format
@param successCallback {basicSuccessCallback}
@param failureCallback {basicFailureCallback}
*/
exports.setUserAttributes = function(attributes, successCallback, errorCallback) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(successCallback, errorCallback, "MCEPlugin", "setUserAttributes", [attributes]);
}
    
/** 
Allow Cordova developer to update any channel attributes while leaving the existing attributes alone
@param attributes {Object} a list of attributes in key, value format
@param successCallback {basicSuccessCallback}
@param failureCallback {basicFailureCallback}
*/
exports.updateChannelAttributes = function(attributes, successCallback, errorCallback) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(successCallback, errorCallback, "MCEPlugin", "updateChannelAttributes", [attributes]);
}
    
/**
Allow Cordova developer to update any user attributes while leaving the existing  attributes alone
@param attributes {Object} a list of attributes in key, value format
@param successCallback {basicSuccessCallback}
@param failureCallback {basicFailureCallback}
*/
exports.updateUserAttributes = function(attributes, successCallback, errorCallback) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(successCallback, errorCallback, "MCEPlugin", "updateUserAttributes", [attributes]);
}
    
/**
Allow Cordova developer to remove specific channel attributes
@param attributes {Array} a list of attribute keys to be removed
@param successCallback {basicSuccessCallback}
@param failureCallback {basicFailureCallback}
*/
exports.deleteChannelAttributes = function(attributes, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "MCEPlugin", "deleteChannelAttributes", [attributes]);
}
    
/**
Allow Cordova developer to remove specific user attributes
@param attributes {Array} a list of attribute keys to be removed
@param successCallback {basicSuccessCallback}
@param failureCallback {basicFailureCallback}
*/
exports.deleteUserAttributes = function(attributes, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "MCEPlugin", "deleteUserAttributes", [attributes]);
}

/**
Allow Cordova developer to send an event to the IBM infrastructure.
Status will be reported to method registered via setEventQueueCallbacks
@param event {Event} Event to be sent to the server
@param flush {boolean} When this is true, the event is sent immediately and flushes the queue of events to be sent. When it is false, the event is queued and will be automatically sent when the queue is automatically flushed at a later date. This parameter is optional with the default value of true  
*/
exports.queueAddEvent = function(event, flush) {
    event['timestamp'] = event['timestamp'].getTime();
    cordova.exec(null, this.error, "MCEPlugin", "queueAddEvent", [event, flush]);
}

/**
Allow Cordova developer to send an event to the IBM infrastructure.
@param event {Event} Event to be sent to the server
@param successCallback {basicSuccessCallback}
@param failureCallback {basicFailureCallback}
*/    
exports.addEvent = function(event, successCallback, errorCallback) {
    event['timestamp'] = event['timestamp'].getTime();
    cordova.exec(successCallback, errorCallback, "MCEPlugin", "addEvent", [event]);
}

/**
Allow Cordova developer to set the badge count for the iOS homescreen
@param badge {integer} a new badge number
*/
exports.setBadge = function(badge) {
    cordova.exec(null, this.error, "MCEPlugin", "setBadge", [badge]);
}
    
/**
Allow Cordova developer to change the Android icon
@param drawableName {string} Name of a drawable image in app bundle
*/
exports.setIcon = function(drawableName) {
    // device.platform is not defined, but this is an Android-only function
    // if(device.platform == "Android") {
    cordova.exec(null, this.error, "MCEPlugin", "setIcon", [drawableName]);
    // }
}

/**
@callback categoryCallback
@param payload {Object} Entire Android or iOS payload for example &#123;"aps":&#123;"alert":"hello world", "category":"example"&#125;&#125;
@param identifier {string} String identifying button to JavaScript processing click of button
*/

/**
@typedef Action
@param destructive {boolean} When true the option shows in red
@param authentication {boolean} When true requires user to unlock device to execute action
@param name {string} String to display on button for user to select
@param identifier {string} String identifying button to JavaScript processing click of button
*/

/**
Allow Cordova developer to register and respond to iOS static categories
@param callback {categoryCallback} The callback that handles the response
@param categoryName {string} Name of category to respond to in iOS payload
@param actions {Array.<Action>} - an array of actions
*/
exports.setCategoryCallbacks = function(callback, categoryName, actions) {
    cordova.exec(callback, this.error, "MCEPlugin", "setCategoryCallbacksCommand", [categoryName, actions]);
}

/**
Console error reporting 
@param message {string} Error message
*/
exports.error = function(message) {
    console.log("Callback Error: " + message)
}

/**
Executes phone home request which may update the userId and channelId to match changes made on the server. Typically used after contact merge on Engage during user identification. This allows the inbox to be synchronized between multiple installations of the application on different devices for the same user. Note, phone home will execute once every 24 hours automatically without calling this API.
*/
exports.phoneHome = function() {
    cordova.exec(null, this.error, "MCEPlugin", "phoneHome", []);
}
