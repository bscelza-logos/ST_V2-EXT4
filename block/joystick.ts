//----------------------------------摇杆-------------------------------
enum JoystickPin {
    //% block="P0"
    P0 = AnalogPin.P0,
    //% block="P1"
    P1 = AnalogPin.P1,
    //% block="P2"
    P2 = AnalogPin.P2
}

enum JoySWPin {
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

enum JoyAxis {
    //% block="X"
    X = 0,
    //% block="Y"
    Y = 1
}

enum JoyDirection {
    //% block="up"
    Up = 1,
    //% block="down"
    Down = 2,
    //% block="left"
    Left = 3,
    //% block="right"
    Right = 4
}

namespace FIFAbit {
    let joyX: JoystickPin
    let joyY: JoystickPin
    let joySW: JoySWPin
    let joystick_inited = false


    //% blockId=joystick_init
    //% block="initialize joystick|X %xPin|Y %yPin|button %swPin"
    //% inlineInputMode=external
    //% xPin.defl=JoystickPin.P0
    //% yPin.defl=JoystickPin.P1
    //% swPin.defl=JoySWPin.P2
    //% group="Joystick" weight=50
    export function initJoystick(xPin: JoystickPin, yPin: JoystickPin, swPin: JoySWPin) {
        joyX = xPin
        joyY = yPin
        joySW = swPin

        pins.setPull(joySW, PinPullMode.PullUp)
        joystick_inited = true
    }

    //% blockId=rocker
    //% block="read joystick %direction value"
    //% group="Joystick" weight=49
    export function rocker(direction: JoyAxis): number {
        if (!joystick_inited) return 0

        if (direction == JoyAxis.X) {
            return pins.analogReadPin(joyX)
        } else {
            return pins.analogReadPin(joyY)
        }
    }

    //% blockId=rockerori
    //% block="joystick detects %orientation?"
    //% group="Joystick" weight=48
    export function rockerori(orientation: JoyDirection): boolean {
        if (!joystick_inited) return false

        let x = pins.analogReadPin(joyX)
        let y = pins.analogReadPin(joyY)

        let center = 512
        let threshold = 200

        if (orientation == JoyDirection.Up) {
            return y < center - threshold
        }
        if (orientation == JoyDirection.Down) {
            return y > center + threshold
        }
        if (orientation == JoyDirection.Left) {
            return x > center + threshold
        }
        if (orientation == JoyDirection.Right) {
            return x < center - threshold
        }

        return false
    }


    //% blockId=joystick_button
    //% block="joystick button pressed?"
    //% group="Joystick" weight=47
    export function isJoystickPressed(): boolean {
        if (!joystick_inited) return false
        serial.writeLine("" + pins.digitalReadPin(joySW))

        return pins.digitalReadPin(joySW) == 0
    }
}