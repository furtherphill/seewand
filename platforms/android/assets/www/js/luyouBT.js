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
        alert("attempting scan: " );
        ble = bt;
        if(ble){
            alert('Scanning...');
            ble.startScan(
                function(deviceInfo)
                {
                    /*if (luyouBT.knownDevices[deviceInfo.address])
                    {
                        return;
                    }
                    //alert('found device: ' + deviceInfo.name);
                    luyouBT.knownDevices[deviceInfo.address] = deviceInfo;*/
                    alert(deviceInfo.name + " " + (deviceInfo.name === 'HMSoft') + " " + !luyouBT.connectee);
                    if (deviceInfo.name === 'HMSoft' && !luyouBT.connectee)
                    {
                        alert('Found HMSoft!');
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
        alert('Connecting...');
        evothings.ble.connect(
            address,
            function(connectInfo)
            {
                if (connectInfo.state == 2) // Connected
                {
                    alert('Connected: ' + connectInfo.deviceHandle);
                    luyouBT.deviceHandle = connectInfo.deviceHandle;
                    luyouBT.getServices(connectInfo.deviceHandle);
                }
            },
            function(errorCode)
            {
                alert('connect error: ' + errorCode);
                luyouBT.connect(address);
            });
    },

    getServices: function(deviceHandle)
    {
        alert('Reading services...');

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
                        alert("found char 1");
                        luyouBT.characteristicWrite = characteristic.handle;
                        luyouBT.characteristicRead = characteristic.handle;
                    }

                }
            }

            if (luyouBT.characteristicRead && luyouBT.characteristicWrite)
            {
                alert('RX/TX services found.');
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
        alert("start reading");   
        // Turn notifications on.
        luyouBT.write(
            'writeDescriptor',
            deviceHandle,
            luyouBT.characteristicWrite,
            new Uint8Array([1,0]));

        // Start reading notifications.
        evothings.ble.enableNotification(
            deviceHandle,
            luyouBT.characteristicRead,
            function(data)
            {
                alert("Data: " + data);
                //luyouBT.drawLines([new DataView(data).getUint16(0, true)]);
            },
            function(errorCode)
            {
                alert('enableNotification error: ' + errorCode);
            }
        );

    },

    write: function(writeFunc,deviceHandle,handle,value)
    {
        alert("write");
        if (handle)
        {
            alert("handle");
            ble.writeCharacteristic(
                deviceHandle,
                handle,
                value,
                function()
                {   
                    alert("success");
                    //alert(writeFunc + ': ' + handle + ' success.');
                },
                function(errorCode)
                {
                    alert(writeFunc + ': ' + handle + ' error: ' + errorCode);
                });
        }
    }
};