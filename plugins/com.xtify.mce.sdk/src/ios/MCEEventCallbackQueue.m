/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCEEventCallbackQueue.h"

@interface MCEEventCallbackQueue()
@property NSOperationQueue *serialQueue;
@end

@implementation MCEEventCallbackQueue

+ (instancetype)sharedInstance
{
    static id sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

-(instancetype)init
{
    if(self=[super init])
    {
        self.serialQueue = [[NSOperationQueue alloc] init];
        [self.serialQueue setMaxConcurrentOperationCount:1];
    }
    return self;
}

-(void) queueEvents: (NSArray*)events error: (NSString*)error
{
    [self.serialQueue addOperationWithBlock:^{
        NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
        NSMutableArray * eventCallbackQueue = [[defaults objectForKey:@"eventCallbackQueue"] mutableCopy];
        
        NSMutableArray * dictionaryEvents = [NSMutableArray array];
        for (MCEEvent * event in events)
        {
            [dictionaryEvents addObject:[event toDictionary]];
        }
        
        NSMutableDictionary * item = [NSMutableDictionary dictionary];
        item[@"events"] = dictionaryEvents;
        if(error)
        {
            item[@"error"]=error;
        }
        
        [defaults setObject:eventCallbackQueue forKey:@"eventCallbackQueue"];
        [defaults synchronize];
    }];
}

-(void) queueEvents: (NSArray*)events
{
    [self queueEvents:events error:nil];
}

-(void) dequeueWithCallback: (void (^)(NSArray * events, NSString * error))callbackBlock
{
    [self.serialQueue addOperationWithBlock:^{
        NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
        NSMutableArray * eventCallbackQueue = [[defaults objectForKey:@"eventCallbackQueue"] mutableCopy];
        NSDictionary * item = [eventCallbackQueue lastObject];
        
        NSMutableArray * events = [NSMutableArray array];
        for(NSDictionary * eventDict in item[@"events"])
        {
            MCEEvent * event = [[MCEEvent alloc]init];
            [event fromDictionary:eventDict];
            [events addObject:event];
        }
        callbackBlock(events, item[@"error"]);
        
        [eventCallbackQueue removeLastObject];
        [defaults setObject:eventCallbackQueue forKey:@"eventCallbackQueue"];
        [defaults synchronize];
    }];
}

@end
