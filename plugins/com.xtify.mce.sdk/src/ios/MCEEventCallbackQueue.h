/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <IBMMobilePush/IBMMobilePush.h>

@interface MCEEventCallbackQueue : NSObject

+ (instancetype)sharedInstance;
-(void) queueEvents: (NSArray*)events error: (NSString*)error;
-(void) queueEvents: (NSArray*)events;
-(void) dequeueWithCallback: (void (^)(NSArray * events, NSString * error))callbackBlock;
    
@end
