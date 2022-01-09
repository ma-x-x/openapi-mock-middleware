import { OpenAPIV3 } from 'openapi-types';
import express from 'express';
import { JSF, JSONSchema } from '../utils';
export interface ParamsSchemas {
    header: JSONSchema;
    query: JSONSchema;
    path: JSONSchema;
}
export declare class Operation {
    method: string;
    pathRegexp: RegExp;
    operation: OpenAPIV3.OperationObject;
    pathPattern: string;
    generator: JSF;
    securitySchemes: {
        [key: string]: OpenAPIV3.SecuritySchemeObject;
    } | null;
    constructor({ method, path, operation, securitySchemes, generator, }: {
        path: string;
        method: string;
        operation: OpenAPIV3.OperationObject;
        generator: JSF;
        securitySchemes?: {
            [key: string]: OpenAPIV3.SecuritySchemeObject;
        };
    });
    getResponseStatus(): number;
    getResponseSchema(responseStatus?: number): JSONSchema | null;
    getSecurityRequirements(): OpenAPIV3.SecurityRequirementObject[];
    getParamsSchemas(): ParamsSchemas;
    getBodySchema(contentType: string): JSONSchema | null;
    generateResponse(req: express.Request, res: express.Response): express.Response;
}
export declare const createOperation: ({ method, path, operation, generator, securitySchemes, }: {
    path: string;
    method: string;
    operation: OpenAPIV3.OperationObject;
    generator: JSF;
    securitySchemes?: {
        [key: string]: OpenAPIV3.SecuritySchemeObject;
    } | undefined;
}) => Operation;
