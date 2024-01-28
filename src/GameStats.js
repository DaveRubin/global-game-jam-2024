class GameStats {
    collect() {
        this.coins++;
    }
    move() {
        this.moves++;
    }
    start(now) {
        this.startTime = now;
        this.coins = 0;
        this.moves = 0;
    }
    end(now) {
        this.endTime = now;
        this.timeToPlay = this.endTime - this.startTime;
    }
    getTotalTime() {
        let s = this.timeToPlay;
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
        let hrs = (s - mins) / 60;
        
        return (mins.toString().length === 1 ? '0' + mins : mins) + ':' + (secs.toString().length === 1 ? '0' + secs : secs);
    }
}
export const Stats = new GameStats();
