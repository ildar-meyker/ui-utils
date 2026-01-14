export class Tabs {
    constructor(rootEl, options = {}) {
        this.initializedClass = 'tabs-initialized';
        this.handleBtnClick = (event) => {
            event.preventDefault();
            const target = event.target;
            const btnEl = target.closest(this.options.btnSelector);
            if (!btnEl || !this.rootEl.contains(btnEl))
                return;
            if (btnEl.classList.contains(this.options.btnActiveClass))
                return;
            const blockSelector = btnEl.getAttribute('href') || btnEl.getAttribute('data-target');
            if (!blockSelector)
                return;
            const blockEl = document.querySelector(blockSelector);
            if (!blockEl)
                return;
            this.setActiveBtn(btnEl);
            this.setActiveBlock(blockEl);
            this.options.onSelected(btnEl);
        };
        if (!rootEl) {
            throw new Error('Tabs: rootEl element is required');
        }
        this.rootEl = rootEl;
        this.options = {
            btnSelector: '.js-tabs-btn',
            btnActiveClass: 'active',
            blockActiveClass: 'active',
            delegateActiveClassToButtonParent: false,
            onSelected: () => { },
            ...options,
        };
        // Проверяем, есть ли уже созданный экземпляр
        const existing = rootEl._tabsInstance;
        if (existing)
            return existing;
        this.init();
        this.rootEl._tabsInstance = this;
    }
    init() {
        this.rootEl.classList.add(this.initializedClass);
        this.rootEl.addEventListener('click', this.handleBtnClick);
    }
    setActiveBtn(btnEl) {
        const { delegateActiveClassToButtonParent: delegateClass } = this.options;
        this.rootEl.querySelectorAll(this.options.btnSelector).forEach((item) => {
            const usedItem = delegateClass ? item.parentElement : item;
            usedItem?.classList.remove(this.options.btnActiveClass);
        });
        const usedBtn = delegateClass ? btnEl.parentElement : btnEl;
        usedBtn?.classList.add(this.options.btnActiveClass);
    }
    setActiveBlock(blockEl) {
        Array.from(blockEl.parentElement.children).forEach((siblingEl) => siblingEl.classList.remove(this.options.blockActiveClass));
        blockEl.classList.add(this.options.blockActiveClass);
    }
    static getInstance(rootEl) {
        return rootEl._tabsInstance;
    }
    destroy() {
        this.rootEl.classList.remove(this.initializedClass);
        this.rootEl.removeEventListener('click', this.handleBtnClick);
        delete this.rootEl._tabsInstance;
    }
}
