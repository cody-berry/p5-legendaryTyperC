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
 7. fetch ability images from the multidimensional arrays
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
let correctSound // the sound that we're going to play when we type the
// correct key
let incorrectSound // the sound that we're going to play when we type the
// incorrect key
let champions /* a list of champions and some da */
let championAbilities = {} /* a list of all the champions' abilities */

let championIcons = {} /* a dictionary of all champion icons with the key
 being the champion */
let items /* a list of all League of Legends items. */

function preload() {
    font = loadFont('data/consola.ttf')
    champions = loadJSON("https://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion.json")
    correctSound = loadSound('data/correct.wav')
    incorrectSound = loadSound('data/incorrect.wav')
    items = loadJSON('data/item.json')
    console.log(items)
}


function setup() {
    let cnv = createCanvas(960, 480)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 25)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    passage = new Passage(champions["data"]["Lux"]["blurb"] + ' \n')

    console.log(champions)

    for (let championData of Object.values(champions["data"])) {
        console.log(championData["name"])
    }

    let championNames = Object.keys(champions["data"])

    /* note that the link to:
            images are something like: https://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/Nunu.png
            sprites are something like: https://ddragon.leagueoflegends.com/cdn/12.12.1/img/sprite/champion2.png
            passive icons are something like: https://ddragon.leagueoflegends.com/cdn/12.12.1/img/passive/Ahri_SoulEater2.png
            ability icons are something like: https://ddragon.leagueoflegends.com/cdn/12.12.1/img/spell/AhriSeduce.png
    */

    for (let championName of championNames) {
        championIcons[championName] = loadImage(`https:ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${championName}.png`)
        loadJSON(`https://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion/${championName}.json`, getAbilities)
    }
}

function getAbilities(data) {
    let abilities = {}
    let championData = Object.values(data["data"])[0]
    abilities["spells"] = []
    let passive = championData["passive"]
    abilities["passive"] = [passive["name"], passive["tooltip"], loadImage(`https://ddragon.leagueoflegends.com/cdn/12.12.1/img/passive/${passive["image"]["full"]}`)]
    for (let ability of championData["spells"]) {
        abilities["spells"].push([ability["name"], ability["tooltip"], loadImage(`https://ddragon.leagueoflegends.com/cdn/12.12.1/img/spell/${ability["image"]["full"]}`)])
    }
    championAbilities[championData["name"]] = abilities
}

function draw() {
    background(234, 34, 24)
    textFont(font, 25)

    passage.show()

    if (championAbilities["Lux"]) {
        image(championAbilities["Lux"]["passive"][2], 100, 10)

        let abilityNumber = 0
        for (let luxAbility of championAbilities["Lux"]["spells"]) {
            abilityNumber++
            image(luxAbility[2], (abilityNumber + 1)*100, 10)
        }
        image(championIcons["Lux"], 600, 10)
    }

    /* debugCorner needs to be last so itz4s z-index is highest */
    debugCorner.setText(`scroll target: ${passage.yOffset.target.toFixed(5)}`, 4)
    debugCorner.setText(`scroll position: ${passage.yOffset.yPos.toFixed(5)}`, 3)
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()

    // if (frameCount > 3000)
    //     noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { // 97 is the keycode for numpad 1
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
    /* a key has been typed! */
    else {
        // otherwise....
        processKeyTyped(key)
    }
}

// processes given key
function processKeyTyped(key) {
    // asterisk (*) = bullet point (•), and dash (-) = em-dash (—). Thi1s is
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