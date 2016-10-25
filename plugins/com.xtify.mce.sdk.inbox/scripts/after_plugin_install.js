/*
 * Licensed Materials - Property of IBM
 *
 * 5725E28, 5725I03
 *
 * © Copyright IBM Corp. 2015, 2016
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var filestocopy = [
    {"css/inbox_post.css": "css/inbox_post.css"}, 
    {"css/inbox_default.css": "css/inbox_default.css"}, 
    {"css/inbox.css": "css/inbox.css"}, 
    
    {"images/inbox/chevron-down.png": "images/inbox/chevron-down.png"}, 
    {"images/inbox/chevron-down@2x.png": "images/inbox/chevron-down@2x.png"}, 
    {"images/inbox/chevron-down@3x.png": "images/inbox/chevron-down@3x.png"}, 
    
    {"images/inbox/chevron-up.png": "images/inbox/chevron-up.png"}, 
    {"images/inbox/chevron-up@2x.png": "images/inbox/chevron-up@2x.png"}, 
    {"images/inbox/chevron-up@3x.png": "images/inbox/chevron-up@3x.png"}, 

    {"images/inbox/refresh.png": "images/inbox/refresh.png"}, 
    {"images/inbox/refresh@2x.png": "images/inbox/refresh@2x.png"}, 
    {"images/inbox/refresh@3x.png": "images/inbox/refresh@3x.png"}, 

    {"images/inbox/trash.png": "images/inbox/trash.png"}, 
    {"images/inbox/trash@2x.png": "images/inbox/trash@2x.png"}, 
    {"images/inbox/trash@3x.png": "images/inbox/trash@3x.png"}, 
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
