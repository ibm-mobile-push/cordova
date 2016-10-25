/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2016, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Inbox Default Template Support */
document.addEventListener('deviceready', function () {
    $(document).on("click", ".postInboxMessage .actions a[action]", function () {
        var action = JSON.parse($(this).attr('action'));
        MCEInboxPlugin.executeInboxAction(action, $(this).parents('[inboxMessageId]').attr('inboxMessageId'));
    });
    
    var imageSizeCache = {};
    $(document).on('inview', ".postInboxMessage .contentImage", function () {
        var element = this;
        
        var source = $(element).attr('source');
        var size = imageSizeCache[source];
        if(size)
        {
            element.src = source;
            var height = imageSizeCache[source]['height'] / imageSizeCache[source]['width'] * $(element).width();
            $(element).height(height);
            console.log("cache resizing image to " + height);
        }
        else
        {
            var contentImage = new Image();
            contentImage.onload = function () {
                element.src = source;
                
                imageSizeCache[source] = {"width":contentImage.naturalWidth, "height":contentImage.naturalHeight};
                
                var height = contentImage.naturalHeight / contentImage.naturalWidth * $(element).width();
                console.log("fresh resizing image to " + height);
                $(element).height(height);
            };
            contentImage.src = source;
        }
    });                   
});

MCEInbox.setInboxRegistry("post", {
    'actions':function(richContent) { return richContent["content"]["actions"] },
    "preview": function (richContent, inboxMessage) {
        return this['view'](richContent, inboxMessage);
    },
    'view': function (richContent, inboxMessage) {
        var c = richContent["content"];
        var header = "<div open class='postHeader'>";
        var titleStyle = "";
        if(c["headerImage"])
        {
            header += "<img class='headerImage' src='" + c["headerImage"] + "'>";
            titleStyle = " style='left: 59px'";
        }
        header += "<div class='title'" + titleStyle + ">" + c['header'] + "</div>";
        header += "<div class='subtitle'" + titleStyle + ">" + c['subHeader'] + "</div>";
        header += "</div>";
        
        var content = "";
        if(c['contentVideo'])
        {
            content += "<video noclick class='contentVideo' webkit-playsinline controls><source src=" + c['contentVideo'] + ">Your browser does not support the video tag.</video>";
        }
        else if(c['contentImage'])
        {
            content += "<img open class='contentImage' source='" + c['contentImage'] + "'>";
        }
        if(c['contentText'])
        {
            content += "<div open class='contentText'>" + c['contentText'] + "</div>";
        }
        
        var actions = "";
        if(c['actions'])
        {
            actions += "<div class='actions'>";
            for(action in c['actions'])
            {
                actions += "<div><a noclick action='" + JSON.stringify(c['actions'][action]) + "'>" + c['actions'][action]['name'] + "</a></div>";            
            }
            actions += "</div>";
        }

        
        return "<div class='postInboxMessage'>" + header + content + actions + "</div>";
 }, 'display': function (richContent, inboxMessage) {
        return this['view'](richContent, inboxMessage);
}});