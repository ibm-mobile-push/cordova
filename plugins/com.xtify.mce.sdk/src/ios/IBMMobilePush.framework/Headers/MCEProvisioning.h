/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import <UIKit/UIKit.h>
#import "MCESingleton.h"

/** The MCEProvisioning class reads from the embedded.mobileprovision file in the application package to determine what environment it is currently running on. 
 
 ### Parent Class
 MCESingleton handles singleton object creation and retrieval. Singleton objects of subclasses of MCESingleton can be retrieved via the sharedInstance method.
 */
@interface MCEProvisioning : MCESingleton

/** The certificateExpiration property specifies when the developer certificate expires */
@property NSDate * certificateExpiration;

/** The apnsEnvironment property specifies if the binary is connecting to the "production" or "development" APNS servers */
@property NSString * apnsEnvironment;

/** The binaryEnvironment property specifies if the binary is running in the "debug", "ad-hoc", "enterprise", or "appstore" environment */
@property NSString * binaryEnvironment;

/** The provisionedDevices property specifies which Device UDIDs the binary was provisioned to run on. */
@property NSArray * provisionedDevices;

/** The certificate expired method will return with TRUE if the certificate is expired and FALSE otherwise */
-(BOOL)certificateExpired;
@end
