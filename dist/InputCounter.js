export class InputCounter {
    constructor(rootEl) {
        this.handleButtonClick = (event) => {
            const target = event.target;
            const btn = target?.closest('button');
            if (!btn)
                return;
            const step = Number(btn.dataset.step);
            this.updateValue(Number(this.inputEl.value) + step);
        };
        this.handleInputChange = () => {
            this.updateValue(Number(this.inputEl.value) || this.min);
        };
        if (!rootEl) {
            throw new Error('InputCounter: rootEl is required');
        }
        const inputEl = rootEl.querySelector('input');
        if (!inputEl) {
            throw new Error('InputCounter: <input> element not found');
        }
        this.rootEl = rootEl;
        this.inputEl = inputEl;
        this.min = Number(rootEl.dataset.min) || 0;
        this.max = Number(rootEl.dataset.max) || Infinity;
        // Проверяем, есть ли уже созданный экземпляр
        const existing = rootEl._inputCounterInstance;
        if (existing)
            return existing;
        this.init();
        // Сохраняем экземпляр в DOM
        this.rootEl._inputCounterInstance = this;
    }
    init() {
        this.rootEl.addEventListener('click', this.handleButtonClick);
        this.rootEl.addEventListener('input', this.handleInputChange);
        this.updateValue(Number(this.inputEl.value));
    }
    updateValue(newValue) {
        const clamped = Math.min(this.max, Math.max(this.min, newValue));
        this.inputEl.value = String(clamped);
        this.inputEl.style.width = `${String(clamped).length}ch`;
    }
    set(value) {
        this.updateValue(value);
    }
    // Получить экземпляр по DOM-элементу
    static getInstance(rootEl) {
        return rootEl._inputCounterInstance;
    }
    destroy() {
        this.rootEl.removeEventListener('click', this.handleButtonClick);
        this.rootEl.removeEventListener('input', this.handleInputChange);
        delete this.rootEl._inputCounterInstance;
    }
}
