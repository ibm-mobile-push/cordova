/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2016, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

exports.hideMediaInApp = function ()
{
    $('.mediaInApp').animate({"top":document.height + "px"}, function () {
        $('.mediaInApp').remove();
    });
}

exports.show = function (inAppMessage) {    
    MCEInAppMedia.autoDismiss = true;
    var close = MCEInAppPlugin.addImageRatio("images/inApp/dismiss");
    var handle = MCEInAppPlugin.addImageRatio("images/inApp/handle");
    
    $('#inApp').remove();
    
    $('body').prepend("<div id='inApp' class='mediaInApp'><div class='handle'><img src='" + handle + "'></div><div class='close'><img src='" + close + "'></div><div><div class='text'><b>" + inAppMessage['content']['title'] + "</b><div>" + inAppMessage['content']['text'] + "</div></div></div>");

    $('.mediaInApp .close').click(function () {
        MCEInAppMedia.hideMediaInApp();
    });
    
    var expanded = false;
    $('.mediaInApp .text').click(function () {
        MCEInAppMedia.autoDismiss = false;
        expanded = !expanded;
        if(expanded)
            $(this).css({'max-height': '100%', 'color': "white", "background":"RGBA(0,0,0,0.2)"});
        else
            $(this).css({'max-height': '44px', 'color': "gray", "background": ""});
    });

}