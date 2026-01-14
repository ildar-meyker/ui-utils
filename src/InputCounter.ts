export class InputCounter {
  private rootEl: HTMLElement;
  private inputEl: HTMLInputElement;
  private min: number;
  private max: number;

  constructor(rootEl: HTMLElement) {
    if (!rootEl) {
      throw new Error('InputCounter: rootEl is required');
    }

    const inputEl = rootEl.querySelector<HTMLInputElement>('input');
    if (!inputEl) {
      throw new Error('InputCounter: <input> element not found');
    }

    this.rootEl = rootEl;
    this.inputEl = inputEl;

    this.min = Number(rootEl.dataset.min) || 0;
    this.max = Number(rootEl.dataset.max) || Infinity;

    // Проверяем, есть ли уже созданный экземпляр
    const existing = (rootEl as any)._inputCounterInstance as InputCounter;
    if (existing) return existing;

    this.init();

    // Сохраняем экземпляр в DOM
    (this.rootEl as any)._inputCounterInstance = this;
  }

  private init(): void {
    this.rootEl.addEventListener('click', this.handleButtonClick);
    this.rootEl.addEventListener('input', this.handleInputChange);
    this.updateValue(Number(this.inputEl.value));
  }

  private handleButtonClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    const btn = target?.closest<HTMLButtonElement>('button');
    if (!btn) return;

    const step = Number(btn.dataset.step);
    this.updateValue(Number(this.inputEl.value) + step);
  };

  private handleInputChange = (): void => {
    this.updateValue(Number(this.inputEl.value) || this.min);
  };

  private updateValue(newValue: number): void {
    const clamped = Math.min(this.max, Math.max(this.min, newValue));
    this.inputEl.value = String(clamped);
    this.inputEl.style.width = `${String(clamped).length}ch`;
  }

  public set(value: number): void {
    this.updateValue(value);
  }

  // Получить экземпляр по DOM-элементу
  public static getInstance(rootEl: HTMLElement): InputCounter | undefined {
    return (rootEl as any)._inputCounterInstance as InputCounter | undefined;
  }

  public destroy(): void {
    this.rootEl.removeEventListener('click', this.handleButtonClick);
    this.rootEl.removeEventListener('input', this.handleInputChange);
    delete (this.rootEl as any)._inputCounterInstance;
  }
}
