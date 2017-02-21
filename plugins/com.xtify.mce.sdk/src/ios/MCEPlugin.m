/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCEPlugin.h"
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import <IBMMobilePush/MCECallbackDatabaseManager.h>
#import <IBMMobilePush/MCEEventClient.h>
#import "AppDelegate+MCE.h"
#import "MCEEventCallbackQueue.h"
#import <IBMMobilePush/MCEPhoneHomeManager.h>
#import <IBMMobilePush/MCELocationClient.h>

@interface MCEPlugin ()
@property NSMutableDictionary * actionCallbacks;
@property NSMutableDictionary * categoryCallbacks;
@property MCEAttributesQueueManager * attributeQueue;
@property MCEAttributesClient * attributeClient;
@property MCEEventService * eventService;
@property NSDateFormatter *rfc3339DateFormatter;
@property MCEEventClient * eventClient;
@end

@implementation MCEPlugin

- (void) phoneHome: (CDVInvokedUrlCommand*)command;
{
    [[NSUserDefaults standardUserDefaults] setObject: [NSDate distantPast] forKey: @"MCELastPhoneHome"];
    [MCEPhoneHomeManager phoneHome];
}

-(NSArray*)packageEvents: (NSArray*)events
{
    NSMutableArray * results = [NSMutableArray array];
    for (MCEEvent * event in events) {
        NSMutableDictionary * eventDictionary = [[event toDictionary] mutableCopy];
        eventDictionary[@"timestamp"] = [self.rfc3339DateFormatter stringFromDate: eventDictionary[@"timestamp"]];
        [results addObject: eventDictionary];
    }
    return results;
}

-(void)sendRegistration
{
    [self sendRegistrationDetails:self.registrationCallbacks];
}

-(void)sendAttributeSuccess:(NSDictionary*)dictionary
{
    CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.attributeCallback];
}
-(void)sendAttributeFailure: (NSDictionary*)dictionary
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.attributeCallback];
}

-(void)sendEventSuccess:(NSArray*)events
{
    CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:[self packageEvents: events]];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.eventCallback];
}

-(void)sendEventFailure:(NSArray*)events error: (NSString*)error
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:@{@"events":[self packageEvents: events], @"error":error}];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.eventCallback];
}

- (void)pluginInitialize
{
    [super pluginInitialize];
    self.actionCallbacks = [NSMutableDictionary dictionary];
    self.categoryCallbacks = [NSMutableDictionary dictionary];
    self.attributeClient = [[MCEAttributesClient alloc] init];
    self.eventClient = [[MCEEventClient alloc] init];
    self.attributeQueue = [[MCEAttributesQueueManager alloc] init];
    
    self.rfc3339DateFormatter = [[NSDateFormatter alloc] init];
    NSLocale *enUSPOSIXLocale = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US_POSIX"];
    
    [self.rfc3339DateFormatter setLocale:enUSPOSIXLocale];
    [self.rfc3339DateFormatter setDateFormat:@"yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'SSS'Z'"];
    [self.rfc3339DateFormatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
    
    AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
    [appDelegate setPlugin:self];
}


-(void)dealloc
{
    AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
    [appDelegate setPlugin:nil];
}
-(BOOL)executeCategoryCallback:(NSDictionary*)response
{
    NSString * categoryName = response[@"payload"][@"aps"][@"category"];
    NSString * callback = self.categoryCallbacks[categoryName];
    NSLog(@"category callback: %@", callback);
    if(callback)
    {
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:response];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:callback];
        
        return TRUE;
    }
    return FALSE;
}

