/* IBM Confidential
 * OCO Source Materials
 * 5725E28, 5725S01, 5725I03
 * © Copyright IBM Corp. 2017, 2017
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

#if __has_feature(modules)
@import Foundation;
@import CoreLocation;
#else
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#endif

/** The MCEArea class represents a geographic area. */
@interface MCEArea : NSObject

/** radius represents the size of the geographic area from the center to edge in meters */
@property double radius;

/** latitude represents the latitude at the center of the geographic area */
@property (readonly) double latitude;

/** longitude represents the longitude at the center of the geographic area */
@property (readonly) double longitude;

/** coordinate represents the center point of the geographic area */
@property (readonly) CLLocationCoordinate2D coordinate;

@end
