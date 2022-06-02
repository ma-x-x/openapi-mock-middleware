import { OpenAPIV3 } from 'openapi-types';
import { Request } from 'express';
import { JSFOptions, JSF, JSFCallback, requestType, responseType } from '../utils';
import { Operation } from './operation';
export declare class Operations {
    operations: Operation[] | null;
    spec: string | string[] | OpenAPIV3.Document;
    ignore?: string | string[] | RegExp | RegExp[];
    ext?: string | string[];
    generator: JSF;
    constructor({ request, response, }: {
        request: requestType;
        response?: responseType;
    });
    parseFileToApiRoutersArr(): Promise<OpenAPIV3.Document<{}>[]>;
    reset(): void;
    watch(): void;
    compile(): Promise<void>;
    compileFromPath(pathName: string, pathOperations: OpenAPIV3.PathItemObject, securitySchemes?: {
        [key: string]: OpenAPIV3.SecuritySchemeObject;
    }): Operation[];
    match(req: Request): Promise<Operation | null>;
}
export declare const createOperations: ({ request, response, }: {
    request: requestType;
    response?: Partial<{
        locale: string;
        options: Partial<JSFOptions>;
        callback: JSFCallback;
        withResponse?: (<T>(data: T) => any) | undefined;
    }> | undefined;
}) => Operations;
