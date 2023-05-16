/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from "child_process";
export declare function initMinecraft(): Promise<unknown>;
interface AuthInfo {
    username: string;
    uuid: string;
    access_token: string;
}
export declare function launch(auth: AuthInfo): Promise<ChildProcessWithoutNullStreams | null>;
export {};
