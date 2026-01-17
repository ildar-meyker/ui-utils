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
            throw new Error('Tabs: rootEl element is required. Test');
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
        const { btnSelector, btnActiveClass, delegateActiveClassToButtonParent: delegateClass, } = this.options;
        // remove all active classes
        this.rootEl.querySelectorAll(btnSelector).forEach((siblingEl) => {
            const targetEl = delegateClass ? siblingEl.parentElement : siblingEl;
            targetEl?.classList.remove(btnActiveClass);
        });
        // set active class for current
        const targetEl = delegateClass ? btnEl.parentElement : btnEl;
        targetEl?.classList.add(btnActiveClass);
    }
    setActiveBlock(blockEl) {
        const { blockActiveClass } = this.options;
        // remove all active classes
        Array.from(blockEl.parentElement.children).forEach((siblingEl) => siblingEl.classList.remove(blockActiveClass));
        // set active class for current
        blockEl.classList.add(blockActiveClass);
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
