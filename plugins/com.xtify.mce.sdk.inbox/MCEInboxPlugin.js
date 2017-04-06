/* Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

cordova.exec(null, null, "MCEInboxPlugin", null, []);

/**
@typedef InboxMessage 
@property inboxMessageId {string} Unique identifier for inbox message
@property richContentId {string} Unique identifier for rich content
@property expirationDate {integer} Expiration of message in seconds since epoch 
@property sendDate {integer} Message sent date in seconds since epoch 
@property template {string} Template name that handles display of this message
@property attribution {string} Campaign name message was sent with
@property isRead {boolean} True for message read, false for message unread
@property isDeleted {boolean} True for message deleted, false for message not deleted
*/

/**
@callback inboxListCallback
@param messages {Array.<InboxMessage>} Messages in Inbox
*/

/**
Allow Cordova Inbox Plugin to respond to changes in the inbox list.
@param callback {inboxListCallback} The callback that handles the response
*/
exports.setInboxMessagesUpdateCallback = function(callback) {
    cordova.exec(callback, this.error, "MCEInboxPlugin", "setInboxMessagesUpdateCallback", []);
}

/**
Allows Cordova Inbox Plugin to initiate a sync with the server. Will execute function 
registered with setInboxMessagesUpdateCallback when complete.
*/
exports.syncInboxMessages = function() {
    cordova.exec(null, this.error, "MCEInboxPlugin", "syncInboxMessages", []);
}

/**
@callback inboxMessageCallback
@param messages {InboxMessage} Inbox message contents
*/

/**
Allows Cordova Inbox Plugin to get the inbox message by providing the inbox message id.
@param inboxMessageId {string} Unique identifier for inbox message
@param callback {inboxMessageCallback} The callback that handles the response
*/
exports.fetchInboxMessageId = function(inboxMessageId, callback) {
    cordova.exec(callback, this.error, "MCEInboxPlugin", "fetchInboxMessageId", [inboxMessageId]);
}

/**
Allows Cordova Inbox Plugin to call out to action registry to handle rich message actions.
@param action {Object} is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
*/
exports.executeInboxAction = function(action, inboxMessageId) {
    cordova.exec(null, this.error, "MCEInboxPlugin", "executeInboxAction", [action, inboxMessageId]);
}

/**
Allows Cordova Inbox Plugin to delete a message from the database cache and server.
@param inboxMessageId {string} Unique identifier for inbox message
*/
exports.deleteMessageId = function(inboxMessageId) {
    cordova.exec(null, this.error, "MCEInboxPlugin", "deleteMessageId", [inboxMessageId]);
}

/**
Allows Cordova Inbox Plugin to set the read status of a message in the database cache and server.
@param inboxMessageId {string} Unique identifier for inbox message
*/
exports.readMessageId = function(inboxMessageId) {
    cordova.exec(null, this.error, "MCEInboxPlugin", "readMessageId", [inboxMessageId]);
}

/**
Allows Cordova Inbox Plugin to retrieve an inbox message by providing a richContentId.
@param richContentId {string} Unique identifier for rich content
@param callback {inboxMessageCallback} The callback that handles the response
*/
exports.fetchInboxMessageViaRichContentId = function(richContentId, callback) {
    cordova.exec(callback, this.error, "MCEInboxPlugin", "fetchInboxMessageViaRichContentId", [richContentId]);
}