// arguments categoryName, arrayOfActions
// arrayOfActions contains objects in format {"destructive":true/false, "authentication":true/false, "name": "the button string", "identifier": "an identifier for later use"}
-(void)setCategoryCallbacksCommand: (CDVInvokedUrlCommand*)command
{
    Class MutableUserNotificationAction = NSClassFromString(@"UIMutableUserNotificationAction");
    Class MutableUserNotificationCategory = NSClassFromString(@"UIMutableUserNotificationCategory");
    
    if(!MutableUserNotificationAction)
    {
        return;
    }

    // Register category name in user defaults
    NSString * categoryName = [command argumentAtIndex:0];
    NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
    NSMutableSet * categoryRegistry = [NSMutableSet setWithArray: [defaults arrayForKey: @"categoryRegistry"]];
    if(!categoryRegistry)
        categoryRegistry = [NSMutableSet set];
    [categoryRegistry addObject:categoryName];
    [defaults setObject:[categoryRegistry allObjects] forKey:@"categoryRegistry"];
    
    // Register callback in callbacks mapping
    self.categoryCallbacks[categoryName] = command.callbackId;
    
    // Register Category with OS
    UIUserNotificationSettings * currentSettings = [[UIApplication sharedApplication] currentUserNotificationSettings];
    NSMutableSet * categories = [currentSettings.categories mutableCopy];
    UIUserNotificationCategory * removeCategory = nil;
    for (UIUserNotificationCategory * category in categories) {
        if([category.identifier isEqual: categoryName])
        {
            removeCategory = category;
        }
    }
    if(removeCategory)
    {
        [categories removeObject:removeCategory];
    }
    
    id mceTempCategory = [[MutableUserNotificationCategory alloc] init];
    [mceTempCategory setIdentifier: categoryName];
    
    NSArray * actionDicts = [command argumentAtIndex:1];
    NSMutableArray * actions = [NSMutableArray array];
    for (NSDictionary * actionDict in actionDicts) {
        id action = [[MutableUserNotificationAction alloc] init];
        if(!actionDict[@"destructive"] || ![actionDict[@"destructive"] isKindOfClass:[NSNumber class]])
        {
            NSLog(@"Undefined destructive flag for action %@", actionDict);
            return;
        }
        [action setDestructive:[actionDict[@"destructive"] boolValue] ];
        
        if(!actionDict[@"authentication"] || ![actionDict[@"authentication"] isKindOfClass:[NSNumber class]])
        {
            NSLog(@"Undefined authentication flag for action %@", actionDict);
            return;
        }
        [action setAuthenticationRequired: [actionDict[@"authentication"] boolValue]];
        
        [action setActivationMode: UIUserNotificationActivationModeForeground];
        [action setTitle: actionDict[@"name"]];
        [action setIdentifier: actionDict[@"identifier"]];
        [actions addObject: action];
    }
    [mceTempCategory setActions:actions forContext:UIUserNotificationActionContextDefault];
    [mceTempCategory setActions:actions forContext:UIUserNotificationActionContextMinimal];
    
    [categories addObject: mceTempCategory];
    UIUserNotificationSettings * newSettings = [UIUserNotificationSettings settingsForTypes:currentSettings.types categories:categories];
    [[UIApplication sharedApplication] registerUserNotificationSettings: newSettings];
    
    // Look for backlog of callbacks
    [[MCECallbackDatabaseManager sharedInstance] selectCallbacks: @"queuedCategories" withBlock:^(NSArray*responses, NSArray*ids){
        NSLog(@"%lu queued Categories", (unsigned long)[responses count]);
        if([responses count])
        {
            NSMutableArray * deleteIds = [NSMutableArray array];
            for(int i=0; i<[responses count];i++)
            {
                NSDictionary * response = responses[i];
                if([response[@"payload"][@"aps"][@"category"] isEqual: categoryName])
                {
                    [self executeCategoryCallback: response];
                    [deleteIds addObject: ids[i]];
                }
                
            }
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                [[MCECallbackDatabaseManager sharedInstance] deleteCallbacksById:deleteIds];
            });
        }
    }];
}

// Arguments: type
-(void)setRegisteredActionCallback:(CDVInvokedUrlCommand*)command
{
    // replacing NSUserDefaults actionRegistry
    NSString * type = [command argumentAtIndex:0];
    NSArray * registeredCustomActions = [self.commandDelegate.settings[@"customactions"] componentsSeparatedByString: @" "];
    if(![registeredCustomActions containsObject:type])
    {
        NSLog(@"Can not register action callback for type %@ because that type is not registered in the config.xml customActions preference.", type);
        return;
    }
    
    AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
    [[MCEActionRegistry sharedInstance] registerTarget:appDelegate withSelector:@selector(action:payload:) forAction:type];
    self.actionCallbacks[type] = command.callbackId;
    
    [[MCECallbackDatabaseManager sharedInstance] selectCallbacks: @"queuedActions" withBlock:^(NSArray*dictionaries, NSArray*ids){
        if([dictionaries count])
        {
            NSMutableArray * deleteIds = [NSMutableArray array];
            for(int i=0; i<[dictionaries count];i++)
            {
                NSDictionary * dictionary = dictionaries[i];
                NSDictionary * action = dictionary[@"action"];
                NSDictionary * payload = dictionary[@"payload"];
                if([action[@"type"] isEqual: type])
                {
                    [self executeActionCallback: action payload: payload];
                    [deleteIds addObject: ids[i]];
                }
                
            }
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                [[MCECallbackDatabaseManager sharedInstance] deleteCallbacksById:deleteIds];
            });
        }
    }];
}

