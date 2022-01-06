var piano = SampleLibrary.load({
    instruments: "piano"
});

piano.toDestination();

function startAudioContext(){
    Tone.start()
}