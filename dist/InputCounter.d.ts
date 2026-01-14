export declare class InputCounter {
    private rootEl;
    private inputEl;
    private min;
    private max;
    constructor(rootEl: HTMLElement);
    private init;
    private handleButtonClick;
    private handleInputChange;
    private updateValue;
    set(value: number): void;
    static getInstance(rootEl: HTMLElement): InputCounter | undefined;
    destroy(): void;
}
