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
#import "MCESingleton.h"
#import "MCEInAppMessage.h"

/** The MCEInAppManager class owns and interacts with the inApp database.
 
 ### Parent Class
 MCESingleton handles singleton object creation and retrieval. Singleton objects of subclasses of MCESingleton can be retrieved via the sharedInstance method. */
@interface MCEInAppManager : MCESingleton

/** The processPayload: method reads the incoming APNS payload and if it finds an "inApp" block, it adds the inApp message contained to the database.
 
 @param payload The payload parameter is the incoming APNS payload.
 */
-(void) processPayload:(NSDictionary*)payload;

/** The fetchInAppMessagesForRules:completion: method fetches messages from the database that match one of the provided rule keywords and executes the completion block with those messages found. It will not include messages that are expired, over viewed or not yet triggered.
 
 @param rules The rules array includes rule keyword strings to look for.
 @param completion The completion block is executed after the messages are looked up. It includes a list of messages or an error flag.
 */
-(void) fetchInAppMessagesForRules: (NSArray*)rules completion:(void (^)(NSMutableArray * inAppMessages, NSError * error))completion;

/** The incrementView: method increments the number of views in the database for the message provided.
 
 @param inAppMessage The inAppMessage parameter specifies the specific message to increment.
 */
-(void) incrementView:(MCEInAppMessage*)inAppMessage;

/** The executeRule: method finds messages that match the rule keyword strings specified and immediately executes them. 
 
 @param rules The rules array includes rule keyword strings to look for.
 */
-(void) executeRule: (NSArray*)rules;

-(void)disable:(MCEInAppMessage*)inAppMessage;

-(void)disableById:(NSInteger)inAppMessageId;

@end
