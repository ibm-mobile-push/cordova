/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var filestocopy = [
    {"css/inapp_media.css": "css/inapp_media.css"}, 
    {"css/inapp_banner.css": "css/inapp_banner.css"}, 
    {"css/inapp_image.css": "css/inapp_image.css"}, 
    {"css/inapp_video.css": "css/inapp_video.css"}, 

    {"images/inApp/dismiss.png": "images/inApp/dismiss.png"}, 
    {"images/inApp/dismiss@2x.png": "images/inApp/dismiss@2x.png"}, 
    {"images/inApp/dismiss@3x.png": "images/inApp/dismiss@3x.png"}, 

    {"images/inApp/handle.png": "images/inApp/handle.png"}, 
    {"images/inApp/handle@2x.png": "images/inApp/handle@2x.png"}, 
    {"images/inApp/handle@3x.png": "images/inApp/handle@3x.png"}, 
    
    {"images/inApp/cancel.png": "images/inApp/cancel.png"}, 
    {"images/inApp/cancel@2x.png": "images/inApp/cancel@2x.png"}, 
    {"images/inApp/cancel@3x.png": "images/inApp/cancel@3x.png"}, 

    {"images/inApp/comment.png": "images/inApp/comment.png"}, 
    {"images/inApp/comment@2x.png": "images/inApp/comment@2x.png"}, 
    {"images/inApp/comment@3x.png": "images/inApp/comment@3x.png"}, 

    {"images/inApp/note.png": "images/inApp/note.png"}, 
    {"images/inApp/note@2x.png": "images/inApp/note@2x.png"}, 
    {"images/inApp/note@3x.png": "images/inApp/note@3x.png"}, 

    {"images/inApp/notification.png": "images/inApp/notification.png"}, 
    {"images/inApp/notification@2x.png": "images/inApp/notification@2x.png"}, 
    {"images/inApp/notification@3x.png": "images/inApp/notification@3x.png"}, 

    {"images/inApp/offer.png": "images/inApp/offer.png"}, 
    {"images/inApp/offer@2x.png": "images/inApp/offer@2x.png"}, 
    {"images/inApp/offer@3x.png": "images/inApp/offer@3x.png"}, 

    {"images/inApp/store.png": "images/inApp/store.png"}, 
    {"images/inApp/store@2x.png": "images/inApp/store@2x.png"}, 
    {"images/inApp/store@3x.png": "images/inApp/store@3x.png"}, 
];

var fs = require('fs');
var path = require('path');
 
// no need to configure below
var rootdir = process.argv[process.argv.length - 1];
 
filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join("www", val);
        var destdir = path.dirname(destfile);
        
        if(!fs.existsSync(destdir)) {
            console.log("mkdir " + destdir);
            fs.mkdirSync(destdir);
        }
        
        console.log("copying " + srcfile + " to " + destfile);
        if (fs.existsSync(srcfile)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
