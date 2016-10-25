/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

extern int mceLogLevel;

/** MCEConfig provides the current configuration of the SDK */
@interface MCEConfig : NSObject

/** sessionTimeout specifies how long sessions last, it can be specified in the MceConfig.plist file. If it is not specified it is 20 minutes by default */
@property NSInteger sessionTimeout;

/** baseUrl specifies where the SDK connects to, it can be specified in the MceConfig.plist file. If it is not specified it is https://api.ibm.com by default */
@property NSURL* baseUrl;

/** appKey specifies which appKey is currently in use, a devAppKey and prodAppKey can be specified in the MceConfig.plist file and will be automatically determined on launch depending on the environment the app is running in. */
@property NSString* appKey;

/** autoInitializeFlag specifies if the SDK should initialize itself automatically or wait until the MCESdk manualInitialization method is called. This could be helpful if you wish to limit the registered users and channels in your database. If not specified, this value is TRUE */
@property BOOL autoInitializeFlag;

/** metricTimeInterval specifies how frequently metrics are sent to the server. If not specified it defaults to 3 minutes */
@property double metricTimeInterval;

/** appDelegateClass specifies which class to forward app delegate calls to if you use the easy integration method. By default it is not specified and will not forward calls in not present in MceConfig.plist */
@property Class appDelegateClass;

/** This method allows the configuration to be initialized with specified values instead of reading from the MceConfig.plist file. 
 
 @param dictionary specifies all configuration values using the same key names expected from the MceConfig.plist file.
 */
- (id)initWithDictionary:(NSDictionary *)dictionary;

@end
