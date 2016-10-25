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

/** MCECompletionCallback is the callback block format for the methods in this class. If an error object is returned the request has failed and will need to be retried if desired.  */
typedef void (^MCECompletionCallback)(NSData *result, NSError* error);

/** The MCEHttp class is used to communicate with web servers via REST methods */
@interface MCEHttp : NSObject

/** The initAsAsync: method initializes the instance as either synchronous or asynchronous
 
 @param isAsync When TRUE the instance will be initialized as asynchronous, when FALSE the instance will be initialized as synchronous
 */
- (id) initAsAsync:(BOOL)isAsync;

/** The asyncClient class method will construct an asynchronous instance of the MCEHttp client and return it */
+ (instancetype)asyncClient;

/** The synchronousClient class method will construct an synchronous instance of the MCEHttp client and return it */
+ (instancetype)synchronousClient;

/** The patch:headers:payload:completion: method sends the PATCH HTTP method to the URL specified
 
 @param url The URL to send the message to
 @param headers The headers to be included in the message
 @param payload The payload to be sent to the server
 @param callback A callback that receives the data sent back from the server, if the error pointer is not null then the request failed and may be retried if desired.
 */
- (void) patch: (NSURL*) url headers:(NSDictionary*)headers payload: (NSDictionary*)payload completion:(MCECompletionCallback)callback;

/** The get:headers:completion: method sends the GET HTTP method to the URL specified
 
 @param url The URL to send the message to
 @param headers The headers to be included in the message
 @param callback A callback that receives the data sent back from the server, if the error pointer is not null then the request failed and may be retried if desired.
 */
- (void) get: (NSURL*) url headers:(NSDictionary*)headers completion:(MCECompletionCallback)callback;

/** The post:headers:payload:completion: method sends the POST HTTP method to the URL specified
 
 @param url The URL to send the message to
 @param headers The headers to be included in the message
 @param payload The payload to be sent to the server
 @param callback A callback that receives the data sent back from the server, if the error pointer is not null then the request failed and may be retried if desired.
 */
- (void) post: (NSURL*) url headers:(NSDictionary*)headers payload: (NSDictionary*)payload completion:(MCECompletionCallback)callback;

/** The put:headers:payload:completion: method sends the PUT HTTP method to the URL specified
 
 @param url The URL to send the message to
 @param headers The headers to be included in the message
 @param payload The payload to be sent to the server
 @param callback A callback that receives the data sent back from the server, if the error pointer is not null then the request failed and may be retried if desired.
 */
- (void) put: (NSURL*) url headers:(NSDictionary*)headers payload: (NSDictionary*)payload completion:(MCECompletionCallback)callback;

/** The delete:headers:payload:completion: method sends the DELETE HTTP method to the URL specified
 
 @param url The URL to send the message to
 @param headers The headers to be included in the message
 @param payload The payload to be sent to the server
 @param callback A callback that receives the data sent back from the server, if the error pointer is not null then the request failed and may be retried if desired.
 */
- (void) delete: (NSURL*)url headers:(NSDictionary*)headers payload: (NSDictionary*)payload completion:(MCECompletionCallback)callback;

/** The buildUrlWithBaseUrl:parts: method assembles URLs based on a base and a set of component parts 
 
 @param baseUrl A URL base, eg http://ibm.com
 @param parts An array of parts to append to the URL eg @[ @"foo", @"bar", @"baz.html" ]
 @return A URL with the base and the appended parts eg http://ibm.com/foo/bar/baz.html
 */
- (NSURL*)buildUrlWithBaseUrl:(NSURL*)baseUrl parts:(NSArray*)parts;

@end
