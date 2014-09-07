/**
 * Main EntryPoint for the Library
 * @constructor
 */
var App = function(){
    this.streamFetcher = null;
    this.analyzer = null;
    this.visualizer = null;
};

/**
 * starts the App
 * bootstraps and encapsulates
 * the createProcess of the used Objects
 */
App.prototype.run = function(){
    var self = this;
    // Create the AudioStream Fetcher -> grab the
    // audio input by accessing the Microphone
    self.streamFetcher = new AudioStreamFetcher();
    // try to fetch the Audiostream
    self.streamFetcher.fetchAudioStream(
        function(stream){
            // success callback
            //###################
            // run the Eventhandler
            self.onStreamFetched();
            // if a stream could be fetched then create the
            // Audioanalyzier and inject the stream
            self.analyzer = new AudioAnalyzier(stream);
            // create the Visualizier -> this Object
            // contains methods for displaying catched
            // audioinformations
            self.visualizer = new AudioVisualizer();
            // start the Analyzer
            self.analyzer.run();
            // eventhandler if a pitch could be found
            // and could be computed
            self.analyzer.onPitchComputed = function(cc){
                // takes the computed note and converts the numeric value
                // into a humanreadable String
                var notestring = self.visualizer.convertNoteToNoteString(cc.notenumber);
                // assign the notestring to view-part
                document.getElementById('theNote').innerHTML = notestring;
            };
        },
        function(){
            // error Callback
            //#####################
            alert('an error occured');
        }
    );
};

/**
 * stops the App
 */
App.prototype.stopAnalyze = function(){
    var self = this;
    self.analyzer.stop();
}

/**
 * EventHandler for injecting additional code,
 * which should be executed after the AudioStream
 * has been fetched
 */
App.prototype.onStreamFetched = function(){
    // default: do nothing
}

/**
 * EventHandler for injecting additional code,
 * which should be executed when the AudioStream
 * could not be fetched
 */
App.prototype.onError = function(){
    // default: do nothing
}