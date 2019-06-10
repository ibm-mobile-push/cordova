/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2019
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCEInAppPlugin.h"
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import <IBMMobilePush/MCECallbackDatabaseManager.h>
#import <IBMMobilePush/MCEEventClient.h>
#import "MCEEventCallbackQueue.h"
#import <IBMMobilePush/MCEInboxDatabase.h>
#import <IBMMobilePush/MCEPhoneHomeManager.h>

@interface MCEInAppPlugin ()
@property NSMutableDictionary * inAppCallbacks;
@end

@implementation MCEInAppPlugin

- (void) syncInAppMessages: (CDVInvokedUrlCommand*)command {
    [NSNotificationCenter.defaultCenter addObserverForName:@"MCESyncDatabase" object:nil queue: NSOperationQueue.mainQueue usingBlock:^(NSNotification * _Nonnull note) {
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:result callbackId: command.callbackId];
    }];

    [[MCEInboxQueueManager sharedInstance] syncInbox];
}

// Only needed so we can conform to the MCEInAppTemplate protocol
+(void) registerTemplate { }

- (void) addInAppMessage: (CDVInvokedUrlCommand*)command {
    NSDictionary * inAppMessage = [command argumentAtIndex:0];
    [MCEInAppManager.sharedInstance processPayload: @{ @"inApp": inAppMessage }];
}

-(NSDictionary*)packageInAppMessage: (MCEInAppMessage*)inAppMessage
{
    return @{
             @"inAppMessageId": inAppMessage.inAppMessageId,
             @"maxViews": @(inAppMessage.maxViews),
             @"numViews": @(inAppMessage.numViews),
             @"template": inAppMessage.templateName,
             @"content": inAppMessage.content,
             @"triggerDate": @( [inAppMessage.triggerDate timeIntervalSince1970]*1000 ),
             @"expirationDate": @([inAppMessage.expirationDate timeIntervalSince1970]*1000 ),
             @"rules": inAppMessage.rules};
}

-(void)displayInAppMessage:(MCEInAppMessage*)message
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString * callback = self.inAppCallbacks[message.templateName];
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: [self packageInAppMessage: message] ];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:callback];
    });
}

-(void)deleteInAppMessage: (CDVInvokedUrlCommand*)command
{
    NSString * inAppMessageId = [command argumentAtIndex:0];
    MCEInAppMessage * inAppMessage = [MCEInAppManager.sharedInstance inAppMessageById: inAppMessageId];
    [[MCEInAppManager sharedInstance] disable: inAppMessage];
}

-(void)registerInAppTemplate: (CDVInvokedUrlCommand*)command
{
    NSString * template = [command argumentAtIndex:0];
    [[MCEInAppTemplateRegistry sharedInstance] registerTemplate:template hander: self];
    self.inAppCallbacks[template] = command.callbackId;
}

-(void)executeInAppRule: (CDVInvokedUrlCommand*)command
{
    NSArray * rules = [command argumentAtIndex:0];
    [[MCEInAppManager sharedInstance] executeRule:rules];
}

-(void)executeInAppAction: (CDVInvokedUrlCommand*)command
{
    NSDictionary * action = [command argumentAtIndex:0];
    [[MCEActionRegistry sharedInstance] performAction:action forPayload:nil source: InAppSource];
}

- (void)pluginInitialize
{
    self.inAppCallbacks = [NSMutableDictionary dictionary];
}

@end

