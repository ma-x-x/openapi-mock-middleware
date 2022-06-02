import jsf, { JSF, JSFOptions } from 'json-schema-faker';
import { faker } from '@faker-js/faker';
import type { OpenAPIV3 } from 'openapi-types';

export { JSONSchema, JSFOptions, JSF } from 'json-schema-faker';

export type JSFCallback = (jsfInstance: JSF, fakerObject: typeof faker) => void;
export type requestType = {
  spec: string | string[] | OpenAPIV3.Document; // api文件file, dir,  array or OpenAPIV3.Document object
  ignore?: string | string[] | RegExp | RegExp[]; // 扫描目录时忽略的文件 string, RegExp or array
  ext?: string | string[]; // API文件后缀格式：string or array
  isValidate?: boolean; // 是否开启校验: 开启之后将校验请求的 header、path、query、body。
};
export type responseType = Partial<{
  locale: string;
  options: Partial<JSFOptions>;
  callback: JSFCallback;
  withResponse?: <T>(data: T) => any;
}>;

const defaultOptions = {
  optionalsProbability: 0.5,
};

export const handleExamples = (value: any): any => {
  if (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).length
  ) {
    return value[Object.keys(value)[0]].value;
  }

  return '';
};

export const createGenerator: (response?: responseType) => JSF = (response) => {
  const locale = response?.locale || 'zh_CN';
  const options = response?.options || defaultOptions;
  const callback = response?.callback || <JSFCallback>(() => {});
  jsf.option({
    ...defaultOptions,
    ...options,
  });

  jsf.extend('faker', () => {
    const faker = require('@faker-js/faker/locale/zh_CN');
    return faker;
  });

  jsf.define('example', (value) => {
    return value;
  });

  jsf.define('examples', handleExamples);

  return jsf;
};
