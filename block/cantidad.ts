namespace SmartTEAM4 {
    let cantidad = 0

    /**
     * Set Cantidad to a number value
     * @param value the value to assign, eg: 0
     */
    //% blockId=cantidad_set
    //% block="Establecer cantidad a %value"
    //% group="Cantidad" weight=200
    //% value.defl=0
    export function setCantidad(value: number): void {
        cantidad = value
    }
}
