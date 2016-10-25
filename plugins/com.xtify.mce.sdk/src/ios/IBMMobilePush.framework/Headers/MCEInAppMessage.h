/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2015
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import <Foundation/Foundation.h>

@class MCEResultSet;

/** The MCEInAppMessage class represents a single in app message. */
@interface MCEInAppMessage : NSObject

/** The inAppMessageId property is an auto incrementing unique identifier for in app messages. */
@property NSInteger inAppMessageId;

/** The maxViews property defines the maxiumum number of times a message should be viewed, after which it is deleted. */
@property NSInteger maxViews;

/** The numViews property defines the current view count for a message. */
@property NSInteger numViews;

/** The template property defines what registered template should display this message. */
@property NSString * template;

/** The content property defines the content of the message, it's structure and values are defined by the developer of the template that displays the message. */
@property NSDictionary * content;

/** The triggerDate property defines when the message can be initially shown to the user. After this date the message will show up in listings of available messages, before this date the message will not show up in listings of available messages. */
@property NSDate * triggerDate;

/** The expirationDate property defines the end date of availablity of showing the message. After this date is passed the message will no longer show in listings of available messages. */
@property NSDate * expirationDate;

/** The rules property defines what specific keyword rules this message will show up under. */
@property NSArray * rules;

@property NSString * attribution;

/** The inAppMessageFromResultSet: method allocates and constructs a MCEInAppMessage object from a database result set. 
 
 @param resultSet The resultSet parameter is a database result set object from the inAppMessage table.
 @return Returns a fully allocatated and initialized MCEInAppMessage object.
 */
+(instancetype) inAppMessageFromResultSet:(MCEResultSet*)resultSet;

/** The initFromResultSet: method constructs a MCEInAppMessage object from a database result set. 
 
 @param resultSet The resultSet parameter is a database result set object from the inAppMessage table.
 @return Returns a fully initialized MCEInAppMessage object.
 */
-(instancetype) initFromResultSet:(MCEResultSet*)resultSet;

/** The inAppMessageWithPayload: method allocates and constructs a MCEInAppMessage object from a APNS payload. 
 
 @param payload An APNS payload containing an MCEInAppMessage definition.
 @return Returns a fully allocatated and initialized MCEInAppMessage object.
 */
+(instancetype) inAppMessageWithPayload:(NSDictionary*)payload;

/** The initWithPayload: method constructs a MCEInAppMessage object from a APNS payload. 

 @param payload An APNS payload containing an MCEInAppMessage definition.
 @return Returns a fully initialized MCEInAppMessage object.
 */
-(instancetype) initWithPayload:(NSDictionary*)payload;

/** The rulesData method returns the rules property as an NSData object for archiving. 
 
 @return Returns an NSData object representing the rules array.
 */
-(NSData*) rulesData;

/** The contentData method returns the content property as an NSData object for archiving. 

 @return Returns an NSData object representing the content dictionary.
 */
-(NSData*) contentData;

/** The execute method queries the MCEInAppTemplateRegistry for a template to display this in app message and tells that template object to display this message. It returns TRUE if it was able to find a template object to display the message and FALSE otherwise. */
-(BOOL) execute;

/** The isExpired method returns TRUE if the current date is greater then the expirationDate property value and FALSE otherwise. */
-(BOOL) isExpired;

/** The isOverViewed method returns TRUE if the numViews property is larger or equal to the maxViews property and FALSE otherwise. */
-(BOOL) isOverViewed;

/** The isTriggered method returns TRUE if the current date is greater then the triggerDate property value and FALSE otherwise. */
-(BOOL) isTriggered;

@end
