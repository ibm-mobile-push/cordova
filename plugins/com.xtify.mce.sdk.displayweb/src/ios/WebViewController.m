/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2014, 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#import "WebViewController.h"
#import <IBMMobilePush/IBMMobilePush.h>

@interface WebViewController ()

@end

@implementation WebViewController

-(instancetype)initWithURL:(NSURL*)url;
{
    if(self=[super init])
    {
        const NSInteger toolbarHeight = 44;
        UIScreen * screen = [UIScreen mainScreen];
        NSInteger statusHeight = [UIApplication sharedApplication].statusBarFrame.size.height;
        NSInteger webVerticalOffset = statusHeight + toolbarHeight;
        
        CGRect toolbarFrame = screen.bounds;
        toolbarFrame.size.height = toolbarHeight;
        toolbarFrame.origin.y = statusHeight;
        
        UIToolbar * toolbar = [[UIToolbar alloc] initWithFrame: toolbarFrame];
        [self.view addSubview:toolbar];
        
        UIBarButtonItem * dismiss = [[UIBarButtonItem alloc]initWithBarButtonSystemItem:UIBarButtonSystemItemDone target:self action: @selector(dismiss:)];
        toolbar.items = @[dismiss];
        
        CGRect webFrame = screen.bounds;
        webFrame.origin.y += webVerticalOffset;
        webFrame.size.height -= webVerticalOffset;
        
        UIWebView * webView = [[UIWebView alloc] initWithFrame:webFrame];
        [webView loadRequest: [NSURLRequest requestWithURL: url]];
        [self.view addSubview:webView];
        webView.delegate=self;
        
        self.view.backgroundColor = [UIColor whiteColor];
    }
    return self;
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSLog(@"url: %@", request.URL);
    if([request.URL.scheme isEqual:@"action"])
    {
        int index = [request.URL.lastPathComponent intValue];
        if(self.payload && self.payload[@"web-actions"] && [self.payload[@"web-actions"] count]>=index)
        {
            NSDictionary * action = self.payload[@"web-actions"][index];
            [[MCEActionRegistry sharedInstance] performAction:action forPayload:self.payload source:SimpleNotificationSource];
        }
        
        return FALSE;
    }
    return TRUE;
}

-(IBAction)dismiss:(id)sender
{
    [self dismissViewControllerAnimated:TRUE completion:nil];
}

@end
