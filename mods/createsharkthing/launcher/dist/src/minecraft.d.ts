/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from "child_process";
import { AuthInfo, NoAuthInfo } from "./types/minecraft.types";
export declare function launch(auth: AuthInfo): Promise<ChildProcessWithoutNullStreams | null>;
export declare function launchNoAuth(auth: NoAuthInfo): Promise<ChildProcessWithoutNullStreams | null>;
