//---------------------------------- Line tracking -------------------------------
enum LineSensorPin {
    //% block="P0" weight=10
    P0 = DigitalPin.P0,
    //% block="P1" weight=9
    P1 = DigitalPin.P1,
    //% block="P2" weight=8
    P2 = DigitalPin.P2,
    //% block="P8" weight=7
    P8 = DigitalPin.P8,
    //% block="P12" weight=6
    P12 = DigitalPin.P12,
    //% block="P13" weight=5
    P13 = DigitalPin.P13,
    //% block="P15" weight=4
    P15 = DigitalPin.P15,
    //% block="P16" weight=3
    P16 = DigitalPin.P16
}

enum SensorSide {
    //% block="left"
    Left = 1,
    //% block="middle"
    Middle = 2,
    //% block="right"
    Right = 3
}

namespace SmartTEAM4 {
    // Pin storage for the three sensors
    let leftPin: LineSensorPin
    let middlePin: LineSensorPin
    let rightPin: LineSensorPin
    let lineTrackingInitialized = false

    // Pin mapping table
    let pinMap: { [key: number]: LineSensorPin } = {
        1: LineSensorPin.P0,  // left default P0
        2: LineSensorPin.P1,  // middle default P1
        3: LineSensorPin.P2   // right default P2
    }

    //% blockId=linetracking_init
    //% block="init line sensors|left %left|middle %middle|right %right"
    //% inlineInputMode=external
    //% left.defl=LineSensorPin.P0
    //% middle.defl=LineSensorPin.P1
    //% right.defl=LineSensorPin.P2
    //% group="Line Tracking Sensor" weight=59
    export function initSensors(left: LineSensorPin, middle: LineSensorPin, right: LineSensorPin): void {
        pinMap[1] = left as number
        pinMap[2] = middle as number
        pinMap[3] = right as number
        pins.setPull(pinMap[1], PinPullMode.PullNone)
        pins.setPull(pinMap[2], PinPullMode.PullNone)
        pins.setPull(pinMap[3], PinPullMode.PullNone)
        lineTrackingInitialized = true
    }
    //% blockId=linetracking_detect  
    //% block="%position sensor detects black line?"
    //% group="Line Tracking Sensor" weight=58
    export function detectLine(position: SensorSide): boolean {
        if (!lineTrackingInitialized) return false
        let pin = pinMap[position]
        return pins.digitalReadPin(pin) === 1
    }

    //% blockId=linetracking_read_value
    //% block="read %position sensor value"
    //% group="Line Tracking Sensor" weight=57
    export function readSensorValue(position: SensorSide): number {
        if (!lineTrackingInitialized) return 0
        let pin = pinMap[position]
        basic.pause(10)
        return pins.digitalReadPin(pin)
    }
}
