/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCELocationPlugin.h"
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import <IBMMobilePush/MCELocationDatabase.h>
#import <IBMMobilePush/MCEConstants.h>

@implementation MCELocationPlugin

- (void) setLocationUpdatedCallback:(CDVInvokedUrlCommand*)command
{
    [[NSNotificationCenter defaultCenter]addObserverForName:MCEEventSuccess object:nil queue:[NSOperationQueue mainQueue] usingBlock: ^(NSNotification*note){
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void) syncLocations:(CDVInvokedUrlCommand*)command
{
    [[[MCELocationClient alloc]init] scheduleSync];
}

@end
