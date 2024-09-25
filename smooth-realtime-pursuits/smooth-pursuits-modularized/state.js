// state.js

export class State {
    constructor() {
        this.state = this.getInitialState();
    }

    update(timestamp, input) {
        throw new Error("Method 'update()' must be implemented.");
    }

    isFinished() {
        throw new Error("Method 'isFinished()' must be implemented.");
    }

    getAverageScore() {
        throw new Error("Method 'getAverageScore()' must be implemented.");
    }

    getState() {
        return this.state;
    }

    getInitialState() {
        return {
            dotX: 0,
            dotY: 0,
            angle: 0,
            direction: 1,
            nextDirectionChange: Date.now(),
            mouseX: 0,
            mouseY: 0,
            scores: [],
            timeLeft: 0,
            positions: []
        };
    }
}

export class LiveGameState extends State {
    constructor(config) {
        super();
        this.config = config;
        this.state.timeLeft = config.duration;
    }

    update(timestamp, input) {
        const speed = this.config.difficulty * 0.001;
        this.state.angle += speed * this.state.direction;

        const baseRadius = Math.min(window.innerWidth, window.innerHeight) * this.config.radius;
        const wiggleAmount = baseRadius * this.config.wiggle;
        const currentRadius = baseRadius + Math.sin(this.state.angle * 5) * wiggleAmount;

        this.state.dotX = window.innerWidth / 2 + Math.cos(this.state.angle) * currentRadius;
        this.state.dotY = window.innerHeight / 2 + Math.sin(this.state.angle) * currentRadius;

        if (Date.now() > this.state.nextDirectionChange) {
            this.state.direction *= -1;
            this.state.nextDirectionChange = Date.now() + this.getRandomDirectionChangeTime();
        }

        this.state.mouseX = input.x;
        this.state.mouseY = input.y;

        if (timestamp % 20 < 16) {
            this.recordPosition();
        }
        if (timestamp % 100 < 16) {
            this.recordScore();
        }

        this.state.timeLeft -= 1 / 60;  // Assuming 60 FPS
    }

    isFinished() {
        return this.state.timeLeft <= 0;
    }

    getAverageScore() {
        if (this.state.scores.length === 0) {
            return 0;
        }
        return this.state.scores.reduce((a, b) => a + b, 0) / this.state.scores.length;
    }

    recordPosition() {
        this.state.positions.push({
            dotX: this.state.dotX,
            dotY: this.state.dotY,
            mouseX: this.state.mouseX,
            mouseY: this.state.mouseY
        });
    }

    recordScore() {
        const distance = Math.hypot(this.state.mouseX - this.state.dotX, this.state.mouseY - this.state.dotY);
        this.state.scores.push(distance);
    }

    getRandomDirectionChangeTime() {
        return (Math.random() * (this.config.maxDirectionChange - this.config.minDirectionChange) + this.config.minDirectionChange) * 1000;
    }
}

export class ReplayGameState extends State {
    constructor(replayData) {
        super();
        this.replayData = replayData;
        this.state = { ...replayData, positions: [], scores: [] };
        this.currentIndex = 0;
    }

    update(timestamp, input) {
        if (this.currentIndex < this.replayData.positions.length) {
            const position = this.replayData.positions[this.currentIndex];
            this.state.dotX = position.dotX;
            this.state.dotY = position.dotY;
            this.state.mouseX = position.mouseX;
            this.state.mouseY = position.mouseY;
            this.currentIndex++;
        }
        this.state.timeLeft -= 1 / 60;  // Assuming 60 FPS
    }

    isFinished() {
        return this.currentIndex >= this.replayData.positions.length;
    }

    getAverageScore() {
        // This is an example of where it would have paid dividends to use typescript:
        // I had to search to find that replayData had a 'score' field, like 5 layers up.
        return this.replayData.score;
    }
}