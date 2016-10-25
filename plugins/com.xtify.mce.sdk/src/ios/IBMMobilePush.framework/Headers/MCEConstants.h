/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

/** The MCEConstants header contains several important SDK integration constants */

/** The SDK_VERSION constant contains the current release number */
static NSString * SDK_VERSION = @"3.6.1.3";

/** The RegisteredNotification message is sent via NSNotificationCenter when the SDK registers with the IBM servers */
static NSString * RegisteredNotification = @"RegisteredNotification";

/** The RegistrationChangedNotification message is sent via NSNotificationCenter when the userId or channelId change durring the phone home process */
static NSString * RegistrationChangedNotification = @"RegistrationChangedNotification";

/** The MCEEventSuccess message is sent via NSNotificationCenter when events are successfully sent to the server */
static NSString * MCEEventSuccess = @"MCEEventSuccess";

/** The MCEEventSuccess message is sent via NSNotificationCenter when events fail to send to the server. No action is required by the developer, the system will automatically retry with back-off. */
static NSString * MCEEventFailure = @"MCEEventFailure";

/** The SetUserAttributesError message is sent via NSNotificationCenter when Set User Attributes fails to send to the server. No action is required by the developer, the system will automatically retry with back-off. */
static NSString * SetUserAttributesError = @"SetUserAttributesError";

/** The SetUserAttributesSuccess message is sent via NSNotificationCenter when Set User Attributes is successfully sent to the server */
static NSString * SetUserAttributesSuccess = @"SetUserAttributesSuccess";

/** The UpdateUserAttributesError message is sent via NSNotificationCenter when Update User Attributes fails to send to the server. No action is required by the developer, the system will automatically retry with back-off. */
static NSString * UpdateUserAttributesError = @"UpdateUserAttributesError";

/** The UpdateUserAttributesSuccess message is sent via NSNotificationCenter when Update User Attributes is successfully sent to the server */
static NSString * UpdateUserAttributesSuccess = @"UpdateUserAttributesSuccess";

/** The DeleteUserAttributesError message is sent via NSNotificationCenter when Delete User Attributes fails to send to the server. No action is required by the developer, the system will automatically retry with back-off. */
static NSString * DeleteUserAttributesError = @"DeleteUserAttributesError";

/** The DeleteUserAttributesSuccess message is sent via NSNotificationCenter when Delete User Attributes is successfully sent to the server */
static NSString * DeleteUserAttributesSuccess = @"DeleteUserAttributesSuccess";

/** The SetChannelAttributesError message is sent via NSNotificationCenter when Set Channel Attributes fails to send to the server. No action is required by the developer, the system will automatically retry with back-off. */
static NSString * SetChannelAttributesError = @"SetChannelAttributesError";

/** The SetChannelAttributesSuccess message is sent via NSNotificationCenter when Set Channel Attributes is successfully sent to the server */
static NSString * SetChannelAttributesSuccess = @"SetChannelAttributesSuccess";

/** The UpdateChannelAttributesError message is sent via NSNotificationCenter when Update Channel Attributes fails to send to the server. No action is required by the developer, the system will automatically retry with back-off. */
static NSString * UpdateChannelAttributesError = @"UpdateChannelAttributesError";

/** The UpdateChannelAttributesSuccess message is sent via NSNotificationCenter when Update Channel Attributes is successfully sent to the server */
static NSString * UpdateChannelAttributesSuccess = @"UpdateChannelAttributesSuccess";

/** The DeleteChannelAttributesError message is sent via NSNotificationCenter when Delete Channel Attributes fails to send to the server. No action is required by the developer, the system will automatically retry with back-off. */
static NSString * DeleteChannelAttributesError = @"DeleteChannelAttributesError";

/** The DeleteChannelAttributesSuccess message is sent via NSNotificationCenter when Delete Channel Attributes is successfully sent to the server */
static NSString * DeleteChannelAttributesSuccess = @"DeleteChannelAttributesSuccess";

/* The Event type reported for simple notification actions */
static NSString * SimpleNotificationSource = @"simpleNotification";

/* The Event type reported for inbox notification actions */
static NSString * InboxSource = @"inboxMessage";

/* The Event type reported for inbox notification actions */
static NSString * InAppSource = @"inAppMessage";