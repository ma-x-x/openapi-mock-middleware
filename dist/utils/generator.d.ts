import { JSF, JSFOptions } from 'json-schema-faker';
import { faker } from '@faker-js/faker';
import type { OpenAPIV3 } from 'openapi-types';
export { JSONSchema, JSFOptions, JSF } from 'json-schema-faker';
export declare type JSFCallback = (jsfInstance: JSF, fakerObject: typeof faker) => void;
export declare type requestType = {
    spec: string | string[] | OpenAPIV3.Document;
    ignore?: string | string[] | RegExp | RegExp[];
    ext?: string | string[];
    isValidate?: boolean;
};
export declare type responseType = Partial<{
    locale: string;
    options: Partial<JSFOptions>;
    callback: JSFCallback;
    withResponse: <T>(data: T) => any;
}>;
export declare const handleExamples: (value: any) => any;
export declare const createGenerator: (response?: responseType) => JSF;
