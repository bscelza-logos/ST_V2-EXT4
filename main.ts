const i2cAddress = 0x09;  // I2C设备地址

// 运动类型
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
// 运动类型(前后)
enum motionType1 {
    //% block="forward"
    type1 = 5,
    //% block="backward"
    type2 = 6
}
// 运动类型(左右)
enum motionType2 {
    //% block="left"
    type1 = 9,
    //% block="right"
    type2 = 10
}

// 选择控制的电机
enum motorID {
    //% block="1"
    motor0 = 0x50,
    //% block="2"
    motor1 = 0x6E
}

// 单电机运动方向
enum motorDirection {
    //% block="forward"
    clockwise = 1,
    //% block="reverse"
    counterclockwise = 2
}

//舵机端口
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
//转动方向
enum RotationDirection {
    //% block="clockwise"
    Clockwise = 1,
    //% block="counterclockwise"
    Counterclockwise = -1
}

// 灯条预定义颜色
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





//color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
//% color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
namespace FIFAbit {
    //#########################################################################
    //################################## 运动（双电机）#########################
    //#########################################################################
    //% blockId=motionSpeed
    //% block="move %mtype at speed %mspeed"
    //% group="Motion" weight=9
    //% mspeed.min=-100 mspeed.max=100 mspeed.defl=50
    export function motionSpeed(mtype: motionType, mspeed: number): void {
        if (mspeed > 100) mspeed = 100;
        if (mspeed < -100) mspeed = -100;

        // 根据速度正负决定是否反转方向
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

        const spAddr = 0x8C + 0x01;//设置速度
        mspeed = Math.abs(mspeed);//绝对值
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const regAddr = 0x8C + 0x00;//执行
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

        // 根据速度正负决定是否反转方向
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

        const spAddr = 0x8C + 0x01;//设置速度
        mspeed = Math.abs(mspeed);//绝对值
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const disAddr = 0x8C + 0x02;//设置距离
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // 轮询状态（阻塞）
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
        // 根据速度正负决定是否反转方向
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

        const spAddr = 0x8C + 0x01;//设置速度
        mspeed = Math.abs(mspeed);//绝对值
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const disAddr = 0x8C + 0x04;//设置角度
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (angle >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, angle & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // 轮询状态（阻塞）
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
        const regAddr = 0x8C + 0x00;//执行
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
    //##################################单电机#################################
    //#########################################################################
    //% blockId=motorGetSpeed
    //% block="get motor %mID speed"
    //% group="Motor" weight=29
    export function motorGetSpeed(mID: motorID): number {
        // 发送指令
        const cmdAddr = mID + 0x01;
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
        // 拼接 2 字节为 16 位整数
        // let readBuff = pins.createBuffer(2);
        // readBuff = pins.i2cReadBuffer(i2cAddress, 2);
        // let highByte = readBuff.getNumber(NumberFormat.UInt8BE, 0);
        // let lowByte = readBuff.getNumber(NumberFormat.UInt8BE, 1);
        // let speed = ((highByte & 0xFF) << 8) | (lowByte & 0xFF);

        // 读取2字节数据
        let readBuff = pins.createBuffer(2);
        readBuff = pins.i2cReadBuffer(i2cAddress, 2);
        // 将2个字节作为有符号16位整数解析
        let speed = readBuff.getNumber(NumberFormat.Int16BE, 0);
        return speed; 
    }
    //% blockId=motorGetAngle
    //% block="get motor %mID encoder value"
    //% group="Motor" weight=28
    export function motorGetAngle(mID: motorID): number {
        // 发送指令
        const cmdAddr = mID + 0x00;
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // 读取4字节数据（32位有符号整数）
        let readBuff = pins.createBuffer(4);
        readBuff = pins.i2cReadBuffer(i2cAddress, 4);

        // 将4个字节作为有符号32位整数解析
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

    //     // 设置速度
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
        // 根据速度正负决定是否反转方向
        let finalType = 1;
        if (mspeed < 0) {
            finalType = 2;
        }
        // 设置速度
        const spAddr = mID + 0x04;
        mspeed = Math.abs(mspeed);//绝对值
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);

        // 发送运动指令
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
        // 根据速度正负决定是否反转方向
        let finalType = 1;
        if (mspeed < 0) {
            finalType = 2;
        }
        // 设置速度
        const spAddr = mID + 0x04;
        mspeed = Math.abs(mspeed);//绝对值
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);

        //设置距离
        const disAddr = mID + 0x07;
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        // 发送运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType + 6);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // 轮询状态（阻塞）
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
        // 根据速度正负决定是否反转方向
        let finalType = 1;
        if (mspeed < 0) {
            finalType = 2;
        }
        // 设置速度
        const spAddr = mID + 0x04;
        mspeed = Math.abs(mspeed);//绝对值
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);

