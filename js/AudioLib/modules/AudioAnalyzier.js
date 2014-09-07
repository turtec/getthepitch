var AudioAnalyzier = function(audiostream){
    // get the AudioContext-Object webKit or other Browser
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // instantiate the AudioContext
    this.audioContext = new AudioContext();
    // Create an AudioNode from the audiostream.
    this.mediaStreamSource =  this.audioContext.createMediaStreamSource(audiostream);
    // Connect it to the destination.
    this.analyser =  this.audioContext.createAnalyser();
    // some global Object-Settings
    this.analyser.fftSize = 2048;
    //connect the Anaylizer with the AudioScource
    this.mediaStreamSource.connect(this.analyser);
    // init-setup for the RunnerId
    this.runnerId = null;
 };

/**
 *  run the Analyzer
 */
AudioAnalyzier.prototype.run = function(){
    var self = this;
    // start streamfetching
    self.runnerId = setInterval(function(){self.getPitch()}, 300);
};

/**
* stop the Analyzer
*/
AudioAnalyzier.prototype.stop = function(){
   var self = this;
   // stop the runner
   clearInterval(self.runnerId);
}

/**
 * get a pitch and compute these pitch
 */
AudioAnalyzier.prototype.getPitch = function(){
    var self = this;
    // create the Buffer-Array
    var buffer = new Uint8Array(2048);
    // init the buffer
    this.analyser.getByteTimeDomainData(buffer);
    // compute the frequency
    var frequency = this.computeFrequency(buffer, this.audioContext.sampleRate);
    // create the return object
    if (frequency!=null){
        // get a numeric value of frequency
        var notenumber = self.convertFrequencyToNote(frequency);
        // create the return object (callback object)
        var data ={
            'notenumber': notenumber,
            'add':null
        };
        // invoke the EventHandler
        self.onPitchComputed(data);
    }
};

/**
 * Converts a frequency into a internal Notenumber
 * @param frequency
 * @returns {number}
 */
AudioAnalyzier.prototype.convertFrequencyToNote = function(frequency){
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    return Math.round(noteNum) + 69;
};

/**
 * computes the frequency->
 * TODO: has to be refactored 
 * @param buf
 * @param sampleRate
 * @returns {*}
 */
AudioAnalyzier.prototype.computeFrequency = function( buf, sampleRate ) {
    var MIN_SAMPLES = 4;	// corresponds to an 11kHz signal
    var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
    var SIZE = 1000;
    var best_offset = -1;
    var best_correlation = 0;
    var rms = 0;
    var foundGoodCorrelation = false;
    var lastCorrelation = 1;

    if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES)){
        // not enough data
       return null;
    }

    for (var i=0; i<SIZE; i++) {
        var val = (buf[i] - 128)/128;
        rms += val*val;
    }

    rms = Math.sqrt(rms/SIZE);

    if (rms<0.01){
        return null;
    }

    for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
        var correlation = 0;
        for (var i=0; i<SIZE; i++) {
            correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
        }
        correlation = 1 - (correlation/SIZE);
        if ((correlation>0.9) && (correlation > lastCorrelation)){
            foundGoodCorrelation = true;
        }
        else if (foundGoodCorrelation) {
            return sampleRate/best_offset;
        }
        lastCorrelation = correlation;
        if (correlation > best_correlation) {
            best_correlation = correlation;
            best_offset = offset;
        }
    }

    if (best_correlation > 0.01) {
        return sampleRate/best_offset;
    }

    return null;
}

/**
 * eventHandler if a picht could be computed
 * @param note
 */
AudioAnalyzier.prototype.onPitchComputed = function(note){
    //defaul->do nothing
}