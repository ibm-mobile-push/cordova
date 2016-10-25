/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Cordova/CDVPlugin.h>

@interface MCEPlugin : CDVPlugin {
    
}
@property NSString * eventCallback;
@property NSString * registrationCallbacks;
@property NSString * attributeCallback;

- (void) phoneHome: (CDVInvokedUrlCommand*)command;
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
- (void) setChannelAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) setUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) updateChannelAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) updateUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) deleteChannelAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributeKeysArray
- (void) deleteUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributeKeysArray
- (void) queueSetChannelAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) queueSetUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) queueUpdateChannelAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) queueUpdateUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributesArray
- (void) queueDeleteChannelAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributeKeysArray
- (void) queueDeleteUserAttributes:(CDVInvokedUrlCommand*)command; // Arguments attributeKeysArray
- (void) addEvent:(CDVInvokedUrlCommand*)command; // Arguments event
- (void) queueAddEvent:(CDVInvokedUrlCommand*)command;
- (void) setBadge:(CDVInvokedUrlCommand*)command; // Arguments badge
- (void) setIcon:(CDVInvokedUrlCommand*)command; // Arguments icon

@end

void sendAttributeCallback(NSString* callback, NSError*error, id <CDVCommandDelegate> delegate);
