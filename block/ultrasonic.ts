//---------------------------------- Ultrasonic -------------------------------
enum UltrasonicPin {
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
//% groups=['Sensores Libro 4']
namespace sensoresLibro4 {
    // Pin configuration storage
    let trigPin: UltrasonicPin
    let echoPin: UltrasonicPin
    let ultrasonicInitialized = false

    //% blockId=ultrasonic_init
    //% block="init ultrasonic|Trig %trig|Echo %echo"
    //% blockNamespace=input
    //% inlineInputMode=external
    //% trig.defl=UltrasonicPin.P0
    //% echo.defl=UltrasonicPin.P1
    //% group="Sensores Libro 4" weight=9
    export function initUltrasonic(trig: UltrasonicPin, echo: UltrasonicPin): void {
        trigPin = trig
        echoPin = echo
        ultrasonicInitialized = true

        // Initialize pins
        pins.digitalWritePin(trigPin, 0)
        pins.setPull(echoPin, PinPullMode.PullNone)
    }

    //% blockId=ultrasonic_read_distance
    //% block="read distance (cm)"
    //% blockNamespace=input
    //% group="Sensores Libro 4" weight=8
    export function readDistance(): number {
        if (!ultrasonicInitialized) {
            return 0
        }

        // Send 50µs high pulse
        pins.digitalWritePin(trigPin, 0)
        basic.pause(1)

        pins.digitalWritePin(trigPin, 1)
        control.waitMicros(50)
        pins.digitalWritePin(trigPin, 0)
        

        // Read high pulse duration
        // Note: pins.pulseIn returns microseconds
        let duration = pins.pulseIn(echoPin, PulseValue.High, 50000)  // 50ms timeout

        // Calculate distance (cm)
        // Speed of sound: 340m/s = 34000cm/s = 0.034cm/µs
        // Divide round-trip distance by 2
        let distance = duration * 0.034 / 2 * 1.0

        // Clamp to valid range (typically 2-400cm for ultrasonic modules)
        if (distance < 2 || distance > 400) {
            distance = 0
        }

        return Math.round(distance)
    }
}
