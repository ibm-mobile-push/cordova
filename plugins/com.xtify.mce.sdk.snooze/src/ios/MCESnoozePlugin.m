/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCESnoozePlugin.h"

@implementation MCESnoozePlugin

-(void)performAction:(NSDictionary*)action payload:(NSDictionary*)payload
{
    NSInteger minutes = [[action valueForKey:@"value"] integerValue];
    NSLog(@"Snooze for %ld minutes", (long)minutes);
    UILocalNotification * notification = [[UILocalNotification alloc] init];
    
    notification.userInfo = payload;
    if(payload[@"aps"][@"category"])
    {
        notification.category = payload[@"aps"][@"category"];
    }

    if(payload[@"aps"][@"sound"])
    {
        notification.soundName = payload[@"aps"][@"sound"];
    }
    
    if(payload[@"aps"][@"badge"])
    {
        notification.applicationIconBadgeNumber = [payload[@"aps"][@"badge"] integerValue];
    }
    
    if([payload[@"aps"][@"alert"] isKindOfClass:[NSDictionary class]] && payload[@"aps"][@"alert"][@"action-loc-key"])
    {
        notification.alertAction = payload[@"aps"][@"alert"][@"action-loc-key"];
        notification.hasAction = true;
    }
    else
    {
        notification.hasAction = false;
    }
    
    NSString * alertBody = [[MCESdk sharedInstance] extractAlert:payload[@"aps"]];
    notification.alertBody = alertBody;

    notification.fireDate = [NSDate dateWithTimeIntervalSinceNow:minutes*60];
    [[UIApplication sharedApplication] scheduleLocalNotification: notification];
}

- (void)pluginInitialize
{
    MCEActionRegistry * registry = [MCEActionRegistry sharedInstance];
    [registry registerTarget: self withSelector:@selector(performAction:payload:) forAction: @"snooze"];
}

@end
