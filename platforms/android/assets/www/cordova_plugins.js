cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/fi.avaus.cordova.geolocation/www/PositionError.js",
        "id": "fi.avaus.cordova.geolocation.PositionError",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/fi.avaus.cordova.geolocation/www/android/GeolocationProxy.js",
        "id": "fi.avaus.cordova.geolocation.GeolocationProxy",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/com.evothings.ble/ble.js",
        "id": "com.evothings.ble.BLE",
        "clobbers": [
            "evothings.ble"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "cordova-plugin-geolocation": "1.0.0",
    "fi.avaus.cordova.geolocation": "0.3.11",
    "com.evothings.ble": "0.0.1"
}
// BOTTOM OF METADATA
});