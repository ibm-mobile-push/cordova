/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import "MCEDisplayWebPlugin.h"
#import "WebViewController.h"

@implementation MCEDisplayWebPlugin

-(void)performAction:(NSDictionary*)action payload:(NSDictionary*)payload
{
    WebViewController * viewController = [[WebViewController alloc] initWithURL:[NSURL URLWithString:action[@"value"]]];
    viewController.payload=payload;
    UIWindow * window = [[UIApplication sharedApplication] keyWindow];
    [window.rootViewController presentViewController:viewController animated:TRUE completion:nil];
}

- (void)pluginInitialize
{
    MCEActionRegistry * registry = [MCEActionRegistry sharedInstance];
    [registry registerTarget: self withSelector:@selector(performAction:payload:) forAction: @"displayWebView"];
}

@end
