// historyManager.js

export class HistoryManager {
    static HISTORY_KEY = 'testHistory';

    saveGame(state, config) {
        const history = this.loadHistory();
        history.push({
            date: new Date().toISOString(),
            score: this.calculateAverageScore(state.scores),
            positions: state.positions,
            config: config
        });
        localStorage.setItem(HistoryManager.HISTORY_KEY, JSON.stringify(history));
    }

    loadHistory() {
        const historyString = localStorage.getItem(HistoryManager.HISTORY_KEY);
        return historyString ? JSON.parse(historyString) : [];
    }

    calculateAverageScore(scores) {
        if (scores.length === 0) {
            return 0;
        }
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }
}