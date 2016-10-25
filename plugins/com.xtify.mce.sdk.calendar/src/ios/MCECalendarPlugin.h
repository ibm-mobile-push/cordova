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
#import <EventKit/EventKit.h>
#import <EventKitUI/EventKitUI.h>

@interface MCECalendarPlugin : CDVPlugin <EKEventEditViewDelegate>
-(void)performAction:(NSDictionary*)action;
@end
