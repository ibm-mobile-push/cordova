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

/** The MCEInboxQueueManager class queues and executes tasks serially to the inbox server. */
@interface MCEInboxQueueManager : MCESingleton

/** The inboxQueue method returns the current task queue object that processes updates sent to this class */
- (MCETaskQueue*) inboxQueue;

/** The readMessageId: method will add an read update task to the queue for the specified message id. Once the update task is complete it will send an NSNotification with the name MCESyncDatabase.
 
 @param inboxMessageId The unique identifier of a MCEInboxMessage you wish to update.
 */
-(void)readMessageId:(NSString*)inboxMessageId;

/** The deleteMessageId: method will add a delete task to the queue for the specified message id. Once the delete task is complete it will send an NSNotification with the name MCESyncDatabase.
 
 @param inboxMessageId The unique identifier of a MCEInboxMessage you wish to delete.
 */
-(void)deleteMessageId:(NSString*)inboxMessageId;

/** The syncInbox method adds a sync task to the queue, this will first connect to the server to download inbox message updates, then it will update the local MCEInboxDatabase store. Once that is complete it will send an NSNotification with the name MCESyncDatabase and the MCEInboxTableViewController will refresh its contents. Note, it will only ever add a single sync task to the queue at a time, calling it multiple times while the task is queued or running will not add additional tasks. */
-(void)syncInbox;

@end
