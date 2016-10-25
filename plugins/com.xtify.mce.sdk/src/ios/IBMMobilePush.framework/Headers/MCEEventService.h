/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import <Foundation/Foundation.h>
#import "MCEEvent.h"
#import "MCESingleton.h"

@class MCEResultSet, MCEInboxMessage;

/** The MCEEventService class is used to add events to the event queue and to flush the queue.
 
 ### Parent Class
 MCESingleton handles singleton object creation and retrieval. Singleton objects of subclasses of MCESingleton can be retrieved via the sharedInstance method.
*/
@interface MCEEventService : MCESingleton

/** The addEvent:immediate: method is used to add an event to the event queue and optionally flush the queue.
 
 @param event An instance of MCEEvent to be added to the event queue
 @param immediate When sent to TRUE the queue will flush immediately sending all events queued
*/
- (void) addEvent: (MCEEvent *) event immediate:(BOOL) immediate;

/** The sendEvents method flushes the queue to the server on demand */
- (void) sendEvents;

/** Record a view of an inbox message */
-(void)recordViewForInboxMessage:(MCEInboxMessage*)inboxMessage attribution: (NSString*)attribution;

/** Record if push is enabled or disabled */
-(void)sendPushEnabledEvent;

@end
