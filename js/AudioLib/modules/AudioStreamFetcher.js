/**
 * Fetches and Wraps the access to the Micophone
 * @constructor
 */
var AudioStreamFetcher = function(){
    //some init stuff
};

/**
 * fetches the AudioStream
 * @param callbackSuccess
 * @param callbackError
 */
AudioStreamFetcher.prototype.fetchAudioStream = function(callbackSuccess,callbackError) {

    try {
        navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

        navigator.getUserMedia({audio:true}, callbackSuccess, callbackError);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

};
