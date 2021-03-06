var spinTime;
var index = 0
var slice = 0
html_chords = [
    document.getElementById('chord1'),
    document.getElementById('chord2'),
    document.getElementById('chord3'),
    document.getElementById('chord4')
]

function spin() {
    startAudioContext();        // Defined in audio.js

    startSpinning = true;
    sz = 0.5 // global variable to scale the button

    spinTime = (Math.random() * 2.0 + 3.5)
    sampler.triggerAttackRelease('C3', spinTime) // triggers the wheel sound fx
    if (index == 4) {
        progression = []
        index = 0
        clearProgression()
    }
    setTimeout(() => {
        startSpinning = false;
        pickSlice()

        LBColor = colors[slice]
        playChord(slice)
        updateProgression(slice)

        index++

        sz = 1.0
    }, spinTime * 1000)


}

function pickSlice() {
    let last = 360.0 - last_rotation * 360; // the spinning goes clockwise, so the rotation must be inverted    

    if ((last > 334.3 || last > 0) && last <= 25.7) {
        slice = 0
    }

    else if (last > 25.7 && last <= 77.1) {
        slice = 1
    }

    else if (last > 77.1 && last <= 128.5) {
        slice = 2

    }

    else if (last > 128.5 && last <= 180) {
        slice = 3

    }

    else if (last > 180 && last <= 231.4) {
        slice = 4

    }

    else if (last > 231.4 && last <= 282.7) {
        slice = 5

    }

    else if (last > 282.7 && last <= 334.3) {
        slice = 6
    }

}

function updateProgression(slice) {
    html_chords[index].children[0].innerText = CHORDS_text[slice]
    html_chords[index].style.background = "rgb(" + LBColor[0] * 255 + "," + LBColor[1] * 255 + "," + LBColor[2] * 255 + ")"
}

function clearProgression() {
    html_chords.forEach(node => {
        node.children[0].innerText = ''
        node.style.background = ''
        step = 0 // clear audio progression
        progression = []
    })
}
