var spinTime;

function spin(){
    startAudioContext();        // Defined in audio.js

    startSpinning = true;
    spinTime = (Math.random() * 2.0 + 5.0)

    setTimeout(()=>{
        startSpinning = false;
        pickSlice()
    }, spinTime * 1000)

    
}

function pickSlice(){
    let last = 360.0 - last_rotation * 360; // the spinning goes clockwise, so the rotation must be inverted
    let slice;
    let note;
    
    
        if(last > 345 && last <= 15) {
            slice = 0
            note = 'C3'
        } 

        else if(last > 15 && last <= 45){
            slice = 1
            note = 'C#3'
        }

        else if(last > 45 && last <= 75){
            slice = 2
            note = 'D3'

        }

        else if(last > 75 && last <= 105){
            slice = 3
            note = 'D#3'

        }

        else if(last > 105 && last <= 135){
            slice = 4
            note = 'E3'

        }

        else if(last > 135 && last <= 165){
            slice = 4
            note = 'F3'

        }
       
        else if(last > 165 && last <= 195){
            slice = 5
            note = 'F#3'
        } 

        else if(last > 195 && last <= 225){
            slice = 6
            note = 'G3'
        } 

        else if(last > 195 && last <= 225){
            slice = 7
            note = 'G#3'
        } 

        else if(last > 225 && last <= 255){
            slice = 8
            note = 'A3'
        } 

        else if(last > 255 && last <= 285){
            slice = 9
            note = 'A#3'
        } 

        else if(last > 285 && last <= 315){
            slice = 10
            note = 'B3'
        } 

        else if(last > 315 && last <= 345){
            slice = 11
            note = 'C4'
        } 

    
    ambientLightColor = colors[slice]
    piano.triggerAttack(note)
}