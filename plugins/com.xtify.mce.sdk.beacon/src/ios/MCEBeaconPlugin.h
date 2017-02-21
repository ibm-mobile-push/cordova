/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Cordova/CDVPlugin.h>

@interface MCEBeaconPlugin : CDVPlugin {
    
}

- (void) beaconRegions:(CDVInvokedUrlCommand*)command;
- (void) beaconEnabled:(CDVInvokedUrlCommand*)command;
- (void) setBeaconEnterCallback:(CDVInvokedUrlCommand*)command;
- (void) setBeaconExitCallback:(CDVInvokedUrlCommand*)command;
- (void) beaconUUID:(CDVInvokedUrlCommand*)command;

@end
