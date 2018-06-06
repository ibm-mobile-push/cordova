/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Cordova/CDVPlugin.h>
#import <IBMMobilePush/MCEInAppTemplateRegistry.h>

@interface MCEInAppPlugin : CDVPlugin <MCEInAppTemplate> {
    
}

- (void) deleteInAppMessage: (CDVInvokedUrlCommand*)command;
- (void) executeInAppAction: (CDVInvokedUrlCommand*)command;
- (void) registerInAppTemplate: (CDVInvokedUrlCommand*)command;
- (void) executeInAppRule:(CDVInvokedUrlCommand*)command;
- (void) addInAppMessage: (CDVInvokedUrlCommand*)command;

@end
