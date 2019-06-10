/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var inboxRegistry = {};
var inboxMessages = [];

exports.setInboxRegistry = function(name, handlers) {
    inboxRegistry[name] = handlers;
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

exports.openInboxMessage = function(inboxMessage) {
	MCEPlugin.queueAddEvent({ type: "inbox", name: "messageOpened", timestamp: new Date(), "attributes":{ "richContentId": inboxMessage.richContentId, "inboxMessageId": inboxMessage.inboxMessageId, "attribution":inboxMessage.attribution, "mailingId":inboxMessage.mailingId } });
    $("#inboxMessageContent").attr('inboxMessageId', inboxMessage['inboxMessageId'])
    MCEInboxPlugin.readMessageId(inboxMessage['inboxMessageId']);
    inboxMessage['expirationDate'] = new Date(inboxMessage['expirationDate']);
    inboxMessage['sendDate'] = new Date(inboxMessage['sendDate']);
    var template = inboxMessage['template'];
    var html = inboxRegistry[template]['display'](inboxMessage);
    $('#inboxMessageContent').html(html)
    $.mobile.changePage("#inboxMessage", { transition: "slide" });
    var inboxMessageId = inboxMessage['inboxMessageId'];
    var messageIndex = MCEInbox.findMessageIndex(inboxMessageId);
    $('#down_button').css('opacity', 1);
    $('#up_button').css('opacity', 1);
    if (messageIndex == 0)
        $('#up_button').css('opacity', 0.5);
    if (messageIndex == inboxMessages.length - 1)
        $('#down_button').css('opacity', 0.5);

    $('#inboxMessageContent a').attr('inboxMessageId', inboxMessage['inboxMessageId']);
    $('#inboxMessageContent a').click(function() {
        var parts = $(this).attr('href').split(":");
        if (parts[0].toLowerCase() == "actionid") {
            var actions = inboxRegistry[template]['actions'](inboxMessage);
            var action = actions[parts[1]];
            MCEInboxPlugin.executeInboxAction(action, $(this).attr('inboxMessageId'));
            return false;
        }
        return true;
    });
}

exports.findMessageIndex = function(inboxMessageId) {
    var messageIndex = 0;
    for (i = 0; i < inboxMessages.length; i++) {
        var inboxMessage = inboxMessages[i];
        if (inboxMessageId == inboxMessage['inboxMessageId'])
            messageIndex = i;
    }
    return messageIndex;
}

document.addEventListener('deviceready', function() {
    $(document).on('click', '#inboxMessages [inboxMessageId] [open]', function(event) {
        var inboxMessageId = $(this).parents('[inboxMessageId]').attr('inboxMessageId');
        MCEInboxPlugin.fetchInboxMessageId(inboxMessageId, function(inboxMessage) {
            MCEInbox.openInboxMessage(inboxMessage);
        });
    });

    $('#up_button img').attr('src', MCEInbox.addImageRatio('images/inbox/chevron-up'));
    $('#up_button').click(function() {
        var inboxMessageId = $("#inboxMessageContent").attr('inboxMessageId');
        var messageIndex = MCEInbox.findMessageIndex(inboxMessageId);
        if (messageIndex > 0)
            messageIndex--;

        MCEInbox.openInboxMessage(inboxMessages[messageIndex]);
    });
    $('#down_button img').attr('src', MCEInbox.addImageRatio('images/inbox/chevron-down'));
    $('#down_button').click(function() {
        var inboxMessageId = $("#inboxMessageContent").attr('inboxMessageId');
        var messageIndex = MCEInbox.findMessageIndex(inboxMessageId);
        if (messageIndex < inboxMessages.length - 1)
            messageIndex++;

        MCEInbox.openInboxMessage(inboxMessages[messageIndex]);
    });
    $('#delete_button').click(function() {
        var inboxMessageId = $("#inboxMessageContent").attr('inboxMessageId');

        $('#inboxMessages div[inboxMessageId=' + inboxMessageId + ']').hide(400);
        MCEInboxPlugin.deleteMessageId(inboxMessageId);

        if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
            $.mobile.changePage("#inbox", { transition: "slide", reverse: true });
        } else {
            navigator.app.backHistory();
        }

        var messageIndex = MCEInbox.findMessageIndex(inboxMessageId);
        inboxMessages.splice(messageIndex, 1);

        if(inboxMessages.length == 0) {
            $('#inboxMessages').append( $('<div>', {class: "emptyInbox"}).html("Inbox has no messages.") )
        }
        $("#inboxMessageContent").html('');
    });
    $('#delete_button img').attr('src', MCEInbox.addImageRatio('images/inbox/trash'));
    $('#refresh_button img').attr('src', MCEInbox.addImageRatio('images/inbox/refresh'));
    $('#refresh_button').click(function() {
        MCEInboxPlugin.syncInboxMessages();
    });

    MCEPlugin.setRegisteredActionCallback(function(action, payload) {
        MCEInboxPlugin.fetchInboxMessageId(action['inboxMessageId'], function(inboxMessage) {
            MCEInbox.openInboxMessage(inboxMessage);
        });
    }, "openInboxMessage");

    // Before starting sync, setup the handler for the sync callback
    MCEInboxPlugin.setInboxMessagesUpdateCallback(function(newInboxMessages) {
        inboxMessages = newInboxMessages;

        var scrollPosition = $('body').scrollTop();

        // Smoother refresh, cache html of message
        var inboxMessageCache = {};
        for (i = 0; i < inboxMessages.length; i++) {
            var inboxMessage = inboxMessages[i];
            var inboxMessageId = inboxMessage['inboxMessageId'];
            inboxMessageCache[inboxMessageId] = $('#inboxMessages div[inboxMessageId=' + inboxMessageId + ']').html();
        }

        $('#inboxMessages').html("");

        if(inboxMessages.length == 0) {
            $('#inboxMessages').append( $('<div>', {class: "emptyInbox"}).html("Inbox has no messages.") )
        }

        for (i = 0; i < inboxMessages.length; i++) {
            var inboxMessage = inboxMessages[i];
            inboxMessage['expirationDate'] = new Date(inboxMessage['expirationDate']);
            inboxMessage['sendDate'] = new Date(inboxMessage['sendDate']);
            var inboxMessageId = inboxMessage['inboxMessageId'];
            var template = inboxMessage['template'];

            // Smoother refresh, use cached html instead of just "loading"
            var preview = inboxMessageCache[inboxMessageId] ? inboxMessageCache[inboxMessageId] : "<div>Loading...</div>";
            $('#inboxMessages').append("<div index='" + i + "' class='messagePreview " + template + "Preview' inboxMessageId='" + inboxMessageId + "'>" + preview + "</div>");

            // This will delay loading of the content until the div is scrolled into view. 
            // Alternatively, you could just disable the outer block and load the contents immediately.
            $('#inboxMessages [inboxMessageId=' + inboxMessageId + ']').one('inview', function(event, visible) {
                var i = $(this).attr('index');
                var inboxMessage = inboxMessages[i];
                var inboxMessageId = $(this).attr('inboxMessageId');
                var template = inboxMessage['template'];
                var html = inboxRegistry[template]['preview'](inboxMessage);
                $('#inboxMessages div[inboxMessageId=' + inboxMessageId + ']').html(html);
            });
        }
        $('body').scrollTop(scrollPosition);

    });

    MCEInboxPlugin.syncInboxMessages();
});