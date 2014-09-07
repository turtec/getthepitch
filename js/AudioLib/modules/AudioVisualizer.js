/**
 * Tools for Converting internal Frequency and note-Data
 * into humanreadable Messages
 * @constructor
 */

var AudioVisualizer = function(){
    // humanreadable Notes for converting a frequency
    this.noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
};

/**
 * converts a internal noteNumber into a nodestring
 */
AudioVisualizer.prototype.convertNoteToNoteString = function(notenumber){
    return this.noteStrings[notenumber%12];
}
