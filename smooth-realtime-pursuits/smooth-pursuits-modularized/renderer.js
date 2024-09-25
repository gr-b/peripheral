// renderer.js

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    render(state) {
        this.clear();
        this.drawCenterDot();
        this.drawMovingDot(state.dotX, state.dotY);
        this.drawLine(state.mouseX, state.mouseY, state.dotX, state.dotY);
        this.drawTimer(state.timeLeft);
    }

    drawResultsGraph(scores, width, height) {
        this.clear();
        const padding = 40;
        const graphWidth = width - padding * 2;
        const graphHeight = height - padding * 2;

        // Draw axes
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();

        // Draw labels
        this.ctx.fillStyle = 'black';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Time', width / 2, height - padding / 2);
        this.ctx.save();
        this.ctx.translate(padding / 2, height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Distance', 0, 0);
        this.ctx.restore();

        // Draw data points
        const xStep = graphWidth / (scores.length - 1);
        const yScale = graphHeight / Math.max(...scores);
        this.ctx.beginPath();
        this.ctx.moveTo(padding, height - padding - scores[0] * yScale);
        for (let i = 1; i < scores.length; i++) {
            this.ctx.lineTo(padding + i * xStep, height - padding - scores[i] * yScale);
        }
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCenterDot() {
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawMovingDot(x, y) {
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawLine(fromX, fromY, toX, toY) {
        const distance = Math.hypot(fromX - toX, fromY - toY);
        const maxDistance = Math.hypot(this.canvas.width, this.canvas.height);
        const opacity = Math.max(0, 1 - distance / maxDistance);
        this.ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();
    }

    drawTimer(timeLeft) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Time: ${Math.ceil(timeLeft)}s`, 10, 30);
    }
}