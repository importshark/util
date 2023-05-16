interface IEvent {
    progress: number;
    name: string;
}
export declare function load(update: (event: IEvent) => void): Promise<void>;
export {};
