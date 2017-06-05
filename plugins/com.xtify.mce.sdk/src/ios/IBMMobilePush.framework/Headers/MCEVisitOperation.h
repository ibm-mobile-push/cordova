/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2017, 2017
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

@import Foundation;

@class MCEDatabase;

@interface MCEVisitOperation : NSObject <NSCopying>

@property NSString * name;
@property NSString * mapReduceSql;
@property NSString * divisorSql;
@property NSMutableDictionary * results;

+ (void) createTableWithDatabase:(MCEDatabase*)db;
+(NSArray*)operationsWithDatabase:(MCEDatabase*)db;
-(void)executeOperationWithDatabase:(MCEDatabase*)db;
+(NSDictionary*)scorePlacesWithDatabase:(MCEDatabase*)db;

+(MCEVisitOperation*)operationNamed: (NSString*)name withDatabase:(MCEDatabase*)db;
@end
