/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import "MCEEvent.h"
#import "MCEClient.h"

/** The EventCallback typedef is the block callback format used by the MCEEventClient class */
typedef void (^EventCallback)(NSError* error);

/** The MCEEventClient class is used to send events directly to the server, If an error occurs while this happens, it is the responsibility of the developer to resend the request if desired. If the developer wishes the SDK to handle retries for him, he should use the MCEEventService class instead. */
@interface MCEEventClient : MCEClient

/** The sendEvents:completion: method is used to send events directly to the server, if an error occurs the developer is responsible for resending the request if desired. */
- (void)sendEvents:(NSArray*)event completion:(EventCallback)callback;

@end