-(BOOL)executeActionCallback:(NSDictionary*)action payload: (NSDictionary*)payload
{
    NSString * type = action[@"type"];
    NSString * callback = self.actionCallbacks[type];
    if(callback)
    {
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:@[action, payload]];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:callback];
        
        return TRUE;
    }
    return FALSE;
}

// Arguments: successCallback, errorCallback
- (void)setRegistrationCallback:(CDVInvokedUrlCommand*)command
{
    self.registrationCallbacks = command.callbackId;
    
    AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
    if([appDelegate needsRegistration])
    {
        [self sendRegistration];
        [appDelegate setNeedsRegistration:FALSE];
    }
}

// Arguments: successCallback, errorCallback
- (void)setEventQueueCallbacks:(CDVInvokedUrlCommand*)command
{
    self.eventCallback = command.callbackId;
    
    [[MCEEventCallbackQueue sharedInstance] dequeueWithCallback: ^(NSArray * events, NSString * error){
        if(error)
        {
            [self sendEventFailure:events error: error];
        }
        else
        {
            [self sendEventSuccess:events];
        }
    }];
}

// Arguments: successCallback, errorCallback
- (void)setAttributeQueueCallbacks:(CDVInvokedUrlCommand*)command
{
    self.attributeCallback = command.callbackId;
    
    [[MCECallbackDatabaseManager sharedInstance] selectCallbacks: @"attributeSuccess" withBlock:^(NSArray*dictionaries, NSArray*ids){
        if([dictionaries count])
        {
            for (NSDictionary * dictionary in dictionaries) {
                [self sendAttributeSuccess: dictionary];
            }
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                [[MCECallbackDatabaseManager sharedInstance] deleteCallbacksById:ids];
            });
        }
    }];
    
    [[MCECallbackDatabaseManager sharedInstance] selectCallbacks: @"attributeFailure" withBlock:^(NSArray*dictionaries, NSArray*ids){
        if([dictionaries count])
        {
            for (NSDictionary * dictionary in dictionaries) {
                [self sendAttributeFailure: dictionary];
            }
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                [[MCECallbackDatabaseManager sharedInstance] deleteCallbacksById:ids];
            });
        }
    }];
}

- (void)getSdkVersion:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[MCESdk sharedInstance] sdkVersion]];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getBadge:(CDVInvokedUrlCommand*)command
{
    NSInteger badge = [[UIApplication sharedApplication] applicationIconBadgeNumber];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:(int)badge];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getRegistrationDetails:(CDVInvokedUrlCommand*)command
{
    [self sendRegistrationDetails:command.callbackId];
}

- (void)sendRegistrationDetails:(id)callbackId
{
    NSMutableDictionary * details = [NSMutableDictionary dictionary];
    if(MCERegistrationDetails.userId)
    {
        details[@"userId"] = MCERegistrationDetails.userId;
    }
    if(MCERegistrationDetails.channelId)
    {
        details[@"channelId"] = MCERegistrationDetails.channelId;
    }
    if(MCERegistrationDetails.pushToken)
    {
        details[@"deviceToken"] = [MCEApiUtil deviceToken: MCERegistrationDetails.pushToken];
    }
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: details ];
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}

- (void)getAppKey:(CDVInvokedUrlCommand*)command
{
    MCEConfig * config = [[MCESdk sharedInstance] config];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:config.appKey];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)isRegistered:(CDVInvokedUrlCommand*)command
{
    NSNumber * ibmRegistered = [NSNumber numberWithBool: MCERegistrationDetails.mceRegistered];
    NSNumber * providerRegistered = [NSNumber numberWithBool: MCERegistrationDetails.apsRegistered];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsMultipart:@[ ibmRegistered, providerRegistered, @"APNS"]];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributesDictionary
- (void)setChannelAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    NSString * callback = command.callbackId;
    id <CDVCommandDelegate> delegate = self.commandDelegate;
    [self.attributeClient setChannelAttributes: attributes completion: ^(NSError *error) {
        sendAttributeCallback(callback, error, delegate);
    } ];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


// Arguments attributesArray
- (void)setUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    NSString * callback = command.callbackId;
    id <CDVCommandDelegate> delegate = self.commandDelegate;
    [self.attributeClient setUserAttributes: attributes completion: ^(NSError *error) {
        sendAttributeCallback(callback, error, delegate);
    } ];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributesArray
