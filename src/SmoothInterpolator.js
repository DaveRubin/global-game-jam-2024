export class SmoothInterpolator {
    constructor(windowSize) {
        this.windowSize = windowSize;
        this.pitchValues = [];
    }

    addPitchValue(value) {
        this.pitchValues.push(value);
        if (this.pitchValues.length > this.windowSize) {
            this.pitchValues.shift(); // Remove oldest value if window size exceeded
        }
    }

    clear() {
        this.pitchValues = [];
    }

    smoothInterpolate() {
        // Calculate the average pitch value
        const sum = this.pitchValues.reduce((acc, val) => acc + val, 0);
        const average = sum / this.pitchValues.length;

        // You can implement various interpolation techniques here
        // For simplicity, let's use linear interpolation between the latest X values
        const latestValues = this.pitchValues.slice(-this.windowSize);
        const interpolatedValue = latestValues.reduce((acc, val) => acc + val, 0) / latestValues.length;

        return interpolatedValue;
    }
}