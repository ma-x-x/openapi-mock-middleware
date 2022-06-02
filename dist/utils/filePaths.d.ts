declare type optsType = {
    ignore?: string | string[] | RegExp | RegExp[];
    ext?: string | string[];
} | undefined;
export declare const getSync: (paths?: string | string[], opts?: optsType) => string[];
export {};
