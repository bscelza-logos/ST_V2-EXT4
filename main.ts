const i2cAddress = 0x09;  // I2C device address

// Motion type
enum motionType {
    //% block="forward"
    type1 = 1,
    //% block="backward"
    type2 = 2,
    //% block="left"
    type3 = 3,
    //% block="right"
    type4 = 4
}
// Motion type (forward/backward)
enum motionType1 {
    //% block="forward"
    type1 = 5,
    //% block="backward"
    type2 = 6
}
// Motion type (left/right)
enum motionType2 {
    //% block="left"
    type1 = 9,
    //% block="right"
    type2 = 10
}

// Motor selection
enum motorID {
    //% block="1"
    motor0 = 0x50,
    //% block="2"
    motor1 = 0x6E
}

// Single motor direction
enum motorDirection {
    //% block="forward"
    clockwise = 1,
    //% block="reverse"
    counterclockwise = 2
}

// Servo pin
enum ServoPin {
    //% block="P0"
    P0 = DigitalPin.P0,
    //% block="P1"
    P1 = DigitalPin.P1,
    //% block="P2"
    P2 = DigitalPin.P2,
    //% block="P8"
    P8 = DigitalPin.P8,
    //% block="P12"
    P12 = DigitalPin.P12,
    //% block="P13"
    P13 = DigitalPin.P13,
    //% block="P15"
    P15 = DigitalPin.P15,
    //% block="P16"
    P16 = DigitalPin.P16
}
// Rotation direction
enum RotationDirection {
    //% block="clockwise"
    Clockwise = 1,
    //% block="counterclockwise"
    Counterclockwise = -1
}

// LED strip preset colors
enum Colors {
    //% block="red"
    Red = 0xFF0000,
    //% block="orange"
    Orange = 0xFF7F00,
    //% block="yellow"
    Yellow = 0xFFFF00,
    //% block="green"
    Green = 0x00FF00,
    //% block="cyan"
    Cyan = 0x00FFFF,
    //% block="blue"
    Blue = 0x0000FF,
    //% block="purple"
    Purple = 0x7F00FF,
    //% block="white"
    White = 0xFFFFFF,
    //% block="black"
    Black = 0x000000
}





