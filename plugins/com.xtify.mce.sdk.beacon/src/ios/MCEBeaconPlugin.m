/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCEBeaconPlugin.h"
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import <IBMMobilePush/MCELocationDatabase.h>

@implementation MCEBeaconPlugin

- (void) beaconEnabled:(CDVInvokedUrlCommand*)command
{
    MCEConfig* config = [[MCESdk sharedInstance] config];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool: config.beaconEnabled];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) beaconUUID:(CDVInvokedUrlCommand*)command
{
    MCEConfig* config = [[MCESdk sharedInstance] config];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: [config.beaconUUID UUIDString] ];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) beaconRegions:(CDVInvokedUrlCommand*)command
{
    NSSet * beacons = [[MCELocationDatabase sharedInstance] beaconRegions];

    NSMutableArray * beaconArray = [NSMutableArray array];
    for(CLBeaconRegion * beacon in beacons)
    {
        [beaconArray addObject: @{ @"major": beacon.major } ];
    }

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray: beaconArray];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) setBeaconEnterCallback:(CDVInvokedUrlCommand*)command
{
    [[NSNotificationCenter defaultCenter]addObserverForName:EnteredBeacon object:nil queue:[NSOperationQueue mainQueue] usingBlock: ^(NSNotification*note){
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: note.userInfo];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void) setBeaconExitCallback:(CDVInvokedUrlCommand*)command
{
    [[NSNotificationCenter defaultCenter]addObserverForName:ExitedBeacon object:nil queue:[NSOperationQueue mainQueue] usingBlock: ^(NSNotification*note){
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: note.userInfo];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

@end
