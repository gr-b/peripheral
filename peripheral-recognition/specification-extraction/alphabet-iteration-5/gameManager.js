// gameManager.js
export class GameManager {
    constructor(configManager) {
        this.configManager = configManager;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.letters = [];
        this.currentLetterIndex = 0;
        this.startTime = null;
        this.animationId = null;
    }

    startGame() {
        const config = this.configManager.getConfig();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.display = 'block';
        document.getElementById('exitGameBtn').style.display = 'block';

        this.letters = this.generateLetters(config);
        this.currentLetterIndex = 0;
        this.startTime = Date.now();

        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.animate();
    }

    generateLetters(config) {
        const letters = [];
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, config.numLetters);

        for (let i = 0; i < config.numLetters; i++) {
            let x, y;
            do {
                x = Math.random() * (this.canvas.width - config.letterSize);
                y = Math.random() * (this.canvas.height - config.letterSize);
            } while (this.isOverlapping(x, y, config.letterSize, letters) ||
            this.isInExclusionZone(x, y, config.letterSize, config.exclusionRadius));

            letters.push({
                letter: alphabet[i],
                x,
                y,
                dx: config.motionMode ? (Math.random() - 0.5) * config.motionSpeed : 0,
                dy: config.motionMode ? (Math.random() - 0.5) * config.motionSpeed : 0,
                visible: true
            });
        }

        return letters;
    }

    isOverlapping(x, y, size, letters) {
        for (const letter of letters) {
            const dx = x - letter.x;
            const dy = y - letter.y;
            if (Math.sqrt(dx * dx + dy * dy) < size) {
                return true;
            }
        }
        return false;
    }

    isInExclusionZone(x, y, size, exclusionRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = x + size / 2 - centerX;
        const dy = y + size / 2 - centerY;
        return Math.sqrt(dx * dx + dy * dy) < exclusionRadius;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const config = this.configManager.getConfig();

        // Draw exclusion zone
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, config.exclusionRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        this.ctx.fill();

        // Draw target letter
        this.ctx.font = `${config.letterSize}px Arial`;
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.letters[this.currentLetterIndex].letter, this.canvas.width / 2, this.canvas.height / 2);

        // Draw letters
        for (const letter of this.letters) {
            if (!letter.visible) continue;

            if (config.motionMode) {
                letter.x += letter.dx;
                letter.y += letter.dy;

                if (letter.x < 0 || letter.x > this.canvas.width - config.letterSize) letter.dx *= -1;
                if (letter.y < 0 || letter.y > this.canvas.height - config.letterSize) letter.dy *= -1;

                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const dx = letter.x + config.letterSize / 2 - centerX;
                const dy = letter.y + config.letterSize / 2 - centerY;
                if (Math.sqrt(dx * dx + dy * dy) < config.exclusionRadius) {
                    letter.dx *= -1;
                    letter.dy *= -1;
                }
            }

            this.ctx.save();
            if (config.rotateLetters) {
                this.ctx.translate(letter.x + config.letterSize / 2, letter.y + config.letterSize / 2);
                this.ctx.rotate(-Math.PI / 2);
                this.ctx.translate(-config.letterSize / 2, -config.letterSize / 2);
            } else {
                this.ctx.translate(letter.x, letter.y);
            }

            if (config.highlightTarget && letter === this.letters[this.currentLetterIndex]) {
                this.ctx.fillStyle = 'yellow';
                this.ctx.fillRect(0, 0, config.letterSize, config.letterSize);
            }

            this.ctx.fillStyle = 'black';
            this.ctx.fillText(letter.letter, config.letterSize / 2, config.letterSize / 2);
            this.ctx.restore();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleClick(event) {
        const config = this.configManager.getConfig();
        const clickX = event.clientX;
        const clickY = event.clientY;

        const currentLetter = this.letters[this.currentLetterIndex];
        const letterBounds = {
            left: currentLetter.x,
            right: currentLetter.x + config.letterSize,
            top: currentLetter.y,
            bottom: currentLetter.y + config.letterSize
        };

        if (clickX >= letterBounds.left && clickX <= letterBounds.right &&
            clickY >= letterBounds.top && clickY <= letterBounds.bottom) {
            this.handleCorrectClick();
        }
    }

    handleCorrectClick() {
        const config = this.configManager.getConfig();

        if (config.disappearLetters) {
            this.letters[this.currentLetterIndex].visible = false;
        }

        this.currentLetterIndex++;

        if (this.currentLetterIndex >= this.letters.length) {
            this.endGame();
        } else {
            this.showConfetti();
        }
    }

    showConfetti() {
        // Implement confetti effect here
        console.log("Confetti!");
    }

    endGame(exited = false) {
        this.canvas.removeEventListener('click', this.handleClick);
        cancelAnimationFrame(this.animationId);
        this.canvas.style.display = 'none';
        document.getElementById('exitGameBtn').style.display = 'none';

        if (!exited) {
            const endTime = Date.now();
            const timeTaken = (endTime - this.startTime) / 1000; // Convert to seconds
            this.saveResult(timeTaken);
            this.showResults(timeTaken);
        }
    }

    saveResult(timeTaken) {
        const config = this.configManager.getConfig();
        const result = {
            date: new Date().toISOString(),
            timeTaken,
            config
        };

        let history = JSON.parse(localStorage.getItem('testHistory')) || [];
        history.push(result);
        localStorage.setItem('testHistory', JSON.stringify(history));
    }

    showResults(timeTaken) {
        document.getElementById('timeTaken').textContent = `${timeTaken.toFixed(2)} seconds`;
        document.getElementById('resultsModal').style.display = 'block';
    }
}