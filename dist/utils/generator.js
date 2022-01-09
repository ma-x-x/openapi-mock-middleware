"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGenerator = exports.handleExamples = void 0;
const json_schema_faker_1 = __importDefault(require("json-schema-faker"));
const faker_1 = __importDefault(require("faker"));
const defaultOptions = {
    optionalsProbability: 0.5,
};
const handleExamples = (value) => {
    if (typeof value === 'object' &&
        value !== null &&
        Object.keys(value).length) {
        return value[Object.keys(value)[0]].value;
    }
    return '';
};
exports.handleExamples = handleExamples;
const createGenerator = (response) => {
    const locale = (response === null || response === void 0 ? void 0 : response.locale) || 'zh';
    const options = (response === null || response === void 0 ? void 0 : response.options) || defaultOptions;
    const callback = (response === null || response === void 0 ? void 0 : response.callback) || (() => { });
    json_schema_faker_1.default.option(Object.assign(Object.assign({}, defaultOptions), options));
    json_schema_faker_1.default.extend('faker', () => {
        faker_1.default.locale = locale;
        return faker_1.default;
    });
    callback(json_schema_faker_1.default, faker_1.default);
    json_schema_faker_1.default.define('example', (value) => {
        return value;
    });
    json_schema_faker_1.default.define('examples', exports.handleExamples);
    return json_schema_faker_1.default;
};
exports.createGenerator = createGenerator;
//# sourceMappingURL=generator.js.map