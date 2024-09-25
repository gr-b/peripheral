// main.js
import { ConfigManager } from './configManager.js';
import { GameManager } from './gameManager.js';
import { UIManager } from './uiManager.js';
import { HistoryManager } from './historyManager.js';

class App {
    constructor() {
        this.configManager = new ConfigManager();
        this.gameManager = new GameManager(this.configManager);
        this.uiManager = new UIManager(this.configManager, this.gameManager);
        this.historyManager = new HistoryManager();

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('startTestBtn').addEventListener('click', () => this.uiManager.showConfigModal());
        document.getElementById('viewHistoryBtn').addEventListener('click', () => this.showHistory());
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.uiManager.showMainMenu());
        document.getElementById('backToMenuFromHistoryBtn').addEventListener('click', () => this.uiManager.showMainMenu());
        document.getElementById('exitGameBtn').addEventListener('click', () => this.exitGame());
    }

    startGame() {
        this.uiManager.hideConfigModal();
        this.gameManager.startGame();
    }

    exitGame() {
        this.gameManager.endGame(true);
        this.uiManager.showMainMenu();
    }

    showHistory() {
        const historyData = this.historyManager.getHistory();
        this.uiManager.showHistorySubmenu(historyData);
    }
}

const app = new App();