/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import "MCESingleton.h"

@class MCETaskQueue;

/** The MCEAttributesQueueManager class allows the developer to queue attribute updates to the server. If errors occur the update will retry automatically and back-off as needed.
 
 ### Parent Class
 MCESingleton handles singleton object creation and retrieval. Singleton objects of subclasses of MCESingleton can be retrieved via the sharedInstance method.
 */

@interface MCEAttributesQueueManager : MCESingleton

/** The attributeQueue method returns the current task queue object that processes updates sent to this class */
- (MCETaskQueue*) attributesQueue;

/** @name Channel Methods */

/** The setChannelAttributes method will replace all the channel attributes on the server with the specified set of attribute key value pairs 
 
 When the operation completes successfully it will send a NSNotification with the name SetChannelAttributesSuccess.
 When the operation fails it will send a NSNotification with the name SetChannelAttributesError, however it will automatically retry as needed.
 */
-(void)setChannelAttributes:(NSDictionary*)attributes;

/** The updateChannelAttributes method will add or update the specified attributes to the channel record on the server 
 
 When the operation completes successfully it will send a NSNotification with the name UpdateChannelAttributesSuccess.
 When the operation fails it will send a NSNotification with the name UpdateChannelAttributesError, however it will automatically retry as needed.
*/
-(void)updateChannelAttributes:(NSDictionary*)attributes;

/** The deleteChannelAttributes method will remove the specified keys from the channel record on the server 
 
 When the operation completes successfully it will send a NSNotification with the name DeleteChannelAttributesSuccess.
 When the operation fails it will send a NSNotification with the name DeleteChannelAttributesError, however it will automatically retry as needed.
*/
-(void)deleteChannelAttributes:(NSArray*) keys;

/** @name User Methods */

/** The setUserAttributes method will replace all the user attributes on the server with the specified set of attribute key value pairs 
 
 When the operation completes successfully it will send a NSNotification with the name SetUserAttributesSuccess.
 When the operation fails it will send a NSNotification with the name SetUserAttributesError, however it will automatically retry as needed.
*/
-(void)setUserAttributes:(NSDictionary*)attributes;

/** The updateUserAttributes method will add or update the specified attributes to the user record on the server 
 
 When the operation completes successfully it will send a NSNotification with the name UpdateUserAttributesSuccess.
 When the operation fails it will send a NSNotification with the name UpdateUserAttributesError, however it will automatically retry as needed.
*/
-(void)updateUserAttributes:(NSDictionary*)attributes;

/** The deleteUserAttributes method will remove the specified keys from the user record on the server 
 
 When the operation completes successfully it will send a NSNotification with the name DeleteUserAttributesSuccess.
 When the operation fails it will send a NSNotification with the name DeleteUserAttributesError, however it will automatically retry as needed.
*/
-(void)deleteUserAttributes:(NSArray*) keys;

@end