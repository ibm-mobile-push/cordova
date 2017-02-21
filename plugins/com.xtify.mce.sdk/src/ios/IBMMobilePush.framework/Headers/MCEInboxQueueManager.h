/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

@class MCETaskQueue;

/** The MCEInboxQueueManager class queues and executes tasks serially to the inbox server. */
@interface MCEInboxQueueManager : NSObject

/** This method returns the singleton object of this class. */
+ (instancetype)sharedInstance;

/** The inboxQueue method returns the current task queue object that processes updates that are sent to this class. */
- (MCETaskQueue*) inboxQueue;

/** The readMessageId: method adds an read update task to the queue for the specified message ID. After the update task is complete, it sends an NSNotification with the MCESyncDatabase name.
 
 @param inboxMessageId The unique identifier of a MCEInboxMessage that you want to update.
 */
-(void)readMessageId:(NSString*)inboxMessageId;

/** The deleteMessageId: method adds a delete task to the queue for the specified message ID. After the delete task is complete, it sends an NSNotification with the MCESyncDatabase name.
 
 @param inboxMessageId The unique identifier of a MCEInboxMessage that you want to delete.
 */
-(void)deleteMessageId:(NSString*)inboxMessageId;

/** The syncInbox method adds a sync task to the queue. First, it connects to the server to download inbox message updates. Next, it updates the local MCEInboxDatabase store. After the update is complete, it sends an NSNotification with the MCESyncDatabase name, and the MCEInboxTableViewController refreshes its contents. Note - only a single sync task is added to the queue at a time. Additional tasks are not added regardless if you make multiple calls while the task is queued or running. */
-(void)syncInbox;

@end
