/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2015, 2015
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import <Foundation/Foundation.h>

/**  MCESingleton manages singleton object creation and retrieval. Singleton objects of subclasses of MCESingleton can be retrieved via the sharedInstance method.
*/

@interface MCESingleton : NSObject

/** Retrieve or create the singleton instance for this class */
+(instancetype)sharedInstance;

@end
