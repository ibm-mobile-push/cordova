/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2016, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

document.addEventListener('deviceready', function () {
    MCEInAppPlugin.registerInAppTemplate(function (inAppMessage) {
        MCEInAppMedia.show(inAppMessage, function () {

			$('.mediaInApp').append("<div class='image'></div>")
			$('.mediaInApp .image').css("background-image", "url(" + inAppMessage["content"]["image"] + ")");

			$('.mediaInApp .image').click(function () {
				MCEInAppPlugin.executeInAppAction(inAppMessage['content']['action'])
				MCEInAppPlugin.deleteInAppMessage(inAppMessage['inAppMessageId'] );
				MCEInAppMedia.hideMediaInApp();
			});
		
			var duration = inAppMessage["content"]["duration"];
			if(duration !== 0 && !duration)
				duration = 5;

			// Animate in
			$('.mediaInApp').css({"height":document.height + "px","top": document.height + "px"}).animate({"top":0}, function () {
				if(duration)
					setTimeout(function () {
						if(MCEInAppMedia.autoDismiss)
							MCEInAppMedia.hideMediaInApp();
					}, duration * 1000);
			});
        
		});

    }, "image");
});
