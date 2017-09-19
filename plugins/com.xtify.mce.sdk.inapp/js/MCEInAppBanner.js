/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var bannerInAppHidden;
var bannerInAppShown;
document.addEventListener('deviceready', function() {
    MCEInAppPlugin.registerInAppTemplate(function(inAppMessage) {

        var close = MCEInAppPlugin.addImageRatio("images/inApp/cancel");

        var icon = undefined;
        if (inAppMessage['content']['icon']) {
            icon = MCEInAppPlugin.addImageRatio("images/inApp/" + inAppMessage['content']['icon']);
        }

        var styles = '';
        var background;
        if (typeof(inAppMessage['content']['mainImage']) != 'undefined') {
            styles += 'background-image: url(' + inAppMessage['content']['mainImage'] + ');';
            styles += 'background-size: cover;';
        } else if (typeof(inAppMessage['content']['color']) != 'undefined')
            styles += 'background-color: ' + MCEInAppPlugin.processColor(inAppMessage['content']['color'], "RGBA(18,84,189,1)") + ";";
        else
            styles += 'background-color: RGBA(18,84,189,1);';

        styles += 'color: ' + MCEInAppPlugin.processColor(inAppMessage['content']['foreground'], "white") + ';';

        $('#inApp').remove();

        $('body').prepend("<div style='" + styles + "' id='inApp' class='bannerInApp'><div class='close'><img src='" + close + "'></div>" + (icon ? "<div class='icon'><img src='" + icon + "'></div>" : "") + "<div class='text'" + (icon ? "" : " style='margin-left: 10px;'") + ">" + inAppMessage['content']['text'] + "</div></div>");

        $('#inApp .icon,#inApp .text').click(function() {
            MCEInAppPlugin.executeInAppAction(inAppMessage['content']['action'])
            MCEInAppPlugin.deleteInAppMessage(inAppMessage['inAppMessageId']);
            hideBannerInApp();
        });

        $('#inApp .close').click(function() {
            hideBannerInApp();
        });

        // Vertical center text
        var padding = ($('#inApp').height() - $('#inApp div.text').height()) / 2;
        $('#inApp div.text').css('padding-top', padding + "px");

        if (inAppMessage["content"]["orientation"] == "top") {
            bannerInAppHidden = { 'top': "-44px" };
            bannerInAppShown = { 'top': "0" };
        } else {
            bannerInAppHidden = { 'bottom': "-44px" };
            bannerInAppShown = { 'bottom': "0" };
        }

        var duration = inAppMessage["content"]["duration"];
        if (duration !== 0 && !duration)
            duration = 5;

        // Animate in
        $('#inApp').css(bannerInAppHidden).animate(bannerInAppShown, function() {
            if (duration)
                setTimeout(hideBannerInApp, duration * 1000);
        });

    }, "default");
});

function hideBannerInApp() {
    // Animate Out
    $('#inApp').animate(bannerInAppHidden, function() {
        // Complete
        $('#inApp').remove();
    });
}