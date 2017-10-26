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
#import <IBMMobilePush/MCESdk.h>

@interface MCELocationPlugin()
@property CLLocationManager * locationManager;
@property NSString * locationAuthCallback;
@end

@implementation MCELocationPlugin

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    if (self.locationAuthCallback) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:self.locationAuthCallback];
    }
}

- (void) setLocationAuthorizationCallback:(CDVInvokedUrlCommand*)command
{
    if(!self.locationManager)
    {
        self.locationManager = [[CLLocationManager alloc]init];
        self.locationManager.delegate = self;
    }
    self.locationAuthCallback = command.callbackId;
}

- (void) manualLocationInitialization:(CDVInvokedUrlCommand*)command
{
    [MCESdk.sharedInstance manualLocationInitialization];
}

- (void) locationAuthorization:(CDVInvokedUrlCommand*)command
{
    switch(CLLocationManager.authorizationStatus)
    {
        case kCLAuthorizationStatusNotDetermined:
        {
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt: 0];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            break;
        }
        case kCLAuthorizationStatusAuthorizedAlways:
        {
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt: 1];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            break;
        }
        case kCLAuthorizationStatusAuthorizedWhenInUse:
        {
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt: -2];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            break;
        }
        default:
        {
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt: -1];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            break;
        }
    }
}

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
