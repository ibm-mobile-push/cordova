/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import "MCEInboxPlugin.h"
#import <IBMMobilePush/IBMMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import <IBMMobilePush/MCEInboxDatabase.h>

@implementation MCEInboxPlugin

-(void)executeInboxAction: (CDVInvokedUrlCommand*)command
{
    NSDictionary * action = [command argumentAtIndex:0];
    NSString * inboxMessageId = [command argumentAtIndex:1];
    MCEInboxMessage *inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    NSDictionary * payload = @{@"mce":@{@"attribution":inboxMessage.attribution}};
    NSDictionary * attributes = @{@"richContentId": inboxMessage.richContentId, @"inboxMessageId": inboxMessage.inboxMessageId} ;
    [[MCEActionRegistry sharedInstance] performAction:action forPayload:payload source: InboxSource attributes:attributes];
}

-(void)setInboxMessagesUpdateCallback: (CDVInvokedUrlCommand*)command
{
    self.inboxCallback = command.callbackId;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(retrieveInboxMessages:) name:@"MCESyncDatabase" object:nil];
}

-(void)fetchInboxMessageId: (CDVInvokedUrlCommand*)command
{
    NSString* inboxMessageId = [command argumentAtIndex:0];
    
    MCEInboxMessage * inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    if(inboxMessage)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: [self packageInboxMessage: inboxMessage] ];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        });
    }
    else
    {
        __block bool complete = false;
        id observer = [[NSNotificationCenter defaultCenter] addObserverForName:@"MCESyncDatabase" object:nil queue:NSOperationQueue.mainQueue usingBlock:^(NSNotification * _Nonnull note)
                       {
                           MCEInboxMessage * inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
                           if(inboxMessage && !complete)
                           {
                               complete = true;
                               [[NSNotificationCenter defaultCenter] removeObserver:observer];
                               CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: [self packageInboxMessage: inboxMessage] ];
                               [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                           }
                       }];
        
        [[MCEInboxQueueManager sharedInstance] syncInbox];
    }
}

-(NSDictionary*)packageInboxMessage:(MCEInboxMessage*)message
{
    return @{ @"inboxMessageId": message.inboxMessageId, @"richContentId": message.richContentId, @"expirationDate": @([message.expirationDate timeIntervalSince1970]*1000),  @"sendDate": @([message.sendDate timeIntervalSince1970]*1000),  @"template": message.template, @"attribution": message.attribution, @"isRead": @(message.isRead), @"isDeleted": @(message.isDeleted), @"content": message.content };
}

-(void)fetchInboxMessageViaRichContentId:(CDVInvokedUrlCommand*)command;
{
    NSString* richContentId = [command argumentAtIndex:0];
    
    MCEInboxMessage *inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithRichContentId:richContentId];
    if(!inboxMessage)
    {
        NSLog(@"An error occured while getting the rich content");
        return;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self packageInboxMessage:inboxMessage]];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    });
}

-(void)readMessageId:(CDVInvokedUrlCommand*)command
{
    NSString * inboxMessageId = [command argumentAtIndex:0];
    MCEInboxMessage * inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    inboxMessage.isRead=TRUE;
}
-(void)deleteMessageId:(CDVInvokedUrlCommand*)command
{
    NSString * inboxMessageId = [command argumentAtIndex:0];
    MCEInboxMessage * inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    inboxMessage.isDeleted=TRUE;
}

-(void)sendInboxMessages:(NSArray*)messages
{
    NSMutableArray * simpleMessages = [NSMutableArray array];
    for (MCEInboxMessage * message in messages) {
        [simpleMessages addObject: [self packageInboxMessage: message]];
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:simpleMessages];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:self.inboxCallback];
    });
}

-(void)syncInboxMessages:(CDVInvokedUrlCommand*)command
{
    [[MCEInboxQueueManager sharedInstance] syncInbox];
}

-(void)retrieveInboxMessages:(CDVInvokedUrlCommand*)command
{
    NSArray * inboxMessages = [[MCEInboxDatabase sharedInstance] inboxMessagesAscending:TRUE];
    if(!inboxMessages)
    {
        NSLog(@"Could not fetch inbox messages");
        return;
    }
    [self sendInboxMessages:inboxMessages];
}

@end

