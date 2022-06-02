/* eslint-disable no-console */
import fs from 'fs';

import express from 'express';
import type { OpenAPIV3 } from 'openapi-types';

import createRouter from './router';
import { createOperations } from './operations';
import {
  isAuthenticated,
  validateHeaders,
  validatePath,
  validateQuery,
  validateBody,
} from './middleware';
import { requestType, responseType } from './utils';

export interface MiddlewareOptions {
  request: requestType;
  response?: responseType;
}

/** */

export const createMockMiddleware = ({request,response}: MiddlewareOptions): express.Router => {
  if (typeof request.spec === 'string' && !fs.existsSync(request.spec)) {
    throw new Error(`api spec file not exit: ${request.spec}`);
  } else if (request.spec === undefined) {
    throw new Error(`api spec not exit`);
  }

  const router = createRouter();
  const operations = createOperations({
    request,
    response,
  });

  router.use('/{0,}', async (req, res, next) => {
    res.locals.operation = await operations.match(req);
    next();
  });

  /** 开启校验 */
  if (request.isValidate) {
    router.use(isAuthenticated);
    router.use(validateHeaders);
    router.use(validatePath);
    router.use(validateQuery);
    router.use(validateBody);
  }

  router.use((req, res, next) => {
    return res.locals.operation
      ? res.locals.operation.generateResponse(req, res, response?.withResponse)
      : next();
  });

  router.use((req, res) => {
    res.status(404).send({ message: 'Not found' });
  });

  router.use(
    (err: Error, req: express.Request, res: express.Response): void => {
      res.status(500).send({ message: 'Something broke!' });
    }
  );

  return router;
};
