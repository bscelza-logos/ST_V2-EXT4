//---------------------------------- Color sensor -------------------------------
const GAIN_R = 1.82//1.3//0.93
const GAIN_G = 1.5//1.25//0.95
const GAIN_B = 2.4//1.81

enum DetectedColor {
    //% block="red"
    Red,
    //% block="orange"
    Orange,
    //% block="yellow"
    Yellow,
    //% block="green"
    Green,
    //% block="cyan"
    Cyan,
    //% block="blue"
    Blue,
    //% block="purple"
    Purple,
    //% block="white"
    White,
    //% block="black"
    Black
}

// RGB channel
enum RgbChannel {
    //% block="R"
    Red,
    //% block="G"
    Green,
    //% block="B"
    Blue,
}

namespace SmartTEAM4 {
    // ===== VEML6040 I2C address =====
    const VEML6040_ADDR = 0x10

    // ===== Register addresses =====
    const REG_CONF = 0x00
    const REG_RED = 0x08
    const REG_GREEN = 0x09
    const REG_BLUE = 0x0A
    const REG_WHITE = 0x0B

    // ===== Integration time =====
    const IT_320MS = 0x30

    // ===== Auto / forced =====
    const AF_AUTO = 0x00
    const SD_ENABLE = 0x00

    let colorSensorInitialized = false

    function setConfiguration() {
        let buf = pins.createBuffer(3)
        buf[0] = REG_CONF;
        buf[1] = IT_320MS | AF_AUTO | SD_ENABLE;
        buf[2] = 0;
        pins.i2cWriteBuffer(VEML6040_ADDR, buf, false);
    }

    // Read color register value
    function readReg(reg: number): number {
        let regBuf = pins.createBuffer(1)
        regBuf[0] = reg

        pins.i2cWriteBuffer(VEML6040_ADDR, regBuf, true)
        basic.pause(5)

        let data = pins.i2cReadBuffer(VEML6040_ADDR, 2, false)

        return data[0] | (data[1] << 8)
    }

    let cacheR = 0
    let cacheG = 0
    let cacheB = 0
    let cacheW = 0

    let lastReadTime = 0
    const READ_INTERVAL = 320

    function updateRGB() {
        if (!colorSensorInitialized) {
            initColorSensor()
        }

        let now = control.millis()

        // Limit read frequency
        if (now - lastReadTime < READ_INTERVAL) return

        let s = readReg(REG_RED)
        let h = readReg(REG_GREEN)
        let c = readReg(REG_BLUE)
        let w = readReg(REG_WHITE)

        // Ignore invalid readings
        if (s == 0 && h == 0 && c == 0 && w == 0) return

        cacheR = s
        cacheG = h
        cacheB = c
        cacheW = w
        //serial.writeLine("R=" + s + " G=" + h + " B=" + c + " W=" + w)

        lastReadTime = now
    }


    //% blockId=init_color_sensor
    //% block="init color sensor"
    //% group="Color Sensor" weight=39
    export function initColorSensor(): void {
        if (!colorSensorInitialized) {
            setConfiguration();
            // Wait for integration time
            basic.pause(320);
            colorSensorInitialized = true
        }
    }

    //% blockId=isColorDetected
    //% block="detect color %color?"
    //% group="Color Sensor" weight=38
    export function isColorDetected(color: DetectedColor): boolean {
        updateRGB()

        let r = cacheR
        let g = cacheG
        let b = cacheB
        let w = cacheW

        // ===== Gain + white normalization =====
        let nr = (r / w) * GAIN_R
        let ng = (g / w) * GAIN_G
        let nb = (b / w) * GAIN_B

        // ===== Re-normalize =====
        let sum = nr + ng + nb
        nr /= sum
        ng /= sum
        nb /= sum

        // ===== Compute max/min =====
        let max = max3(nr, ng, nb)
        let min = min3(nr, ng, nb)

        // ===== Saturation =====
        if (max == 0) return false
        let s = 0
        if (max != min) {
            s = (max - min) / max
        }
        //serial.writeLine("S="+s + " w="+w)
        // ===== Black/white detection =====
        // Black: low brightness
        if (w < 2500) {
            //serial.writeLine( "black")
            return color == DetectedColor.Black
        }
        // White: high brightness + low saturation
        if (s < 0.1) {
            //serial.writeLine("white")
            return color == DetectedColor.White
        }

        // ===== Hue =====
        let h = 0

        if (max == nr) {
            h = 60 * ((ng - nb) / (max - min))
        } else if (max == ng) {
            h = 60 * (2 + (nb - nr) / (max - min))
        } else {
            h = 60 * (4 + (nr - ng) / (max - min))
        }

        if (h < 0) h += 360

        //serial.writeLine("H=" + h + " S=" + s)

        // ===== Classification (range check) =====
        if (color == DetectedColor.Red){
            if (h < 25 || h >= 345) return true
            return false
        }else if (color == DetectedColor.Orange){
            if (h >= 25 && h < 45) return true
            return false
        } else if (color == DetectedColor.Yellow) {
            if (h >= 45 && h < 80) return true
            return false
        } else if (color == DetectedColor.Green) {
            if (h >= 80 && h < 180) return true
            return false
        } else if (color == DetectedColor.Cyan) {
            if (h >= 180 && h < 223) return true
            return false
        } else if (color == DetectedColor.Blue) {
            if (h >= 223 && h < 240) return true
            return false
        } else if (color == DetectedColor.Purple) {
            if (h >= 235 && h < 345) return true
            return false
        }
        return false
    }
    
    // //% blockId=readRGBValue
    // //% block="read %channel value"
    // //% group="Color Sensor" weight=37
    // export function readRGBValue(channel: RgbChannel): number {
    //     updateRGB()

    //     if (cacheW == 0) return 0

    //     // ===== White normalization =====
    //     let r = cacheR / cacheW
    //     let g = cacheG / cacheW
    //     let b = cacheB / cacheW

    //     // ===== Channel correction (data stretch) =====
    //     r *= GAIN_R
    //     g *= GAIN_G
    //     b *= GAIN_B

    //     // ===== Direct mapping =====
    //     let nr = Math.round(r * 255)
    //     let ng = Math.round(g * 255)
    //     let nb = Math.round(b * 255)

    //     nr = Math.min(255, Math.max(0, nr))
    //     ng = Math.min(255, Math.max(0, ng))
    //     nb = Math.min(255, Math.max(0, nb))

    //     switch (channel) {
    //         case RgbChannel.Red: return nr
    //         case RgbChannel.Green: return ng
    //         case RgbChannel.Blue: return nb
    //         default: return 0
    //     }
    // }

    //% blockId=readWhiteValue
    //% block="read brightness"
    //% group="Color Sensor" weight=36
    export function readWhiteValue(): number {
        updateRGB()

        let nw = Math.round(cacheW * 255 / 65535)

        if (nw > 255) nw = 255
        if (nw < 0) nw = 0

        return nw
    }

    function max3(a: number, b: number, c: number): number {
        let m = a
        if (b > m) m = b
        if (c > m) m = c
        return m
    }

    function min3(a: number, b: number, c: number): number {
        let m = a
        if (b < m) m = b
        if (c < m) m = c
        return m
    }
}

