// Create an audio context
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Define human voice frequency range (in Hz)
const minFrequency = 85;
const maxFrequency = 255;

// Create a script processor node
const bufferSize = 2048;
const scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

// Connect the script node to the audio context destination
scriptNode.connect(audioContext.destination);

// Function to handle audio processing
scriptNode.onaudioprocess = function(audioProcessingEvent) {
    // Get the input buffer
    let inputBuffer = audioProcessingEvent.inputBuffer;

    // Get the data from the input buffer
    let inputData = inputBuffer.getChannelData(0);

    // Calculate the maximum frequency in the input buffer
    let maxFrequencyInBuffer = getMaxFrequency(inputData, audioContext.sampleRate);

    // Output the maximum frequency
    console.log("Max Frequency:", maxFrequencyInBuffer);
};

// Function to calculate the maximum frequency in the input buffer
function getMaxFrequency(buffer, sampleRate) {
    let maxFrequency = 0;

    // Loop through the buffer and find the maximum frequency
    for (let i = 0; i < buffer.length; i++) {
        // Calculate the frequency in Hz
        let frequency = i * sampleRate / buffer.length;

        // Check if the frequency is within the human voice range
        if (frequency >= minFrequency && frequency <= maxFrequency && buffer[i] > maxFrequency) {
            maxFrequency = buffer[i];
        }
    }

    return maxFrequency;
}

// Function to start audio processing
function startAudioProcessing() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        // Connect the stream to the script processor node
        let source = audioContext.createMediaStreamSource(stream);
        source.connect(scriptNode);
    })
    .catch(function(err) {
        console.error('Error accessing microphone:', err);
    });
}

// Start audio processing when the page loads
document.addEventListener('DOMContentLoaded', function() {
    startAudioProcessing();
});