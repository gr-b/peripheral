// configManager.js
export class ConfigManager {
    constructor() {
        this.config = {
            letterSize: 50,
            numLetters: 26,
            exclusionRadius: 100,
            highlightTarget: false,
            motionMode: false,
            rotateLetters: false,
            motionSpeed: 5,
            disappearLetters: false
        };

        this.initializeConfigUI();
    }

    initializeConfigUI() {
        const configInputs = [
            { id: 'letterSize', min: 20, max: 200, step: 5 },
            { id: 'numLetters', min: 5, max: 26, step: 1 },
            { id: 'exclusionRadius', min: 0, max: 500, step: 25 },
            { id: 'motionSpeed', min: 1, max: 10, step: 1 }
        ];

        configInputs.forEach(input => {
            const element = document.getElementById(input.id);
            element.min = input.min;
            element.max = input.max;
            element.step = input.step;
            element.value = this.config[input.id];
            element.addEventListener('input', (e) => this.updateConfig(input.id, parseFloat(e.target.value)));
        });

        ['highlightTarget', 'motionMode', 'rotateLetters', 'disappearLetters'].forEach(id => {
            const element = document.getElementById(id);
            element.checked = this.config[id];
            element.addEventListener('change', (e) => this.updateConfig(id, e.target.checked));
        });

        this.updateConfigUI();
    }

    updateConfig(key, value) {
        this.config[key] = value;
        this.updateConfigUI();
    }

    updateConfigUI() {
        for (const [key, value] of Object.entries(this.config)) {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else if (element.type === 'range') {
                    element.value = value;
                    document.getElementById(`${key}Value`).textContent = value;
                }
            }
        }

        // Update letter size preview
        const preview = document.getElementById('letterSizePreview');
        preview.style.fontSize = `${this.config.letterSize}px`;
        preview.textContent = 'A';
    }

    getConfig() {
        return { ...this.config };
    }
}