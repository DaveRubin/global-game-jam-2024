function getNoteFromFrequency(frequency) {
  const A4 = 440;
  const A4_NOTE_NUMBER = 69; // MIDI note number for A4
  const noteNumber = 12 * Math.log2(frequency / A4) + A4_NOTE_NUMBER;

  const octave = Math.floor(noteNumber / 12) - 1;
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const noteName = noteNames[noteNumber % 12];
  const fullNoteName = noteName + octave;
  return { fullNoteName, noteNumber };
}

// Example usage:

const getVolume = (audioData) => {
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += audioData[i] * audioData[i];
  }
  return Math.sqrt(sum / audioData.length);
};

function getYinPitch(buffer, sampleRate) {
  const threshold = 0.1; // You can set this lower for more sensitivity
  const bufferSize = buffer.length;
  const yinBuffer = new Float32Array(bufferSize / 2);
  let probability = 0;
  let tauEstimate = -1;
  let pitchInHertz = -1;

  // Step 1: Difference function
  for (let t = 0; t < bufferSize / 2; t++) {
    yinBuffer[t] = 0;
  }
  for (let t = 1; t < bufferSize / 2; t++) {
    for (let i = 0; i < bufferSize / 2; i++) {
      const delta = buffer[i] - buffer[i + t];
      yinBuffer[t] += delta * delta;
    }
  }

  // Step 2: Cumulative mean normalized difference function
  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let t = 1; t < bufferSize / 2; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] *= t / runningSum;
  }

  // Step 3: Absolute threshold
  for (let t = 1; t < bufferSize / 2; t++) {
    if (yinBuffer[t] < threshold) {
      while (t + 1 < bufferSize / 2 && yinBuffer[t + 1] < yinBuffer[t]) {
        t++;
      }
      tauEstimate = t;
      probability = 1 - yinBuffer[t];
      break;
    }
  }

  // Step 4: Convert to frequency
  if (tauEstimate != -1) {
    pitchInHertz = sampleRate / tauEstimate;
  }

  return { pitch: pitchInHertz, probability: probability };
}

//	need to bind this
class AudioManager {
  on = false;
  pitch = null;
  volume = 0;

  async init() {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const audioContext = new AudioContext();
    const proccessor = audioContext.createScriptProcessor();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(proccessor);
    proccessor.connect(audioContext.destination);
    const that = this;

    proccessor.onaudioprocess = function (e) {
      const inputData = e.inputBuffer.getChannelData(0);
      const ouyputData = e.outputBuffer.getChannelData(0);

      for (let i = 0; i < inputData.length; i++) {
        ouyputData[i] = 0; //mute
      }

      that.volume = getVolume(inputData);
      const newOn = that.volume > 0.09;

      if (newOn !== that.on) {
        that.on = newOn;
      }

      const pitchData = getYinPitch(inputData, audioContext.sampleRate);
      that.pitch = pitchData.probability
        ? getNoteFromFrequency(pitchData.pitch).noteNumber
        : null;

        if (that.volume > 0.1) {
          console.log('pitch', that.pitch, 'volumn', that.volume);
        }
    };
  }
}

export const instance = new AudioManager();
instance.init();
