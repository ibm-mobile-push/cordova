/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2015, 2015
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import <UIKit/UIKit.h>

/** The MCEAppDelegate class is used for the simple integration method. It replaces the application delegate in main.m and forwards all application delegate calls back to the class specified in MceConfig.plist. This allows for simplified integration by not requiring the developer to specify all the integration points in their application delegate manually. */
@interface MCEAppDelegate : UIResponder <UIApplicationDelegate>

/** This is the instance of the developers application delegate that will be forwarded all calls to the MCEAppDelegate instance */
@property id<UIApplicationDelegate> appDelegate;

@property(nonatomic, strong) UIWindow *window;
@end
