/* Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
IBM MCE InApp Cordova Plugin
@module MCEInAppPlugin
*/

cordova.exec(null, null, "MCEInAppPlugin", null, []);

/**
Allows Cordova InApp Plugin to delete an existing InAppMessage
@param inAppMessageId {integer} id of message to be deleted.
*/
exports.deleteInAppMessage = function(inAppMessageId) {
    cordova.exec(null, this.error, "MCEInAppPlugin", "deleteInAppMessage", [inAppMessageId]);
}

/**
Allows Cordova InApp Plugin to look for and possibly execute the next InApp message.
@param rules {Array.<string>} A list of rules to be matched against.
*/
exports.executeInAppRule = function(rules) {
    cordova.exec(null, this.error, "MCEInAppPlugin", "executeInAppRule", [rules]);
}

/**
@typedef InAppMessage
inAppMessageId {integer} The unique identifier of the InAppMessage
maxViews {integer} The total allowed number of views of the message.
numViews {integer} The current count of views of the message.
template {string} The template name that handles the message.
content {object} Template defined details of message
triggerDate {integer} Date the message should first appear in seconds since epoch 
expirationDate {integer} Date the message should last appear in seconds since epoch 
rules {Array.<string>} A list of rules to be matched against.
*/

/**
@callback InAppTemplateCallback
@param inAppMessage {InAppMessage} An InApp message to be displayed.
*/

/**
Allows Cordova InApp Plugin to register a template handler.
@param callback {InAppTemplateCallback} The callback that handles the response
@param templateName {string} A template name that this handler displays
*/
exports.registerInAppTemplate = function(callback, templateName) {
    MCEPlugin.pauseResumeCallback(function () {    
        cordova.exec(callback, this.error, "MCEInAppPlugin", "registerInAppTemplate", [templateName, false]);
    }, function() {
        cordova.exec(callback, this.error, "MCEInAppPlugin", "registerInAppTemplate", [templateName, true]);
    });
}

/**
Allows Cordova InApp Plugin to initiate a sync with the server.
*/
exports.syncInAppMessages = function (callback) {
    cordova.exec(callback, this.error, "MCEInAppPlugin", "syncInAppMessages", []);
}

/**
Allows Cordova InApp Plugin to call out to action registry to handle rich message actions.
@param action {Object} is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
*/
exports.executeInAppAction = function(action) {
    cordova.exec(null, this.error, "MCEInAppPlugin", "executeInAppAction", [action]);
}

exports.addImageRatio = function(name) {
    if (window.devicePixelRatio > 2) {
        return name + '@3x.png';
    } else if (window.devicePixelRatio > 1) {
        return name + '@2x.png';
    } else {
        return name + '.png';
    }
}

exports.processColor = function(colorString, defaultColor) {
    if (colorString != undefined) {
        if (typeof colorString == "string") {
            if (colorString.substr(0, 2) == "0x") {
                return "#" + colorString.substr(2, 6);
            } else if (colorString.substr(0, 1) != "#") {
                return "#" + colorString;
            } else {
                return colorString;
            }
        } else if (colorString['red'] != undefined && colorString['green'] != undefined && colorString['blue'] != undefined) {
            var red = parseFloat(colorString['red']) * 255;
            var green = parseFloat(colorString['green']) * 255;
            var blue = parseFloat(colorString['blue']) * 255;
            return "RGBA(" + red + "," + green + "," + blue + ",1)";
        }
    }
    return defaultColor;
}

/**
 * Adds an InAppMessage to the database, this is largely for testing purposes.
 * @param {dictionary} InApp Message Dictionary 
 */
exports.addInAppMessage = function(inAppMessage) {
    cordova.exec(null, this.error, "MCEInAppPlugin", "addInAppMessage", [inAppMessage]);
}