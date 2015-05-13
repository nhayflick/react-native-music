//
//  AVPlayerManager.h
//  AwesomeProject
//
//  Created by Nathan Hayflick on 5/12/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <AVFoundation/AVFoundation.h>
#import "RCTBridgeModule.h"
#import "RCTLog.h"

@interface AVPlayerManager : NSObject  <RCTBridgeModule>
@property (nonatomic) AVPlayer *player;

@end