        //设置偏移角度
        const disAddr = mID + 0x06;
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (angle >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, angle & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        // 发送运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, finalType + 4);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);

        // 轮询状态（阻塞）
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

    //     // 设置速度
    //     const spAddr = mID + 0x04;
    //     let spBuff = pins.createBuffer(3);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF);
    //     spBuff.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF);
    //     pins.i2cWriteBuffer(i2cAddress, spBuff);
    //     // 发送运动指令
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
        // 发送停止运动指令
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
        // 发送设置周长偏移量指令
        const cmdAddr = mID + 0x0B;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, num);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
        basic.pause(50);
    }

    //#########################################################################
    //##################################舵机#################################
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
        // 限制速度范围
        speed = Math.min(100, Math.max(0, speed))

        if (speed > 0 && speed<30){
            speed = 30
        }

        // 计算脉冲宽度
        // 中间位置：1.5ms (1500µs) = 停止
        // 顺时针方向：1.0ms (500µs) = 全速逆时针
        // 逆时针方向：2.0ms (2500µs) = 全速顺时针
        let pulseWidth: number

        if (speed === 0) {
            pulseWidth = 1500
        } else {
            if (direction === RotationDirection.Clockwise) {
                // 500-1500µs 对应速度 0-100
                pulseWidth = 1500 - (speed * 10)
            } else {
                // 1000-2500µs 对应速度 0-100
                pulseWidth = 1500 + (speed * 10)
            }
        }
        // 设置脉冲宽度
        pins.servoSetPulse(pin, pulseWidth)
    }
    // //% blockId=servo360_run_with_duration
    // //% block="run 360° servo %pin  %speed %direction for %duration s"
    // //% expandableArgumentMode="enabled"
    // //% speed.min=0 speed.max=100 speed.defl=50
    // //% duration.min=0 duration.max=100 duration.defl=1

    // //% group="Servo Motor" weight=4
    // export function runServo360ForDuration(pin: ServoPin, speed: number, direction: RotationDirection, duration: number): void {
    //     // 启动舵机
    //     runServo360(pin, speed, direction)

    //     // 等待指定时间
    //     basic.pause(duration * 1000)

    //     // 停止舵机
    //     servo360Stop(pin)
    // }

    //% blockId=servo360Stop
    //% block="stop 360° servo %pin"
    //% group="Servo Motor" weight=3
    export function servo360Stop(pin: ServoPin): void {
        // 设置脉冲宽度为1.5ms停止
        pins.servoSetPulse(pin, 1500)
    }
    
    //#########################################################################
    //##################################灯条#################################
    //#########################################################################
    // RGB LED控制类
    class WS2812BStrip {
        private buffer: Buffer
        private pin: DigitalPin
        private length: number
        private brightness: number = 128

        constructor(pin: DigitalPin, length: number) {
            this.pin = pin
            this.length = length
            this.buffer = pins.createBuffer(length * 3)// 每个LED需要3个字节 (RGB)
            pins.digitalWritePin(pin, 0)// 初始化引脚
        }

        // 设置单个LED的RGB颜色
        setPixelColor(index: number, rgb: number): void {
            if (index < 0 || index >= this.length) return

            let r = (rgb >> 16) & 0xFF
            let g = (rgb >> 8) & 0xFF
            let b = rgb & 0xFF

            // 应用亮度
            if (this.brightness < 255) {
                r = (r * this.brightness) >> 8
                g = (g * this.brightness) >> 8
                b = (b * this.brightness) >> 8
            }

            let offset = index * 3
            // WS2812B使用GRB顺序
            this.buffer[offset] = g     // G
            this.buffer[offset + 1] = r // R
            this.buffer[offset + 2] = b // B
        }

        // 显示所有LED
        show(): void {
            ws2812b.sendBuffer(this.buffer, this.pin)
        }

        // 清除所有LED
        clear(): void {
            for (let i = 0; i < this.buffer.length; i++) {
                this.buffer[i] = 0
            }
        }

        // 设置亮度
        setBrightness(brightness: number): void {
            this.brightness = Math.min(255, Math.max(0, brightness))
        }
    }

    // 全局变量存储当前灯条信息
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
