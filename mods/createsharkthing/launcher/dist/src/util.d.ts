import { OwnsGameFastAuth } from "./types/auth.types";
declare function run(): {
    browser: string;
    app: string;
} | undefined;
interface File {
    account: OwnsGameFastAuth;
}
export declare function getKey(): void;
export declare function setKeys(file: File): void;
export declare function checkWifi(): Promise<unknown>;
export { run as get };
