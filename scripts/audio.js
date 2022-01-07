progression = []
step = 0
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
    if (CHORDS[index]){
        var chord = CHORDS[index].map(note => note += degree[index])
        chord = createChord(chord, '1m')    
        progression.push(chord)
        piano.triggerAttackRelease(chord[1], chord[0])      
    }
}

function playProgression(){
    Tone.Transport.stop(0)
    if(progression.length == 0){
        alert('Create a valid progression')
    }
    else{
        var chordPart = new Tone.Part(function(time, chord){
		piano.triggerAttackRelease(chord, "1m", time);
	}, progression ).start(0.2);
    console.log(progression)
    Tone.Transport.start("+0.1");

    }
}

function createChord(notes, interval){
    var chord = Tone.Frequency("C3").harmonize(notes); // returns array of notes
    // create add time and chord together
    let tuple = []
    tuple.push(Tone.Time(step) + Tone.Time(interval));
    tuple.push(chord);
    step += Tone.Time(interval)


    return tuple;
}

