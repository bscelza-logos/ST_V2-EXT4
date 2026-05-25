//----------------------------------LCD1602-------------------------------
let lastUpdateTime = 0
const LCD_INTERVAL = 150   // 刷新间隔

enum LcdBacklight {
    //% block="on"
    On = 1,
    //% block="off"
    Off = 0
}
namespace FIFAbit {
    const LCD_ADDR = 0x20
    let backlight = 0x08

    // function write4bits(value: number) {
    //     pins.i2cWriteNumber(LCD_ADDR, value | backlight, NumberFormat.UInt8BE)
    //     pins.i2cWriteNumber(LCD_ADDR, value | backlight | 0x04, NumberFormat.UInt8BE)
    //     pins.i2cWriteNumber(LCD_ADDR, value | backlight, NumberFormat.UInt8BE)
    // }
    function write4bits(value: number) {
        let buf = pins.createBuffer(3)

        buf[0] = value | backlight
        buf[1] = value | backlight | 0x04   
        buf[2] = value | backlight          

        pins.i2cWriteBuffer(LCD_ADDR, buf)
    }

    // function send(value: number, mode: number) {
    //     let high = (value & 0xF0) | mode
    //     let low = ((value << 4) & 0xF0) | mode

    //     write4bits(high)
    //     write4bits(low)
    // }
    function send(value: number, mode: number) {
        let rs = mode ? 0x01 : 0x00

        let high = (value & 0xF0) | backlight | rs
        let low = ((value << 4) & 0xF0) | backlight | rs

        write4bits(high)
        write4bits(low)
    }

    function command(cmd: number) {
        send(cmd, 0)
    }

    function data(d: number) {
        send(d, 1)
    }

    function setCursor(col: number, row: number) {
        let row_offsets = [0x00, 0x40]
        command(0x80 | (col + row_offsets[row]))
    }


    //% blockId="lcd1602_init" block="init LCD1602"
    //% group="LCD1602" weight=100
    export function lcd1602_init() {
        basic.pause(50)

        write4bits(0x30)
        basic.pause(5)
        write4bits(0x30)
        basic.pause(1)
        write4bits(0x30)
        write4bits(0x20)

        command(0x28) // 4位 2行
        command(0x0C) // 开显示
        command(0x06) // 光标右移
        command(0x01) // 清屏

        basic.pause(5)
    }

    //% blockId="lcd1602_clear" block="clear display"
    //% group="LCD1602" weight=99
    export function lcd1602_clear() {
        command(0x01)
        basic.pause(2)
    }

    //% blockId="lcd1602_show_line" block="show %text at row %row col %col"
    //% text.defl="hello"
    //% row.min=0 row.max=1 row.defl=0
    //% col.min=0 col.max=15 col.defl=0
    //% group="LCD1602" weight=98
    export function showAt(text: string, row: number, col: number) {
        // 限制刷新频率 
        let now = control.millis()
        if (now - lastUpdateTime < LCD_INTERVAL) return

        setCursor(col, row)
        for (let i = 0; i < text.length; i++) {
            data(text.charCodeAt(i))
        }
    }

    //% blockId="lcd1602_show_number" block="show number %num at row %row col %col"
    //% num.defl=0
    //% row.min=0 row.max=1 row.defl=0
    //% col.min=0 col.max=15 col.defl=0
    //% group="LCD1602" weight=97
    export function showNumber(num: number, row: number, col: number) {
        let text = num.toString()

        // 固定长度（避免残留字符）
        // while (text.length < 4) {
        //     text = " " + text
        // }

        showAt(text, row, col)
        //showAt(num.toString(), row, col)
    }

    //% blockId="lcd1602_backlight" block="set backlight %state"
    //% group="LCD1602" weight=96
    export function setBacklight(state: LcdBacklight) {
        backlight = state == LcdBacklight.On ? 0x08 : 0x00
        command(0) // 刷新
    }
  
}