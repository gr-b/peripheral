// inputHandler.js

export class InputHandler {
    getInput() {
        throw new Error("Method 'getInput()' must be implemented.");
    }
}

export class MouseInputHandler extends InputHandler {
    constructor(canvas) {
        super();
        this.mouseX = 0;
        this.mouseY = 0;
        this.setupEventListeners(canvas);
    }

    getInput() {
        return { x: this.mouseX, y: this.mouseY };
    }

    setupEventListeners(canvas) {
        canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
}

export class ReplayInputHandler extends InputHandler {
    constructor(replayData) {
        super();
        this.replayData = replayData;
        this.currentIndex = 0;
    }

    getInput() {
        if (this.currentIndex < this.replayData.length) {
            const input = this.replayData[this.currentIndex];
            this.currentIndex++;
            return { x: input.mouseX, y: input.mouseY };
        }
        return { x: 0, y: 0 };
    }
}