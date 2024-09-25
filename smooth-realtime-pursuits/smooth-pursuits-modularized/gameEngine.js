// gameEngine.js

import { LiveGameState, ReplayGameState } from './state.js';
import { MouseInputHandler, ReplayInputHandler } from './inputHandler.js';
import { Renderer } from './renderer.js';
import { HistoryManager } from './historyManager.js';

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.historyManager = new HistoryManager();
        this.state = null;
        this.inputHandler = null;
        this.config = null;
    }

    startLiveGame(config) {
        this.config = config;
        this.state = new LiveGameState(config);
        this.inputHandler = new MouseInputHandler(this.canvas);
        this.gameLoop();
    }

    startReplay(replayData) {
        this.state = new ReplayGameState(replayData);
        this.inputHandler = new ReplayInputHandler(replayData.positions);
        this.gameLoop();
    }

    gameLoop(timestamp = 0) {
        const input = this.inputHandler.getInput();
        this.state.update(timestamp, input);
        this.renderer.render(this.state.getState());

        if (this.state.isFinished()) {
            this.onGameEnd();
        } else {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    onGameEnd() {
        const score = this.state.getAverageScore();

        if (this.state instanceof LiveGameState) {
            this.historyManager.saveGame(this.state.getState(), this.config);
        }
        this.showResults(score);
    }

    showResults(averageScore) {
        const resultsModal = document.getElementById('results-modal');
        const finalScoreElement = document.getElementById('final-score');
        finalScoreElement.textContent = averageScore.toFixed(2);

        const resultsGraph = document.getElementById('results-graph');
        resultsGraph.width = 400;
        resultsGraph.height = 200;
        this.renderer.drawResultsGraph(this.state.getState().scores, resultsGraph.width, resultsGraph.height);

        resultsModal.style.display = 'block';
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}