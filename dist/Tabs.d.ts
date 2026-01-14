interface ITabsOptions {
    btnSelector?: string;
    btnActiveClass?: string;
    blockActiveClass?: string;
    delegateActiveClassToButtonParent?: boolean;
    onSelected?: (btn: HTMLElement) => void;
}
export declare class Tabs {
    private rootEl;
    private options;
    private initializedClass;
    constructor(rootEl: HTMLElement, options?: ITabsOptions);
    private init;
    private handleBtnClick;
    private setActiveBtn;
    private setActiveBlock;
    static getInstance(rootEl: HTMLElement): Tabs | undefined;
    destroy(): void;
}
export {};
