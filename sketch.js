/**
 *  @author cody
 *  @date 2022.06.28

 make sure passage.js works first

 0. start with the template project
 1. console log a list of hero names from champion.json
 2. console log some info from a specific champion
 3. obtain a list of abilities from any hero
 4. obtain a list of lists of hero abilities
 5. make a typerc passage work with a champion.json 'blurb'
 6. fetch a few champion images
 7. fetch ability images from the multidimensional array

 8. tinker with the items.json page
 9. display icon images

 draw diagram with rudimentary layout

 enable passage.js to handle multiple sections: 'nextSection()' 🦔 Cody
 suggests new object.

 filter tags out of abilities
 color or format specific xml tags


 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let passage /* the main part, our passage that we'll be typing into */


function preload() {
    font = loadFont('data/consola.ttf')
}


function setup() {
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    passage = new Passage('this is a test' + '\n ')
}


function draw() {
    background(234, 34, 24)

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
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
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