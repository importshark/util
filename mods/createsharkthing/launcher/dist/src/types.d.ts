export type threeenum = 0 | 1 | 2;
export declare class varlistener<T> {
    #private;
    value: T;
    constructor(basevalue: T);
    set(newvalue: T): void;
    get(): T;
    addListener(listenerfunction: (value: T, newvalue: T) => any): void;
}
