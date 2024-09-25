// historyManager.js
export class HistoryManager {
    constructor() {
        this.storageKey = 'testHistory';
    }

    saveResult(result) {
        let history = this.getHistory();
        history.push(result);
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    getHistory() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }
}