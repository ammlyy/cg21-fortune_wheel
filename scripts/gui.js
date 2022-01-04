var spinTime;

function spin(){
    startSpinning = true;
    spinTime = (Math.random() * 2.0 + 3.0)

    setTimeout(()=>{
        startSpinning = false;
    }, spinTime * 1000)

    console.log('Started spinning?', startSpinning);
}