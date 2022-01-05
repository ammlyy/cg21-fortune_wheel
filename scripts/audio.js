var piano = SampleLibrary.load({
    instruments: "piano"
});

piano.toMaster();

function startAudioContext(){
    Tone.start()
	console.log('audio is ready')
    piano.triggerAttack("A3")
}