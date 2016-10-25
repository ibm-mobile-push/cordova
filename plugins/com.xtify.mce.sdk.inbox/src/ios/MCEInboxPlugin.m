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
    [[MCEInboxDatabase sharedInstance] fetchInboxMessageId:inboxMessageId completion:^(MCEInboxMessage *inboxMessage, NSError *error) {
        NSDictionary * payload = @{@"mce":@{@"attribution":inboxMessage.attribution}};
        NSDictionary * attributes = @{@"richContentId": inboxMessage.richContentId, @"inboxMessageId": inboxMessage.inboxMessageId} ;
        [[MCEActionRegistry sharedInstance] performAction:action forPayload:payload source: InboxSource attributes:attributes];
    }];
}

-(void)setInboxMessagesUpdateCallback: (CDVInvokedUrlCommand*)command
{
    self.inboxCallback = command.callbackId;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(retrieveInboxMessages:) name:@"MCESyncDatabase" object:nil];
}

-(void)fetchInboxMessageId: (CDVInvokedUrlCommand*)command
{
    NSString* inboxMessageId = [command argumentAtIndex:0];
    
    [[MCEInboxDatabase sharedInstance] fetchInboxMessageId:inboxMessageId completion:^(MCEInboxMessage *inboxMessage, NSError *error) {
        if(error)
        {
            NSLog(@"Could not fetch inbox message");
            return;
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: [self packageInboxMessage: inboxMessage] ];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        });
    }];
}

-(void)fetchRichContentId: (CDVInvokedUrlCommand*)command
{
    NSString* richContentId = [command argumentAtIndex:0];
    
    MCERichContent *richContent = [[MCEInboxDatabase sharedInstance] fetchRichContentId:richContentId];
    if(!richContent)
    {
        NSLog(@"Could not fetch rich content");
        return;
    }
    
    CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self packageRichContent:richContent]];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(NSDictionary*)packageRichContent:(MCERichContent*)richContent
{
    return @{ @"richContentId":richContent.richContentId, @"content": richContent.content };
}

-(NSDictionary*)packageInboxMessage:(MCEInboxMessage*)message
{
    return @{ @"inboxMessageId": message.inboxMessageId, @"richContentId": message.richContentId, @"expirationDate": @([message.expirationDate timeIntervalSince1970]*1000),  @"sendDate": @([message.sendDate timeIntervalSince1970]*1000),  @"template": message.template, @"attribution": message.attribution, @"isRead": @(message.isRead), @"isDeleted": @(message.isDeleted)};
}

-(void)fetchInboxMessageViaRichContentId:(CDVInvokedUrlCommand*)command;
{
    NSString* richContentId = [command argumentAtIndex:0];
    
    [[MCEInboxDatabase sharedInstance] fetchInboxMessageViaRichContentId:richContentId completion:^(MCEInboxMessage *inboxMessage, NSError *error) {
        if(error)
        {
            NSLog(@"An error occured while getting the rich content %@", [error localizedDescription]);
            return;
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self packageInboxMessage:inboxMessage]];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        });
    }];
    
}

-(void)readMessageId:(CDVInvokedUrlCommand*)command
{
    NSString * inboxMessageId = [command argumentAtIndex:0];
    [[MCEInboxDatabase sharedInstance] setReadForInboxMessageId: inboxMessageId];
}
-(void)deleteMessageId:(CDVInvokedUrlCommand*)command
{
    NSString * inboxMessageId = [command argumentAtIndex:0];
    [[MCEInboxDatabase sharedInstance] setDeletedForInboxMessageId: inboxMessageId];
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
    [[MCEInboxDatabase sharedInstance] fetchInboxMessages: ^(NSMutableArray * inboxMessages, NSError * error) {
        if(error)
        {
            NSLog(@"Could not fetch inbox messages");
            return;
        }
        [self sendInboxMessages:inboxMessages];
    } ascending:TRUE];
}

@end
