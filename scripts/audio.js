progression = []

var piano = SampleLibrary.load({
    instruments: "piano"
});

const sampler = new Tone.Sampler({
	urls: {
        C3: "samples/fx/wheel_spin.mp3",
    }
}).toDestination();
sampler.set({volume: -6})

piano.toDestination();

function startAudioContext(){
    Tone.start()
}

function playChord(index){
    var chord = chords[index]
    progression.push(chord)
    chord =  [ 
        Tone.Frequency('C2').transpose(chord[0] + degree[index] ),
        Tone.Frequency('C2').transpose(chord[1] + degree[index] ),
        Tone.Frequency('C2').transpose(chord[2] + degree[index]),
      ]
    piano.triggerAttackRelease(chord, '2m')
}

function playProgression(){
    
}