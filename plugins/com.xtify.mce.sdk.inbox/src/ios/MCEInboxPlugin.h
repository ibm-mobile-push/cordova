/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Cordova/CDVPlugin.h>
#import <IBMMobilePush/MCEInAppTemplateRegistry.h>

@interface MCEInboxPlugin : CDVPlugin {
    
}
@property NSString * inboxCallback;

- (void) fetchInboxMessageViaRichContentId:(CDVInvokedUrlCommand*)command;
- (void) readMessageId:(CDVInvokedUrlCommand*)command;
- (void) deleteMessageId:(CDVInvokedUrlCommand*)command;
- (void) executeInboxAction: (CDVInvokedUrlCommand*)command;
- (void) fetchInboxMessageId: (CDVInvokedUrlCommand*)command;
- (void) setInboxMessagesUpdateCallback: (CDVInvokedUrlCommand*)command;

@end

