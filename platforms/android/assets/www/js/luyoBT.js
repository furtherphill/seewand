var ble = null;

var luyoBT = {
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

    setBLE: function(bt){
        ble = bt;
    },

    startScan: function(bt)
    {
        alert("attempting scan: " );
        ble = bt;
        if(ble){
            alert('Scanning...');
            ble.startScan(
                function(deviceInfo)
                {
                    /*if (luyoBT.knownDevices[deviceInfo.address])
                    {
                        return;
                    }
                    //alert('found device: ' + deviceInfo.name);
                    luyoBT.knownDevices[deviceInfo.address] = deviceInfo;*/
                    alert(deviceInfo.name + " " + (deviceInfo.name === 'HMSoft') + " " + !luyoBT.connectee);
                    if (deviceInfo.name === 'HMSoft' && !luyoBT.connectee)
                    {
                        alert('Found HMSoft!');
                        //luyoBT.connectee = deviceInfo;
                        luyoBT.connect(deviceInfo.address);
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
                    luyoBT.deviceHandle = connectInfo.deviceHandle;
                    luyoBT.getServices(connectInfo.deviceHandle);
                }
            },
            function(errorCode)
            {
                alert('connect error: ' + errorCode);
                luyoBT.connect(address);
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
                        luyoBT.characteristicWrite = characteristic.handle;
                        luyoBT.characteristicRead = characteristic.handle;
                    }

                }
            }

            if (luyoBT.characteristicRead && luyoBT.characteristicWrite)
            {
                alert('RX/TX services found.');
                luyoBT.startReading(deviceHandle);
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
        luyoBT.write(
            'writeDescriptor',
            deviceHandle,
            luyoBT.characteristicWrite,
            new Uint8Array([1,0]));

        // Start reading notifications.
        evothings.ble.enableNotification(
            deviceHandle,
            luyoBT.characteristicRead,
            function(data)
            {
                alert("Data: " + data);
                //luyoBT.drawLines([new DataView(data).getUint16(0, true)]);
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