- (void)updateChannelAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    NSString * callback = command.callbackId;
    id <CDVCommandDelegate> delegate = self.commandDelegate;
    [self.attributeClient updateChannelAttributes: attributes completion: ^(NSError *error) {
        sendAttributeCallback(callback, error, delegate);
    } ];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributesArray
- (void)updateUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    NSString * callback = command.callbackId;
    id <CDVCommandDelegate> delegate = self.commandDelegate;
    [self.attributeClient updateUserAttributes: attributes completion: ^(NSError *error) {
        sendAttributeCallback(callback, error, delegate);
    } ];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributeKeysArray
- (void)deleteChannelAttributes:(CDVInvokedUrlCommand*)command
{
    NSArray * keys = [command argumentAtIndex:0];
    NSString * callback = command.callbackId;
    id <CDVCommandDelegate> delegate = self.commandDelegate;
    [self.attributeClient deleteChannelAttributes: keys completion: ^(NSError *error) {
        sendAttributeCallback(callback, error, delegate);
    } ];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributeKeysArray
- (void)deleteUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSArray * keys = [command argumentAtIndex:0];
    NSString * callback = command.callbackId;
    id <CDVCommandDelegate> delegate = self.commandDelegate;
    [self.attributeClient deleteUserAttributes: keys completion: ^(NSError *error) {
        sendAttributeCallback(callback, error, delegate);
    } ];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributesDictionary
- (void)queueSetChannelAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    [self.attributeQueue setChannelAttributes: attributes];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


// Arguments attributesArray
- (void)queueSetUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    [self.attributeQueue setUserAttributes: attributes];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributesArray
- (void)queueUpdateChannelAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    [self.attributeQueue updateChannelAttributes: attributes];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributesArray
- (void)queueUpdateUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [command argumentAtIndex:0];
    [self.attributeQueue updateUserAttributes: attributes];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributeKeysArray
- (void)queueDeleteChannelAttributes:(CDVInvokedUrlCommand*)command
{
    NSArray * keys = [command argumentAtIndex:0];
    [self.attributeQueue deleteChannelAttributes: keys];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributeKeysArray
- (void)queueDeleteUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSArray * keys = [command argumentAtIndex:0];
    [self.attributeQueue deleteUserAttributes: keys];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments: type, name, timestamp, attributes, attribution, immediate
- (void)queueAddEvent:(CDVInvokedUrlCommand*)command
{
    NSMutableDictionary * eventDictionary = [[command argumentAtIndex:0] mutableCopy];
    if(eventDictionary[@"timestamp"])
        eventDictionary[@"timestamp"] = [NSDate dateWithTimeIntervalSince1970: [eventDictionary[@"timestamp"] doubleValue]/1000];;
    
    MCEEvent * event = [[MCEEvent alloc]init];
    [event fromDictionary:eventDictionary];
    
    NSNumber * immediate = [command argumentAtIndex:1];
    if(!immediate)
        immediate=@YES;
    [[MCEEventService sharedInstance] addEvent: event immediate: [immediate boolValue]];
}

// Arguments: type, name, timestamp, attributes, attribution, immediate
- (void)addEvent:(CDVInvokedUrlCommand*)command
{
    NSMutableDictionary * eventDictionary = [[command argumentAtIndex:0] mutableCopy];
    if(eventDictionary[@"timestamp"])
        eventDictionary[@"timestamp"] = [NSDate dateWithTimeIntervalSince1970: [eventDictionary[@"timestamp"] doubleValue]/1000];;
    
    MCEEvent * event = [[MCEEvent alloc]init];
    [event fromDictionary:eventDictionary];
    
    [self.eventClient sendEvents:@[event] completion:^(NSError* error) {
        CDVPluginResult * result = nil;
        if(error)
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString: [error localizedDescription]];
        else
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

// Arguments badge
- (void)setBadge:(CDVInvokedUrlCommand*)command
{
    id version = [command argumentAtIndex: 0];
    int intVersion = [version intValue];
    UIApplication * app = [UIApplication sharedApplication];
    app.applicationIconBadgeNumber = intVersion;
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments icon
- (void)setIcon:(CDVInvokedUrlCommand*)command
{
    NSLog(@"setIcon unimplemented in iOS");
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"unimplemented in iOS"];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end

void sendAttributeCallback(NSString* callback, NSError*error, id <CDVCommandDelegate> delegate)
{
    if(callback)
    {
        CDVPluginResult* result = nil;
        if(error)
        {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString: error.description];
        }
        else
        {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        }
        result.keepCallback = @TRUE;        
        [delegate sendPluginResult:result callbackId:callback];
    }
}