//color="#6CACE4" icon="\uf1e3" block="SmartTEAM 4"
//% color="#6CACE4" icon="\uf1e3" block="SmartTEAM 4"
//% groups=['Cantidad', 'Motion', 'Motor', 'Servo Motor', 'LED Strip', 'Color Sensor', 'Potentiometer', 'Soil Moisture Sensor', 'Joystick', 'Line Tracking Sensor', 'LCD1602', 'others']
namespace SmartTEAM4 {
    //#########################################################################
    //################################## Motion (dual motor) #########################
    //#########################################################################
    //% blockId=motionSpeed
    //% block="move %mtype at speed %mspeed"
    //% group="Motion" weight=9
    //% mspeed.min=-100 mspeed.max=100 mspeed.defl=50
    export function motionSpeed(mtype: motionType, mspeed: number): void {
        if (mspeed > 100) mspeed = 100;
        if (mspeed < -100) mspeed = -100;

        // Invert direction when speed is negative
        let finalType = mtype;
        if (mspeed < 0) {
            switch (mtype) {
                case motionType.type1: 
                    finalType = motionType.type2;
                    break;
                case motionType.type2: 
                    finalType = motionType.type1; 
                    break;
                case motionType.type3: 
                    finalType = motionType.type4; 
                    break;
                case motionType.type4: 
                    finalType = motionType.type3; 
                    break;
            }
        }

        const spAddr = 0x8C + 0x01;// set speed
        mspeed = Math.abs(mspeed);// absolute value
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const regAddr = 0x8C + 0x00;// execute
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motionDistance
    //% block="move %mtype at speed %mspeed for %distance cm"
    //% group="Motion" weight=8
    //% mspeed.min=-100 mspeed.max=100 mspeed.defl=50
    //% distance.min=0 distance.max=1000 distance.defl=10
    export function motionDistance(mtype: motionType1, mspeed: number, distance: number): void {
        if (distance < 0) distance = 0;
        if (distance > 1000) distance = 1000;

        if (mspeed > 100) mspeed = 100;
        if (mspeed < -100) mspeed = -100;

        // Invert direction when speed is negative
        let finalType = mtype;
        if (mspeed < 0) {
            switch (mtype) {
                case motionType1.type1:
                    finalType = motionType1.type2;
                    break;
                case motionType1.type2:
                    finalType = motionType1.type1;
                    break;
            }
        }

        const spAddr = 0x8C + 0x01;// set speed
        mspeed = Math.abs(mspeed);// absolute value
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const disAddr = 0x8C + 0x02;// set distance
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        const regAddr = 0x8C + 0x00;// execute
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // Poll status (blocking)
        basic.pause(100);
        while (true) {
            pins.i2cWriteNumber(i2cAddress, 0x8C + 0x05, NumberFormat.UInt8BE);
            let state = pins.i2cReadNumber(i2cAddress, NumberFormat.UInt8BE);
            if (state == 0) {
                break; 
            }
            basic.pause(20); 
        }
    }
    //% blockId=motionAngle
    //% block="move %mtype at speed %mspeed for %angle °"
    //% group="Motion" weight=7
    //% mspeed.min=-100 mspeed.max=100 mspeed.defl=50
    //% angle.min=0 angle.max=1000 angle.defl=90
    export function motionAngle(mtype: motionType2, mspeed: number, angle: number): void {
        if (angle < 0) angle = 0;
        if (angle > 1000) angle = 1000;

        if (mspeed > 100) mspeed = 100;
        if (mspeed < -100) mspeed = -100;
        // Invert direction when speed is negative
        let finalType = mtype;
        if (mspeed < 0) {
            switch (mtype) {
                case motionType2.type1:
                    finalType = motionType2.type2;
                    break;
                case motionType2.type2:
                    finalType = motionType2.type1;
                    break;
            }
        }

        const spAddr = 0x8C + 0x01;// set speed
        mspeed = Math.abs(mspeed);// absolute value
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const disAddr = 0x8C + 0x04;// set angle
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (angle >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, angle & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        const regAddr = 0x8C + 0x00;// execute
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // Poll status (blocking)
        basic.pause(100);
        while (true) {
            pins.i2cWriteNumber(i2cAddress, 0x8C + 0x05, NumberFormat.UInt8BE);
            let state = pins.i2cReadNumber(i2cAddress, NumberFormat.UInt8BE);
            if (state == 0) {
                break;
            }
            basic.pause(20);
        }
    }
    //% blockId=motionStop
    //% block="stop motion"
    //% group="Motion" weight=6
    export function motionStop(): void {
        const regAddr = 0x8C + 0x00;// execute
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, 0);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motionSetWheel
    //% block="set rotation angle compensation %num \\%"
    //% num.min=-50 num.max=50 num.defl=0
    //% group="Motion" weight=5
    export function motionSetWheel(num:number): void {
        if (num < -50) num = -50;
        if (num > 50) num = 50;
        
        const regAddr = 0x8C + 0x06;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, num);

        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
        basic.pause(50);
    }
    //#########################################################################
    //################################## Single motor #################################
    //#########################################################################
    //% blockId=motorGetSpeed
    //% block="get motor %mID speed"
    //% group="Motor" weight=29
    export function motorGetSpeed(mID: motorID): number {
        // Send command
        const cmdAddr = mID + 0x01;
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
        // Combine 2 bytes into a 16-bit integer
        // let readBuff = pins.createBuffer(2);
        // readBuff = pins.i2cReadBuffer(i2cAddress, 2);
        // let highByte = readBuff.getNumber(NumberFormat.UInt8BE, 0);
        // let lowByte = readBuff.getNumber(NumberFormat.UInt8BE, 1);
        // let speed = ((highByte & 0xFF) << 8) | (lowByte & 0xFF);

        // Read 2-byte data
        let readBuff = pins.createBuffer(2);
        readBuff = pins.i2cReadBuffer(i2cAddress, 2);
        // Parse 2 bytes as signed 16-bit integer
        let speed = readBuff.getNumber(NumberFormat.Int16BE, 0);
        return speed; 
    }
    //% blockId=motorGetAngle
    //% block="get motor %mID encoder value"
    //% group="Motor" weight=28
    export function motorGetAngle(mID: motorID): number {
        // Send command
        const cmdAddr = mID + 0x00;
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // Read 4-byte data (32-bit signed integer)
        let readBuff = pins.createBuffer(4);
        readBuff = pins.i2cReadBuffer(i2cAddress, 4);

        // Parse 4 bytes as signed 32-bit integer
        let angle = readBuff.getNumber(NumberFormat.Int32BE, 0);
        return angle;
    }
    // //% blockId=motorSetSpeed
    // //% block="set motor %mID speed to %speed"
    // //% group="Motor" weight=8
    // //% speed.min=-100 speed.max=100 speed.defl=50
    // export function motorSetSpeed(mID: motorID, speed: number): void {
    //     if (speed > 100) speed = 100;
    //     if (speed < 0) speed = 0;

    //     // set speed
    //     const spAddr = mID + 0x04;
    //     let spBuff = pins.createBuffer(3);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF);
    //     pins.i2cWriteBuffer(i2cAddress, spBuff);
    // }
    //% blockId=motorRun
    //% block="run motor %mID at speed %mspeed"
    //% mspeed.min=-100 mspeed.max=100 mspeed.defl=50
    //% group="Motor" weight=7
    export function motorRun(mID: motorID, mspeed: number): void {
        if (mspeed > 100) mspeed = 100;
        if (mspeed < -100) mspeed = -100;
        // Invert direction when speed is negative
        let finalType = 1;
        if (mspeed < 0) {
            finalType = 2;
        }
        // set speed
        const spAddr = mID + 0x04;
        mspeed = Math.abs(mspeed);// absolute value
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);

        // Send motion command
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motorRunDistance
    //% block="run motor %mID at speed %mspeed for %distance cm"
    //% group="Motor" weight=6
    //% distance.min=0 distance.max=1000 distance.defl=10
    //% mspeed.min=-100 mspeed.max=100 mspeed.defl=50
    //% inlineInputMode = inline
    export function motorRunDistance(mID: motorID, mspeed: number, distance: number): void {
        if (distance < 0) distance = 0;
        if (distance > 1000) distance = 1000;
    
        if (mspeed > 100) mspeed = 100;
        if (mspeed < -100) mspeed = -100;
        // Invert direction when speed is negative
        let finalType = 1;
        if (mspeed < 0) {
            finalType = 2;
        }
        // set speed
        const spAddr = mID + 0x04;
        mspeed = Math.abs(mspeed);// absolute value
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);

        // set distance
        const disAddr = mID + 0x07;
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        // Send motion command
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType + 6);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // Poll status (blocking)
        basic.pause(100);
        while (true) {
            pins.i2cWriteNumber(i2cAddress, mID + 0x09, NumberFormat.UInt8BE);
            let state = pins.i2cReadNumber(i2cAddress, NumberFormat.UInt8BE);
            if (state == 0) {
                break;
            }
            basic.pause(20);
        }
    }

    //% blockId=motorRunAngle
    //% block="run motor %mID at speed %mspeed %angle °"
    //% group="Motor" weight=5
    //% angle.min=0 angle.max=3600 angle.defl=90
    //% mspeed.min=-100 mspeed.max=100 mspeed.defl=50
    //% inlineInputMode = inline
    export function motorRunAngle(mID: motorID, mspeed: number, angle: number): void {
        if (angle < 0) angle = 0;
        if (angle > 3600) angle = 3600;

        if (mspeed > 100) mspeed = 100;
        if (mspeed < -100) mspeed = -100;
        // Invert direction when speed is negative
        let finalType = 1;
        if (mspeed < 0) {
            finalType = 2;
        }
        // set speed
        const spAddr = mID + 0x04;
        mspeed = Math.abs(mspeed);// absolute value
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);

        // set angle offset
        const disAddr = mID + 0x06;
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (angle >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, angle & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        // Send motion command
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType + 4);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // Poll status (blocking)
        basic.pause(100);
        while (true) {
            pins.i2cWriteNumber(i2cAddress, mID + 0x09, NumberFormat.UInt8BE);
            let state = pins.i2cReadNumber(i2cAddress, NumberFormat.UInt8BE);
            if (state == 0) {
                break;
            }
            basic.pause(20);
        }
    }

    // //% blockId=motorRunSpeed
    // //% block="run motor %mID go %direction at speed %speed"
    // //% group="Motor" weight=4
    // //% speed.min=0 speed.max=100 speed.defl=50
    // export function motorRunSpeed(mID: motorID, direction: motorDirection, speed: number): void {
    //     if (speed > 100) speed = 100;
    //     if (speed < 0) speed = 0;

    //     // set speed
    //     const spAddr = mID + 0x04;
    //     let spBuff = pins.createBuffer(3);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF);
    //     pins.i2cWriteBuffer(i2cAddress, spBuff);
    //     // Send motion command
    //     const cmdAddr = mID + 0x03;
    //     let cmdBuff = pins.createBuffer(2);
    //     cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
    //     cmdBuff.setNumber(NumberFormat.UInt8BE, 1, direction);
    //     pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    // }
    //% blockId=motorStop
    //% block="stop motor %mID"
    //% group="Motor" weight=3
    export function motorStop(mID: motorID): void {
        // Send stop motion command
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, 0);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }

    //% blockId=motorSetPerimeter
    //% block="set motor %mID compensation %num \\%"
    //% num.min=-50 num.max=50 num.defl=0
    //% group="Motor" weight=2
    export function motorSetPerimeter(mID: motorID,num:number): void {
        if (num < -50) num = -50;
        if (num > 50) num = 50;
        // Send perimeter compensation command
        const cmdAddr = mID + 0x0B;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, num);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
        basic.pause(50);
    }

    //#########################################################################
    //################################## Servo #################################
    //#########################################################################

    //% blockId=servo1Set
    //% block="set 180° servo %pin to %value °"
    //% value.min=0 value.max=180 value.defl=90
    //% group="Servo Motor" weight=9
    export function servo1Set(pin: ServoPin, value: number): void {
        pins.servoWritePin(pin, value)
    }

    //% blockId=servo1Stop
    //% block="stop 180° servo %pin"
    //% group="Servo Motor" weight=6
    export function servo1Stop(pin: ServoPin): void {
        pins.digitalWritePin(pin, 0)
    }

    //% blockId=servo360Run
    //% block="run 360° servo %pin at speed %speed %direction"
    //% speed.min=0 speed.max=100 speed.defl=50
    //% group="Servo Motor" weight=5
    export function servo360Run(pin: ServoPin, speed: number, direction: RotationDirection ): void {
        // Clamp speed range
        speed = Math.min(100, Math.max(0, speed))

        if (speed > 0 && speed<30){
            speed = 30
        }

        // Calculate pulse width
        // Center: 1.5ms (1500µs) = stop
        // Clockwise: 1.0ms (500µs) = full speed counterclockwise
        // Counterclockwise: 2.0ms (2500µs) = full speed clockwise
        let pulseWidth: number

        if (speed === 0) {
            pulseWidth = 1500
        } else {
            if (direction === RotationDirection.Clockwise) {
                // 500-1500µs maps to speed 0-100
                pulseWidth = 1500 - (speed * 10)
            } else {
                // 1000-2500µs maps to speed 0-100
                pulseWidth = 1500 + (speed * 10)
            }
        }
        // Set pulse width
        pins.servoSetPulse(pin, pulseWidth)
    }
    // //% blockId=servo360_run_with_duration
    // //% block="run 360° servo %pin  %speed %direction for %duration s"
    // //% expandableArgumentMode="enabled"
    // //% speed.min=0 speed.max=100 speed.defl=50
    // //% duration.min=0 duration.max=100 duration.defl=1

    // //% group="Servo Motor" weight=4
    // export function runServo360ForDuration(pin: ServoPin, speed: number, direction: RotationDirection, duration: number): void {
    //     // Start servo
    //     runServo360(pin, speed, direction)

    //     // Wait for specified duration
    //     basic.pause(duration * 1000)

    //     // Stop servo
    //     servo360Stop(pin)
    // }

    //% blockId=servo360Stop
    //% block="stop 360° servo %pin"
    //% group="Servo Motor" weight=3
    export function servo360Stop(pin: ServoPin): void {
        // Set pulse width to 1.5ms to stop
        pins.servoSetPulse(pin, 1500)
    }
    
    //#########################################################################
    //################################## LED strip #################################
    //#########################################################################
    // RGB LED controller
    class WS2812BStrip {
        private buffer: Buffer
        private pin: DigitalPin
        private length: number
        private brightness: number = 128

        constructor(pin: DigitalPin, length: number) {
            this.pin = pin
            this.length = length
            this.buffer = pins.createBuffer(length * 3)// 3 bytes per LED (RGB)
            pins.digitalWritePin(pin, 0)// Initialize pin
        }

        // Set RGB color for a single LED
        setPixelColor(index: number, rgb: number): void {
            if (index < 0 || index >= this.length) return

            let r = (rgb >> 16) & 0xFF
            let g = (rgb >> 8) & 0xFF
            let b = rgb & 0xFF

            // Apply brightness
            if (this.brightness < 255) {
                r = (r * this.brightness) >> 8
                g = (g * this.brightness) >> 8
                b = (b * this.brightness) >> 8
            }

            let offset = index * 3
            // WS2812B uses GRB order
            this.buffer[offset] = g     // G
            this.buffer[offset + 1] = r // R
            this.buffer[offset + 2] = b // B
        }

        // Show all LEDs
        show(): void {
            ws2812b.sendBuffer(this.buffer, this.pin)
        }

        // Clear all LEDs
        clear(): void {
            for (let i = 0; i < this.buffer.length; i++) {
                this.buffer[i] = 0
            }
        }

        // Set brightness
        setBrightness(brightness: number): void {
            this.brightness = Math.min(255, Math.max(0, brightness))
        }
    }

    // Global state for the current LED strip
    let currentStrip: WS2812BStrip
    let currentLEDCount: number = 8

    //% blockId=ws2812b_init
    //% block="init strip pin %pin with %ledCount LEDs"
    //% ledCount.min=1 ledCount.max=50 ledCount.defl=8
    //% group="LED Strip" weight=9
    export function initStrip(pin: ServoPin, ledCount: number): void {
        currentStrip = new WS2812BStrip(pin as number, ledCount)
        currentLEDCount = ledCount
    }

    //% blockId=ws2812b_set_brightness
    //% block="set brightness %brightness"
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    //% group="LED Strip" weight=8
    export function setBrightness(brightness: number): void {
        if (currentStrip) {
            currentStrip.setBrightness(brightness)
        }
    }

    //% blockId=ws2812b_set_all
    //% block="set all LEDs to %color"
    //% group="LED Strip" weight=7
    export function setAllColor(color: Colors): void {
        if (currentStrip) {
            for (let i = 0; i < currentLEDCount; i++) {
                currentStrip.setPixelColor(i, color)
            }
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_set_all_rgb
    //% block="set all LEDs to R %red G %green B %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=0
    //% blue.min=0 blue.max=255 blue.defl=0
    //% group="LED Strip" weight=6
    export function setAllRGB(red: number, green: number, blue: number): void {
        if (currentStrip) {
            let rgb = (red << 16) | (green << 8) | blue
            for (let i = 0; i < currentLEDCount; i++) {
                currentStrip.setPixelColor(i, rgb)
            }
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_set_led
    //% block="set LED %index to %color"
    //% index.min=0 index.defl=0
    //% group="LED Strip" weight=5
    export function setLEDColor(index: number, color: Colors): void {
        if (currentStrip && index >= 0 && index < currentLEDCount) {
            currentStrip.setPixelColor(index, color)
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_set_led_rgb
    //% block="set LED %index to R %red G %green B %blue"
    //% index.min=0 index.defl=0
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=0
    //% blue.min=0 blue.max=255 blue.defl=0
    //% inlineInputMode=inline
    //% group="LED Strip" weight=4
    export function setLEDRGB(index: number, red: number, green: number, blue: number): void {
        if (currentStrip && index >= 0 && index < currentLEDCount) {
            let rgb = (red << 16) | (green << 8) | blue
            currentStrip.setPixelColor(index, rgb)
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_clear
    //% block="clear all LEDs"
    //% group="LED Strip" weight=3
    export function clearAll(): void {
        if (currentStrip) {
            currentStrip.clear()
            currentStrip.show()
        }
    }


}
