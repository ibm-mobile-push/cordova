/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2015, 2015
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import <Foundation/Foundation.h>

@class MCEHttp;

/** The MCEClient class is a baseclass that can be used to communicate with web servers. Subclasses can be either initialized as synchronous or asynchronous and will have access to an http client that is configured for their use. */

@interface MCEClient : NSObject

/** The http property is the configured http client that can be used to communicate with servers either synchronously or asynchronously */
@property MCEHttp * http;

/** The initSync method initializes the subclass as a synchronous http client */
-(instancetype)initSync;

/** The initSync method initializes the subclass as an asynchronous http client */
-(instancetype)initAsync;
@end
