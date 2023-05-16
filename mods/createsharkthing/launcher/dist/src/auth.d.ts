import { AuthSuccess, AuthFail, FastAuthError, NotOwnsGameFastAuth, OwnsGameFastAuth, AuthEvent } from "./types/auth.types";
export declare function authenticate(code: string, update: (event: AuthEvent) => void): Promise<AuthSuccess | AuthFail>;
declare function AuthSuccess(input: AuthSuccess | AuthFail): input is AuthSuccess;
export declare function fastAuth(code: string, update: (event: AuthEvent) => void): Promise<OwnsGameFastAuth | NotOwnsGameFastAuth | FastAuthError>;
export declare function getLink(): string;
export declare function getBrowser(): string | false;
export {};
