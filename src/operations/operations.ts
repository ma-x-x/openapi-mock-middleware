import path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import chokidar from 'chokidar';
import { Request } from 'express';
import SwaggerParser from '@apidevtools/swagger-parser';
import { get, toPairs } from 'lodash';
import {
  createGenerator,
  JSFOptions,
  JSF,
  JSFCallback,
  requestType,
  responseType,
} from '../utils';
import { Operation, createOperation } from './operation';
import { getSync } from '../utils/filePaths';

export class Operations {
  operations: Operation[] | null = null;

  spec: string | string[] | OpenAPIV3.Document;
  ignore?: string | string[] | RegExp | RegExp[];
  ext?: string | string[];
  generator: JSF;

  constructor({
    request,
    response,
  }: {
    request: requestType;
    response?: responseType;
  }) {
    const { spec, ignore, ext } = request;
    this.spec = spec;
    this.ignore = ignore;
    this.ext = ext;
    this.watch();
    this.generator = createGenerator(response);
  }

  async parseFileToApiRoutersArr(): Promise<OpenAPIV3.Document<{}>[]> {
    let routers = [];

    if (typeof this.spec === 'string') {
      console.log('api files：', this.spec);
      const api = (await SwaggerParser.dereference(
        this.spec
      )) as OpenAPIV3.Document<{}>;
      routers.push(api);
    } else if (Array.isArray(this.spec)) {
      let filesPath = getSync(JSON.parse(JSON.stringify(this.spec)), {
        ignore: this.ignore,
        ext: this.ext,
      });
      if (filesPath.length === 0) {
        throw new Error(`api spec file not exit: ${this.spec}`);
      }
      console.log('api files：', filesPath);
      for (let i = 0; i < filesPath.length; i++) {
        const item = filesPath[i];
        const apiInfo = (await SwaggerParser.dereference(
          item
        )) as OpenAPIV3.Document<{}>;
        routers.push(apiInfo);
      }
    }

    return routers;
  }

  reset(): void {
    this.operations = null;
  }

  watch(): void {
    if (typeof this.spec !== 'string' && !Array.isArray(this.spec)) return;

    // 一个字符串或者是一个数组，描述监听的文件或者文件夹的路径
    const watcher = chokidar.watch(this.spec, {
      ignored: this.ignore, // ignore dotfiles
    });
    watcher.on('all', () => {
      console.log('hot mock................');
      this.reset();
    });
  }

  async compile(): Promise<void> {
    let operations: Operation[] = [];
    let apiRoutersArr = await this.parseFileToApiRoutersArr();
    for (let i = 0; i < apiRoutersArr.length; i++) {
      let item = apiRoutersArr[i];
      let curApiRouters = toPairs(item.paths as OpenAPIV3.PathsObject).reduce(
        (result: Operation[], [pathName, pathOperations]) => [
          ...result,
          ...this.compileFromPath(
            pathName,
            pathOperations as OpenAPIV3.Document,
            get(item, 'components.securitySchemes')
          ),
        ],
        []
      );
      operations = [...operations, ...curApiRouters];
    }

    this.operations = operations;
  }

  /* eslint-disable class-methods-use-this */
  compileFromPath(
    pathName: string,
    pathOperations: OpenAPIV3.PathItemObject,
    securitySchemes?: { [key: string]: OpenAPIV3.SecuritySchemeObject }
  ): Operation[] {
    return toPairs(pathOperations).map(([method, operation]) =>
      createOperation({
        method,
        path: pathName,
        operation: operation as OpenAPIV3.OperationObject,
        securitySchemes,
        generator: this.generator,
      })
    );
  }
  /* eslint-enable class-methods-use-this */

  async match(req: Request): Promise<Operation | null> {
    if (!this.operations) {
      await this.compile();
    }

    const { method, path: pathname } = req;

    return (
      (this.operations &&
        this.operations.find(
          ({ method: operationMethod, pathRegexp }) =>
            pathRegexp.exec(pathname) &&
            method.toUpperCase() === operationMethod.toUpperCase()
        )) ||
      null
    );
  }
}

export const createOperations = ({
  request,
  response,
}: {
  request: requestType;
  response?: responseType;
}): Operations => new Operations({ request, response });
