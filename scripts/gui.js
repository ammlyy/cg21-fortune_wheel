var spinTime;
index = 0
slice = 0
html_chords = [
    document.getElementById('chord1'),
    document.getElementById('chord2'),
    document.getElementById('chord3'),
    document.getElementById('chord4')
]

function spin(){
    startAudioContext();        // Defined in audio.js

    startSpinning = true;
    spinTime = (Math.random() * 2.0 + 5.0)
    sampler.triggerAttackRelease('C3', spinTime)

    setTimeout(()=>{
        startSpinning = false;
        pickSlice()
    }, spinTime * 1000)

    
}

function pickSlice(){
    let last = 360.0 - last_rotation * 360; // the spinning goes clockwise, so the rotation must be inverted
    let slice;
    
    
    if ((last > 334.3 || last > 0) && last <= 25.7) {
        slice = 0
        } 

        else if(last > 25.7 && last <= 77.1){
            slice = 1
        }

        else if(last > 77.1 && last <= 128.5){
            slice = 2

        }

        else if(last > 128.5 && last <= 180){
            slice = 3

        }

        else if(last > 180 && last <= 231.4){
            slice = 4

        }

        else if(last > 231.4 && last <= 282.7){
            slice = 5

        }
       
        else if(last > 282.7 && last <= 334.3){
            slice = 6
        } 
    
    LBColor = colors[slice]
    playChord(slice)
    updateProgression(slice)
    if(index == 4){
        progression = []
        index=0
    }
    index++

}

function updateProgression(slice){
    html_chords[index].children[0].innerText = CHORDS_text[slice]
    html_chords[index].style.background = "rgb(" + LBColor[0]*255 + "," + LBColor[1]*255 + "," + LBColor[2]*255 + ")"
}

  