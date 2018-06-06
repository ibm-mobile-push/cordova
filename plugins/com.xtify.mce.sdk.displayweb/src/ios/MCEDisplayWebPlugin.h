/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2014, 2018
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <Foundation/Foundation.h>
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVPlugin.h>

@interface MCEDisplayWebPlugin : CDVPlugin
-(void)performAction:(NSDictionary*)action payload:(NSDictionary*)payload;
@end
