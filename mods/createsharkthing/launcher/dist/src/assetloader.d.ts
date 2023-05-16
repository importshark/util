type File = "audio" | "css" | "font" | "html" | "image" | "js" | "other" | "view";
interface ViewParams {
    [key: string]: string | number;
}
export declare function getPath(file: string, type: File): string;
export declare function getView(view: string, data: ViewParams): string;
export {};
