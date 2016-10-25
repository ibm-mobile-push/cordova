/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2015
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import <UIKit/UIKit.h>
#import "MCESingleton.h"

/** The MCEActionRegistry class is used to register and perform actions in the "notification-action" and "category-actions" sections of the APNS payload.
 
 ### Parent Class
 MCESingleton handles singleton object creation and retrival. Singleton objects of subclasses of MCESingleton can be retrieved via the sharedInstance method.
*/
@interface MCEActionRegistry : MCESingleton

/** This method is used to register an object to receive action messages for a specified action type name
 
 @param target the object that will accept action messages
 @param selector a selector that processes the action, can either take one or two arguments. The first argument is always the action payload and the second, if included is the full APNS payload
 @param action the specified action type name to be used in the APNS payload as the type value
 
 @return TRUE or FALSE depending if the registration was successful or not
 
 */
-(BOOL)registerTarget:(id)target withSelector:(SEL)selector forAction:(NSString*)action;

/** This method performs the registered specified action for the APNS payload
 
 @param action the action dictionary to be executed. (either the "notification-action" or one of the "category-actions")
 @param userInfo the full APNS payload
 @param source the event type value to report
 
 */
-(void)performAction:(NSDictionary*)action forPayload:(NSDictionary*)payload source: (NSString*) source;

/** This method performs the registered specified action for the APNS payload
 
 @param action the action dictionary to be executed. (either the "notification-action" or one of the "category-actions")
 @param userInfo the full APNS payload
 @param source the event type value to report
 @param attributes Additional attributes for event payload
 
 */
-(void)performAction:(NSDictionary*)action forPayload:(NSDictionary*)payload source: (NSString*) source attributes: (NSDictionary*)attributes;

@end
