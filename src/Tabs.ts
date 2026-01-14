interface ITabsOptions {
  btnSelector?: string;
  btnActiveClass?: string;
  paneActiveClass?: string;
  delegateActiveClassToButtonParent?: boolean;
  onSelected?: (btn: HTMLElement) => void;
}

export class Tabs {
  private rootEl: HTMLElement;
  private options: Required<ITabsOptions>;
  private initializedClass = "tabs-initialized";

  constructor(rootEl: HTMLElement, options: ITabsOptions = {}) {
    if (!rootEl) {
      throw new Error("Tabs: rootEl element is required");
    }

    this.rootEl = rootEl;

    this.options = {
      btnSelector: ".js-tabs-btn",
      btnActiveClass: "active",
      paneActiveClass: "active",
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

    this.rootEl.addEventListener("click", this.handleButtonClick);
  }

  private handleButtonClick = (event: MouseEvent): void => {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLElement>(this.options.btnSelector);
    if (!btn || !this.rootEl.contains(btn)) return;

    if (btn.classList.contains(this.options.btnActiveClass)) return;

    const paneSelector =
      btn.getAttribute("href") || btn.getAttribute("data-target");
    if (!paneSelector) return;

    const pane = document.querySelector<HTMLElement>(paneSelector);
    if (!pane) return;

    this.setActiveBtn(btn);
    this.setActivePane(pane);
    this.options.onSelected(btn);
  };

  private setActiveBtn(btn: HTMLElement): void {
    this.rootEl
      .querySelectorAll<HTMLElement>(this.options.btnSelector)
      .forEach((item) => {
        const usedItem = this.options.delegateActiveClassToButtonParent
          ? item.parentElement
          : item;
        usedItem?.classList.remove(this.options.btnActiveClass);
      });

    const usedBtn = this.options.delegateActiveClassToButtonParent
      ? btn.parentElement
      : btn;
    usedBtn?.classList.add(this.options.btnActiveClass);
  }

  private setActivePane(pane: HTMLElement): void {
    Array.from(pane.parentElement!.children).forEach((item) =>
      item.classList.remove(this.options.paneActiveClass)
    );

    pane.classList.add(this.options.paneActiveClass);
  }

  public static getInstance(rootEl: HTMLElement): Tabs | undefined {
    return (rootEl as any)._tabsInstance as Tabs | undefined;
  }

  public destroy(): void {
    this.rootEl.classList.remove(this.initializedClass);
    this.rootEl.removeEventListener("click", this.handleButtonClick);
    delete (this.rootEl as any)._tabsInstance;
  }
}
