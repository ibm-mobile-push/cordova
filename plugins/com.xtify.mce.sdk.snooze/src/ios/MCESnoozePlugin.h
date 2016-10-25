/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2011, 2015
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Foundation/Foundation.h>
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVPlugin.h>

@interface MCESnoozePlugin : CDVPlugin
-(void)performAction:(NSDictionary*)action payload:(NSDictionary*)payload;
@end
