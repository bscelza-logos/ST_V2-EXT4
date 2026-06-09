// Fixed global variable for SmartTEAM 4 quantity counter
let Cantidad = 0

namespace SmartTEAM4 {
    /**
     * Set Cantidad to a number value
     * @param value the value to assign, eg: 0
     */
    //% blockNamespace=variables
    //% color=#DC143C
    //% weight=95
    //% blockId=variables_set_cantidad
    //% block="Establecer cantidad a %value"
    //% value.min=0 value.defl=0
    export function setCantidad(value: number): void {
        Cantidad = value
    }
}
