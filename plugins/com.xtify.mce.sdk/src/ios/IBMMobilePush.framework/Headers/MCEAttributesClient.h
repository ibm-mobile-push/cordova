/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

//
// Created by Feras on 7/11/13.
// Copyright (c) 2013 Xtify. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MCEClient.h"

/** AttributesCallback is the callback block format for the methods in this class. If an error object is returned the request has failed and will need to be retried if desired.  */
typedef void (^AttributesCallback)(NSError* error);

/** The MCEAttributesClient class can be used to set, update or delete user or channel attributes on the server directly. If an error occurs while this happens, it is the responsibility of the developer to resend the request if desired. If the developer wishes the SDK to handle retries for him, he should use the MCEAttributesQueueManager class instead. */
@interface MCEAttributesClient : MCEClient

/** @name Channel Methods */

/** The setChannelAttributes method will replace all the channel attributes on the server with the specified set of attribute key value pairs */
- (void)setChannelAttributes:(NSDictionary *)attributes completion:(AttributesCallback)callback;

/** The updateChannelAttributes method will add or update the specified attributes to the channel record on the server */
- (void)updateChannelAttributes:(NSDictionary *)attributes completion:(AttributesCallback)callback;

/** The deleteChannelAttributes method will remove the specified keys from the channel record on the server */
- (void)deleteChannelAttributes:(NSArray *)attributeKeys completion:(AttributesCallback)callback;

/** @name User Methods */

/** The setUserAttributes method will replace all the user attributes on the server with the specified set of attribute key value pairs */
- (void)setUserAttributes:(NSDictionary *)attributes completion:(AttributesCallback)callback;

/** The updateUserAttributes method will add or update the specified attributes to the user record on the server */
- (void)updateUserAttributes:(NSDictionary *)attributes completion:(AttributesCallback)callback;

/** The deleteUserAttributes method will remove the specified keys from the user record on the server */
- (void)deleteUserAttributes:(NSArray *)attributeKeys completion:(AttributesCallback)callback;

@end