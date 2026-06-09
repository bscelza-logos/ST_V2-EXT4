//#########################################################################
//################################## Other sensors (potentiometer, soil moisture, button) #################################
//#########################################################################
enum PotPin {
    //% block="P0"
    P0 = AnalogPin.P0,
    //% block="P1"
    P1 = AnalogPin.P1,
    //% block="P2"
    P2 = AnalogPin.P2
}

namespace SmartTEAM4 {
    //---------------------------------- Potentiometer -------------------------------
    //% blockId=potentiometer_read_raw
    //% block="read potentiometer %pin raw value"
    //% group="Potentiometer" weight=99
    export function readPotentiometerRaw(pin: PotPin): number {
        // Read analog value directly, range 0-1023
        return pins.analogReadPin(pin as number)
    }

    //% blockId=potentiometer_read_percent
    //% block="read potentiometer %pin percentage"
    //% group="Potentiometer" weight=98
    export function readPotentiometerPercent(pin: PotPin): number {
        // Read raw value
        let rawValue = pins.analogReadPin(pin as number)

        // Convert to percentage 0-100
        let percentage = (rawValue * 100) / 1023

        // Clamp to 0-100 range
        percentage = Math.min(100, Math.max(0, percentage))
        return Math.round(percentage)
    }

    //---------------------------------- Soil moisture -------------------------------
    //% blockId=soil_read_raw
    //% block="read soil moisture %pin raw value"
    //% group="Soil Moisture Sensor" weight=89
    export function readSoilMoistureRaw(pin: PotPin): number {
        // Read analog value directly, range 0-1023
        return pins.analogReadPin(pin as number)
    }

    //% blockId=soil_read_percent
    //% block="read soil moisture %pin percentage"
    //% group="Soil Moisture Sensor" weight=88
    export function readSoilMoisturePercent(pin: PotPin): number {
        // Read raw value
        let rawValue = pins.analogReadPin(pin as number)

        // Convert to percentage 0-100
        let percentage = (rawValue * 100) / 1023

        // Clamp to 0-100 range
        percentage = Math.min(100, Math.max(0, percentage))
        return Math.round(percentage)
    }

    // //---------------------------------- Button -------------------------------
    // //% blockId=button_is_pressed
    // //% block="button %pin is pressed?"
    // //% group="Button" weight=79
    // export function isPressed(pin: ServoPin): boolean {
    //     let value = pins.digitalReadPin(pin as number)
    //     // Return true when pressed
    //     return value === 0
    // }
}
