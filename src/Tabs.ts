interface ITabsOptions {
  btnSelector?: string;
  btnActiveClass?: string;
  blockActiveClass?: string;
  delegateActiveClassToButtonParent?: boolean;
  onSelected?: (btn: HTMLElement) => void;
}

export class Tabs {
  private rootEl: HTMLElement;
  private options: Required<ITabsOptions>;
  private initializedClass = 'tabs-initialized';

  constructor(rootEl: HTMLElement, options: ITabsOptions = {}) {
    if (!rootEl) {
      throw new Error('Tabs: rootEl element is required. Test');
    }

    this.rootEl = rootEl;

    this.options = {
      btnSelector: '.js-tabs-btn',
      btnActiveClass: 'active',
      blockActiveClass: 'active',
      delegateActiveClassToButtonParent: false,
      onSelected: () => {},
      ...options,
    };

    // Проверяем, есть ли уже созданный экземпляр
    const existing = (rootEl as any)._tabsInstance as Tabs;
    if (existing) return existing;

    this.init();

    (this.rootEl as any)._tabsInstance = this;
  }

  private init(): void {
    this.rootEl.classList.add(this.initializedClass);

    this.rootEl.addEventListener('click', this.handleBtnClick);
  }

  private handleBtnClick = (event: MouseEvent): void => {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const btnEl = target.closest<HTMLElement>(this.options.btnSelector);
    if (!btnEl || !this.rootEl.contains(btnEl)) return;

    if (btnEl.classList.contains(this.options.btnActiveClass)) return;

    const blockSelector = btnEl.getAttribute('href') || btnEl.getAttribute('data-target');
    if (!blockSelector) return;

    const blockEl = document.querySelector<HTMLElement>(blockSelector);
    if (!blockEl) return;

    this.setActiveBtn(btnEl);
    this.setActiveBlock(blockEl);
    this.options.onSelected(btnEl);
  };

  private setActiveBtn(btnEl: HTMLElement): void {
    const {
      btnSelector,
      btnActiveClass,
      delegateActiveClassToButtonParent: delegateClass,
    } = this.options;

    // remove all active classes
    this.rootEl.querySelectorAll<HTMLElement>(btnSelector).forEach((siblingEl) => {
      const targetEl = delegateClass ? siblingEl.parentElement : siblingEl;
      targetEl?.classList.remove(btnActiveClass);
    });

    // set active class for current
    const targetEl = delegateClass ? btnEl.parentElement : btnEl;
    targetEl?.classList.add(btnActiveClass);
  }

  private setActiveBlock(blockEl: HTMLElement): void {
    const { blockActiveClass } = this.options;

    // remove all active classes
    Array.from(blockEl.parentElement!.children).forEach((siblingEl) =>
      siblingEl.classList.remove(blockActiveClass),
    );

    // set active class for current
    blockEl.classList.add(blockActiveClass);
  }

  public static getInstance(rootEl: HTMLElement): Tabs | undefined {
    return (rootEl as any)._tabsInstance as Tabs | undefined;
  }

  public destroy(): void {
    this.rootEl.classList.remove(this.initializedClass);
    this.rootEl.removeEventListener('click', this.handleBtnClick);
    delete (this.rootEl as any)._tabsInstance;
  }
}
