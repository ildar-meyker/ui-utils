export class LessMore {
    constructor(btnEl, options = {}) {
        this.initializedClass = "lessmore-initialized";
        // Обработчик клика
        this.handleButtonClick = (event) => {
            event.preventDefault();
            this.toggle();
        };
        if (!btnEl) {
            throw new Error("LessMore: btnEl is required");
        }
        this.btnEl = btnEl;
        this.options = {
            btnOpenedClass: "opened",
            listOpenedClass: "opened",
            ...options,
        };
        const listSelector = btnEl.hash || btnEl.dataset.target;
        if (!listSelector) {
            throw new Error("LessMore: btn has not list selector");
        }
        const listEl = document.querySelector(listSelector);
        if (!listEl) {
            throw new Error("LessMore: listEl not found");
        }
        this.listEl = listEl;
        // Проверяем, есть ли уже созданный экземпляр
        const existing = btnEl._lessmoreInstance;
        if (existing)
            return existing;
        this.init();
        // Сохраняем экземпляр в DOM
        this.btnEl._lessmoreInstance = this;
    }
    // Инициализация кнопки
    init() {
        this.btnEl.classList.add(this.initializedClass);
        this.btnEl.addEventListener("click", this.handleButtonClick);
    }
    // Переключить состояние
    toggle() {
        if (this.btnEl.classList.contains(this.options.btnOpenedClass)) {
            this.close();
        }
        else {
            this.open();
        }
    }
    // Открыть список
    open() {
        this.btnEl.classList.add(this.options.btnOpenedClass);
        this.listEl.classList.add(this.options.listOpenedClass);
    }
    // Закрыть список
    close() {
        this.btnEl.classList.remove(this.options.btnOpenedClass);
        this.listEl.classList.remove(this.options.listOpenedClass);
    }
    // Получить экземпляр по DOM-элементу
    static getInstance(btnEl) {
        return btnEl._lessmoreInstance;
    }
    // Удалить экземпляр и обработчик
    destroy() {
        this.btnEl.classList.remove(this.initializedClass);
        this.btnEl.removeEventListener("click", this.handleButtonClick);
        delete this.btnEl._lessmoreInstance;
    }
}
