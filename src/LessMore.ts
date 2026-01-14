interface ILessMoreOptions {
  btnOpenedClass?: string;
  listOpenedClass?: string;
}

export class LessMore {
  private btnEl: HTMLElement;
  private listEl: HTMLElement;
  private options: Required<ILessMoreOptions>;
  private initializedClass = 'lessmore-initialized';

  constructor(btnEl: HTMLAnchorElement, options: ILessMoreOptions = {}) {
    if (!btnEl) {
      throw new Error('LessMore: btnEl is required');
    }

    this.btnEl = btnEl;

    this.options = {
      btnOpenedClass: 'opened',
      listOpenedClass: 'opened',
      ...options,
    };

    const listSelector = btnEl.hash || btnEl.dataset.target;
    if (!listSelector) {
      throw new Error('LessMore: btn has not list selector');
    }

    const listEl = document.querySelector<HTMLElement>(listSelector);
    if (!listEl) {
      throw new Error('LessMore: listEl not found');
    }

    this.listEl = listEl;

    // Проверяем, есть ли уже созданный экземпляр
    const existing = (btnEl as any)._lessmoreInstance as LessMore;
    if (existing) return existing;

    this.init();

    // Сохраняем экземпляр в DOM
    (this.btnEl as any)._lessmoreInstance = this;
  }

  // Инициализация кнопки
  private init(): void {
    this.btnEl.classList.add(this.initializedClass);

    this.btnEl.addEventListener('click', this.handleButtonClick);
  }

  // Обработчик клика
  private handleButtonClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.toggle();
  };

  // Переключить состояние
  public toggle(): void {
    if (this.btnEl.classList.contains(this.options.btnOpenedClass)) {
      this.close();
    } else {
      this.open();
    }
  }

  // Открыть список
  public open(): void {
    this.btnEl.classList.add(this.options.btnOpenedClass);
    this.listEl.classList.add(this.options.listOpenedClass);
  }

  // Закрыть список
  public close(): void {
    this.btnEl.classList.remove(this.options.btnOpenedClass);
    this.listEl.classList.remove(this.options.listOpenedClass);
  }

  // Получить экземпляр по DOM-элементу
  public static getInstance(btnEl: HTMLElement): LessMore | undefined {
    return (btnEl as any)._lessmoreInstance as LessMore | undefined;
  }

  // Удалить экземпляр и обработчик
  public destroy(): void {
    this.btnEl.classList.remove(this.initializedClass);
    this.btnEl.removeEventListener('click', this.handleButtonClick);
    delete (this.btnEl as any)._lessmoreInstance;
  }
}
