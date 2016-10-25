/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "AppDelegate.h"
#import "MCEPlugin.h"

@interface AppDelegate (mce)

- (void) application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken;
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo;
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler;
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification;
- (void)application:(UIApplication *)application handleActionWithIdentifier:(NSString *)identifier forLocalNotification:(UILocalNotification *)notification completionHandler:(void (^)())completionHandler;

-(void)action:(NSDictionary*)action payload:(NSDictionary*)payload;
-(void)setPlugin:(MCEPlugin*)sender;
-(MCEPlugin*)plugin;
-(BOOL)needsRegistration;
-(void)setNeedsRegistration:(BOOL)value;

@end