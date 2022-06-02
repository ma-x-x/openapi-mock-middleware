import express from 'express';
import { requestType, responseType } from './utils';
export interface MiddlewareOptions {
    request: requestType;
    response?: responseType;
}
/** */
export declare const createMockMiddleware: ({ request, response }: MiddlewareOptions) => express.Router;
