// uiManager.js
export class UIManager {
    constructor(configManager, gameManager) {
        this.configManager = configManager;
        this.gameManager = gameManager;
        this.mainMenu = document.getElementById('mainMenu');
        this.configModal = document.getElementById('configModal');
        this.resultsModal = document.getElementById('resultsModal');
        this.historySubmenu = document.getElementById('historySubmenu');
    }

    showMainMenu() {
        this.mainMenu.style.display = 'block';
        this.configModal.style.display = 'none';
        this.resultsModal.style.display = 'none';
        this.historySubmenu.style.display = 'none';
    }

    showConfigModal() {
        this.mainMenu.style.display = 'none';
        this.configModal.style.display = 'block';
    }

    hideConfigModal() {
        this.configModal.style.display = 'none';
    }

    showResultsModal(timeTaken) {
        document.getElementById('timeTaken').textContent = `${timeTaken.toFixed(2)} seconds`;
        this.resultsModal.style.display = 'block';
    }

    showHistorySubmenu(historyData) {
        this.mainMenu.style.display = 'none';
        this.historySubmenu.style.display = 'block';

        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';

        historyData.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Date:</strong> ${new Date(entry.date).toLocaleString()}<br>
                <strong>Time taken:</strong> ${entry.timeTaken.toFixed(2)} seconds<br>
                <strong>Settings:</strong> 
                Letter size: ${entry.config.letterSize}, 
                Number of letters: ${entry.config.numLetters}, 
                Exclusion radius: ${entry.config.exclusionRadius}, 
                Motion mode: ${entry.config.motionMode ? 'On' : 'Off'}, 
                Motion speed: ${entry.config.motionSpeed}
                <button class="replayBtn" data-index="${index}">Replay with these settings</button>
            `;
            historyList.appendChild(listItem);
        });

        historyList.addEventListener('click', (e) => {
            if (e.target.classList.contains('replayBtn')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.replayTest(historyData[index].config);
            }
        });
    }

    replayTest(config) {
        this.configManager.updateConfig(config);
        this.showConfigModal();
    }
}