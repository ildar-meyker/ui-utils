interface ILessMoreOptions {
    btnOpenedClass?: string;
    listOpenedClass?: string;
}
export declare class LessMore {
    private btnEl;
    private listEl;
    private options;
    private initializedClass;
    constructor(btnEl: HTMLAnchorElement, options?: ILessMoreOptions);
    private init;
    private handleButtonClick;
    toggle(): void;
    open(): void;
    close(): void;
    static getInstance(btnEl: HTMLElement): LessMore | undefined;
    destroy(): void;
}
export {};
