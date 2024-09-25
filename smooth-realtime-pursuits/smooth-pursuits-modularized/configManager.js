// configManager.js

export class ConfigManager {
    static CONFIG_KEY = 'testConfig';

    saveConfig(config) {
        localStorage.setItem(ConfigManager.CONFIG_KEY, JSON.stringify(config));
    }

    loadConfig() {
        const configString = localStorage.getItem(ConfigManager.CONFIG_KEY);
        if (configString) {
            const config = JSON.parse(configString);
            document.getElementById('difficulty').value = config.difficulty;
            document.getElementById('radius').value = config.radius * 100;
            document.getElementById('wiggle').value = config.wiggle * 100;
            document.getElementById('min-direction-change').value = config.minDirectionChange;
            document.getElementById('max-direction-change').value = config.maxDirectionChange;
            document.getElementById('duration').value = config.duration;

            // Update displayed values
            document.getElementById('difficulty-value').textContent = config.difficulty;
            document.getElementById('radius-value').textContent = config.radius * 100;
            document.getElementById('wiggle-value').textContent = config.wiggle * 100;
        }
    }
}