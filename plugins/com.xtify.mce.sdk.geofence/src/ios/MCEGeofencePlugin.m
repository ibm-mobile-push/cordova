/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCEGeofencePlugin.h"
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import <IBMMobilePush/MCELocationDatabase.h>

@implementation MCEGeofencePlugin

- (void) geofenceEnabled:(CDVInvokedUrlCommand*)command
{
    MCEConfig* config = [[MCESdk sharedInstance] config];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool: config.geofenceEnabled];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) geofencesNear:(CDVInvokedUrlCommand*)command
{
    NSNumber * latitude = [command argumentAtIndex:0];
    NSNumber * longitude = [command argumentAtIndex:1];
    NSNumber * radius = [command argumentAtIndex:2];

    NSSet * geofences = [[MCELocationDatabase sharedInstance] geofencesNearLatitude: [latitude doubleValue] longitude: [longitude doubleValue] radius: [radius doubleValue]];

    NSMutableArray * geofenceArray = [NSMutableArray array];
    for(CLCircularRegion * geofence in geofences)
    {
        [geofenceArray addObject: @{ @"latitude": @(geofence.center.latitude), @"longitude": @(geofence.center.longitude), @"radius": @(geofence.radius) } ];
    }

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray: geofenceArray];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) setGeofenceEnterCallback:(CDVInvokedUrlCommand*)command
{
    [[NSNotificationCenter defaultCenter]addObserverForName:EnteredGeofence object:nil queue:[NSOperationQueue mainQueue] usingBlock: ^(NSNotification*note){
        CLCircularRegion * region = note.userInfo[@"region"];
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: @{ @"latitude": @(region.center.latitude), @"longitude": @(region.center.longitude), @"radius": @(region.radius), @"locationId": region.identifier } ];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void) setGeofenceExitCallback:(CDVInvokedUrlCommand*)command
{
    [[NSNotificationCenter defaultCenter]addObserverForName:ExitedGeofence object:nil queue:[NSOperationQueue mainQueue] usingBlock: ^(NSNotification*note){
    
        CLCircularRegion * region = note.userInfo[@"region"];
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: @{ @"latitude": @(region.center.latitude), @"longitude": @(region.center.longitude), @"radius": @(region.radius), @"locationId": region.identifier } ];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

@end
