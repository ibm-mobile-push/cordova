/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Inbox Default Template Support */
MCEInbox.setInboxRegistry("default", {
    'actions':function(richContent) { return richContent["content"]["actions"] },
    'preview': function (richContent, inboxMessage) {
        return "<div open class='" + (inboxMessage['isExpired'] ? "expired" : "") + "'>" +
                    "<div>" + 
                        "<div class='date'>" + (inboxMessage['isExpired'] ? "Expired: " + inboxMessage['expirationDate'].toLocaleDateString() : inboxMessage['sendDate'].toLocaleDateString()) + "</div>" +
                        "<div class='subject " + (inboxMessage['isRead'] ? "old" : "new") + "'>" + richContent['content']['messagePreview']['subject'] + "</div>" +
                    "</div>" +
                    "<div class='message'>" + richContent['content']['messagePreview']['previewContent'] + "</div>" +
                "</div>";
 }, 'display': function (richContent, inboxMessage) {
     return "<div class='defaultDisplay'>" +
        "<div class='subject'>" + richContent['content']['messagePreview']['subject'] + "</div>" +
        "<div class='date'>" + inboxMessage['sendDate'].toLocaleString() + "</div>" +
        "<div class='content'>" + richContent['content']['messageDetails']["richContent"] + "</div>" +
     "</div>";
}});