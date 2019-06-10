/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2019
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Cordova/CDVPlugin.h>

@interface MCEPlugin : CDVPlugin {
    
}
@property NSString * eventCallback;
@property NSString * registrationCallbacks;
@property NSString * attributeCallback;
@property NSString * actionNotRegistered;
@property NSString * actionNotYetRegistered;

- (void) phoneHome: (CDVInvokedUrlCommand*)command;
- (void) sendActionNotYetRegistered:(NSDictionary*)details;
- (void) sendActionNotRegistered:(NSDictionary*)details;
- (void) sendEventSuccess:(NSArray*)events;
- (void) sendEventFailure:(NSArray*)events error: (NSString*)error;
- (void) sendRegistration;
- (void) sendAttributeFailure: (NSDictionary*)dictionary;
- (void) sendAttributeSuccess:(NSDictionary*)dictionary;
- (BOOL) executeActionCallback:(NSDictionary*)action payload: (NSDictionary*)payload;
- (void) setRegisteredActionCallback:(CDVInvokedUrlCommand*)command;
- (BOOL) executeCategoryCallback:(NSDictionary*)response;
- (void) setCategoryCallbacksCommand: (CDVInvokedUrlCommand*)command;
- (void) getSdkVersion:(CDVInvokedUrlCommand*)command;
- (void) setRegistrationCallback:(CDVInvokedUrlCommand*)command; // Arguments: successCallback, errorCallback
- (void) setEventQueueCallbacks:(CDVInvokedUrlCommand*)command; // Arguments: successCallback, errorCallback
- (void) setAttributeQueueCallbacks:(CDVInvokedUrlCommand*)command; // Arguments: successCallback, errorCallback
- (void) getBadge:(CDVInvokedUrlCommand*)command;
- (void) getRegistrationDetails:(CDVInvokedUrlCommand*)command;
- (void) getAppKey:(CDVInvokedUrlCommand*)command;
- (void) isRegistered:(CDVInvokedUrlCommand*)command;
- (void) queueUpdateUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) queueDeleteUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributeKeysArray
- (void) queueAddEvent:(CDVInvokedUrlCommand*)command;
- (void) setBadge:(CDVInvokedUrlCommand*)command; // Arguments badge
- (void) setIcon:(CDVInvokedUrlCommand*)command; // Arguments icon
- (void) safeAreaInsets: (CDVInvokedUrlCommand*)command;
- (void) userInvalidated: (CDVInvokedUrlCommand*)command;
- (void) unregisterActionCallback:(CDVInvokedUrlCommand*)command;
- (void) setActionNotRegisteredCallback:(CDVInvokedUrlCommand*)command;
- (void) setActionNotYetRegisteredCallback:(CDVInvokedUrlCommand*)command;

@end

void sendAttributeCallback(NSString* callback, NSError*error, id <CDVCommandDelegate> delegate);
