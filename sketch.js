/**
 *  @author Cody
 *  @date 2022.06.28
 *
 * 0. start with the template project
 * 1. console log a list of hero names from champion.json
 * 2. console log some info from a specific champion
 * 3. obtain a list of abilities from any hero
 * 4. obtain a list of lists of hero abilities
 * 5. make a typerc passage work with a champion.json 'blurb'
 * 6. fetch a few champion images
 * 7. fetch ability images from the multi-dimensional array
 *
 * 8. tinker with the items.json page
 * 9. display icon images
 *
 * draw diagram with rudimentary layout
 *
 * enable passage.js to handle multiple sections: 'nextSection()'. maybe new
 * object?
 *
 * filter tags out of abilities
 * color or format specific xml tags
 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let correctSound /* the sound that we play when we get a correct key */
let incorrectSound /* the sound that we play when we get an incorrect key */
let passage


function preload() {
    font = loadFont('data/consola.ttf')
    correctSound = loadSound('data/correct.wav')
    incorrectSound = loadSound('data/incorrect.wav')
}


function setup() {
    let cnv = createCanvas(960, 480)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 23)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    passage = new Passage("this is a test" +
        " passage\n\n\n\n\n\n\n\n\n\n\n\n\n\nscrolled?\n\n\n\n\n")
}


function draw() {
    background(234, 34, 24)
    textFont(font, 23)

    passage.show()

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()

    if (frameCount > 3000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { // 97 is the keycode for numpad 1
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    } if (keyCode === 98) { // 98 is the keycode for numpad 2
        cardDataIndex -= 10
        updateCard(cardDataIndex)
    } if (keyCode === 100) { // 100 is the keycode for numpad 4
        cardDataIndex--
        updateCard(cardDataIndex)
    } if (keyCode === 101) { // 101 is the keycode for numpad 5
        cardDataIndex = round(random(0, cardData.length-1))
        updateCard(cardDataIndex)
    } if (keyCode === 102) { // 102 is the keycode for numpad 6
        cardDataIndex++
        updateCard(cardDataIndex)
    } if (keyCode === 104) { // 104 is the keycode for numpad 8
        cardDataIndex += 10
        updateCard(cardDataIndex)
    }
    /* a key has been typed! */
    else {
        // otherwise....
        processKeyTyped(key)
    }
}

// processes given key
function processKeyTyped(key) {
    // asterisk (*) = bullet point (•), and dash (-) = emdash (—). This is
    // the key that needs to be typed in order to get the character correct.
    let correctKey = passage.getCurrentChar(passage.index)
    if (correctKey === "•") {
        correctKey = "*"
    } else if (correctKey === "—") {
        correctKey = "-"
    } if (passage.text.substring(passage.index, passage.index + 1) === "\n") {
        correctKey = "Enter"
    }
    if (key !== "Shift" && key !== "Tab" && key !== "CapsLock" && key !== "Alt" && key !== "Control") {
        if (key === correctKey) {
            passage.setCorrect()
            correctSound.play()
        } else {
            passage.setIncorrect()
            incorrectSound.play()
        }
    }

    print(key + "🆚" + correctKey + ", " + passage.index)
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)
        strokeWeight(1)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

        /* semi-transparent background */
        fill(0, 0, 0, 50)
        rectMode(CORNERS)
        rect(
            0, height,
            width, DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length
        )

        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}