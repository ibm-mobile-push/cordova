/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2014, 2018
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <UIKit/UIKit.h>

@interface WebViewController : UIViewController <UIWebViewDelegate>
-(instancetype)initWithURL:(NSURL*)url;
@property NSDictionary * payload;
@end
