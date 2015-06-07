var ble = null;

var luyouBT = {
    // Discovered devices.
    knownDevices: {},

    // Reference to the device we are connecting to.
    connectee: null,

    // Handle to the connected device.
    deviceHandle: null,

    // Handles to characteristics and descriptor for reading and
    // writing data from/to the Arduino using the BLE shield.
    characteristicRead: null,
    characteristicWrite: null,
    descriptorNotification: null,

    startScan: function(bt)
    {
        alert("start scan");
        ble = bt;
        if(ble){
            ble.startScan(
                function(deviceInfo)
                {
                    /*if (luyouBT.knownDevices[deviceInfo.address])
                    {
                        return;
                    }
                    alert('found device: ' + deviceInfo.name);
                    luyouBT.knownDevices[deviceInfo.address] = deviceInfo;*/
                    //alert(deviceInfo.name + " " + (deviceInfo.name === 'HMSoft') + " " + !luyouBT.connectee);
                    /*Object.keys(deviceInfo).forEach(function(key){
                        alert(key + ": " + deviceInfo[key]);
                    });*/
                    //alert('found device: ' + deviceInfo.name);
                    if (deviceInfo.address == '78:A5:04:29:34:78' && !luyouBT.connectee)
                    {
                        //alert('Found HMSoft!');
                        //luyouBT.connectee = deviceInfo;
                        luyouBT.connect(deviceInfo.address);
                    }
                },
                function(errorCode)
                {
                    alert('startScan error: ' + errorCode);
                });
        }
    },

    connect: function(address)
    {
        ble.stopScan();
        //alert('Connecting...');
        evothings.ble.connect(
            address,
            function(connectInfo)
            {
                if (connectInfo.state == 2) // Connected
                {
                    //alert('Connected: ' + connectInfo.deviceHandle);
                    luyouBT.deviceHandle = connectInfo.deviceHandle;
                    luyouBT.getServices(connectInfo.deviceHandle);
                }
            },
            function(errorCode)
            {
                //alert('connect error: ' + errorCode);
                luyouBT.connect(address);
            });
    },

    getServices: function(deviceHandle)
    {
        //alert('Reading services...');

        evothings.ble.readAllServiceData(deviceHandle, function(services)
        {
            // Find handles for characteristics and descriptor needed.
            for (var si in services)
            {
                var service = services[si];

                for (var ci in service.characteristics)
                {
                    var characteristic = service.characteristics[ci];

                    if (characteristic.uuid == '0000ffe1-0000-1000-8000-00805f9b34fb')
                    {
                        //alert("found char 1");
                        luyouBT.characteristicWrite = characteristic.handle;
                        luyouBT.characteristicRead = characteristic.handle;
                    }

                }
            }

            if (luyouBT.characteristicRead && luyouBT.characteristicWrite)
            {
                //alert('RX/TX services found.');
                luyouBT.startReading(deviceHandle);
            }
            else
            {
                alert('ERROR: RX/TX services not found!');
            }
        },
        function(errorCode)
        {
            alert('readAllServiceData error: ' + errorCode);
        });
    },

    startReading: function(deviceHandle){    
        alert("device ready");   
        // Turn notifications on.
        //luyouBT.write(new Uint8Array([1,0]));

        // Start reading notifications.
        evothings.ble.enableNotification(
            deviceHandle,
            luyouBT.characteristicRead,
            function(data)
            {
                //alert("got data type: " +  evothings.ble.fromUtf8(data));
                alert("val: " + String.fromCharCode.apply(null, new Uint8Array(data)));
                //luyouBT.drawLines([new DataView(data).getUint16(0, true)]);
            },
            function(errorCode)
            {
                alert('enableNotification error: ' + errorCode);
            }
        );

    },

    write: function(value)
    {
        //alert("write");
        if (luyouBT.characteristicWrite)
        {
            ble.writeCharacteristic(
                luyouBT.deviceHandle,
                luyouBT.characteristicWrite,
                value,
                function()
                {   
                    //alert("success");
                    alert(value + ' success.');
                },
                function(errorCode)
                {
                    alert('error: ' + errorCode);
                });
        }
    },

    write_left: function(){
        alert("left");
        var arr = new Uint8Array(1);
        arr[0] = 1;
        luyouBT.write(arr);
    },

    write_straight: function(){
        luyouBT.write('S');
    },

    write_right: function(){
        alert("right");
        var arr = new Uint8Array(1);
        arr[0] = 2;
        luyouBT.write(arr);
    }
};