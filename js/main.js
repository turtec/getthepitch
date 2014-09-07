window.onload = function(){

    var theApp = null;

    // Register Eventhandler click on startbutton
    document.getElementById('startbtn').addEventListener('click', function(){
        // display a Message
        document.getElementById('messageaudio').style.display='block';
        // hide me
        this.style.display='none';

        if(theApp===null){
            // if the App-Object isn't itanziated
            theApp = new App();
        }
        // Eventhandler - AudioStream could be fetched
        // hide the mic - message
        theApp.onStreamFetched = function(){
            // hide and dispaly buttons and messages
            document.getElementById('messageaudio').style.display='none';
            document.getElementById('messageready').style.display='block';
            document.getElementById('stopbtn').style.display='block';
        }
        // run the App
        theApp.run();
    });

    // Register Eventhandler-> click on stop button
    document.getElementById('stopbtn').addEventListener('click', function(){
        // hide and display buttons
        document.getElementById('startbtn').style.display='block';
        this.style.display='none';
        // stop the Analyzer
        theApp.stopAnalyze();
     });

};