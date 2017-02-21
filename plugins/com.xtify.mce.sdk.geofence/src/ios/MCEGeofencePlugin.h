/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Cordova/CDVPlugin.h>

@interface MCEGeofencePlugin : CDVPlugin {
    
}

- (void) geofencesNear:(CDVInvokedUrlCommand*)command;
- (void) geofenceEnabled:(CDVInvokedUrlCommand*)command;
- (void) setGeofenceEnterCallback:(CDVInvokedUrlCommand*)command;
- (void) setGeofenceExitCallback:(CDVInvokedUrlCommand*)command;

@end
