var spinTime;

function spin(){
    startAudioContext();        // Defined in audio.js

    startSpinning = true;
    spinTime = (Math.random() * 2.0 + 5.0)

    setTimeout(()=>{
        startSpinning = false;
    }, spinTime * 1000)

    console.log('Started spinning?', startSpinning);
}