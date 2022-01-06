var piano = SampleLibrary.load({
    instruments: "piano"
});

piano.toDestination();

function startAudioContext(){
    Tone.start()
}

function playChord(index){
    var chord = chords[index]
    console.log(chord)
    chord =  [ 
        Tone.Frequency('C2').transpose(chord[0] + degree[index] ),
        Tone.Frequency('C2').transpose(chord[1] + degree[index] ),
        Tone.Frequency('C2').transpose(chord[2] + degree[index]),
      ]
    piano.triggerAttackRelease(chord, '2m')
}