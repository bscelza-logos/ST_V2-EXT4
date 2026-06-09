/**
 * Cantidad variable blocks (same color as Variables category)
 */
//% color=#DC143C weight=109 icon="\uf1c9" block="Cantidad"
namespace Cantidad {
    let cantidad = 0

    /**
     * Set Cantidad to a number value
     * @param value the value to assign, eg: 0
     */
    //% blockId=cantidad_set
    //% block="Establecer cantidad a %value"
    //% weight=100
    //% value.defl=0
    export function setCantidad(value: number): void {
        cantidad = value
    }
}
