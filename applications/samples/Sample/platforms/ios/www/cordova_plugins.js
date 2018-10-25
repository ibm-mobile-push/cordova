cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-actionsheet/www/ActionSheet.js",
        "id": "cordova-plugin-actionsheet.ActionSheet",
        "pluginId": "cordova-plugin-actionsheet",
        "clobbers": [
            "window.plugins.actionsheet"
        ]
    },
    {
        "file": "plugins/cordova-plugin-email-composer/www/email_composer.js",
        "id": "cordova-plugin-email-composer.EmailComposer",
        "pluginId": "cordova-plugin-email-composer",
        "clobbers": [
            "cordova.plugins.email",
            "plugin.email"
        ]
    },
    {
        "id": "skwas-cordova-plugin-datetimepicker.DateTimePicker",
        "file": "plugins/skwas-cordova-plugin-datetimepicker/www/datetimepicker.js",
        "pluginId": "skwas-cordova-plugin-datetimepicker",
        "clobbers": [
            "cordova.plugins.DateTimePicker"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-plugin-statusbar": "2.1.2",
    "cordova-plugin-actionsheet": "2.2.2",
    "cordova-plugin-email-composer": "0.8.3",
    "skwas-cordova-plugin-datetimepicker": "1.1.3"
};
// BOTTOM OF METADATA
});