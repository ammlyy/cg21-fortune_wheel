function spin(){
    startSpinning = true;
    spinTime = (Math.random() * 2.0 + 3.0) * 1000

    setTimeout(()=>{
        startSpinning = false;
    }, spinTime)

    console.log('Started spinning?', startSpinning);
}