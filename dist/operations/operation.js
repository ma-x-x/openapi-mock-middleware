"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperation = exports.Operation = void 0;
const lodash_1 = require("lodash");
const path_to_regexp_1 = require("path-to-regexp");
function isReferenceObject(response) {
    return (typeof response === 'object' && response !== null && '$ref' in response);
}
class Operation {
    constructor({ method, path, operation, securitySchemes, generator, }) {
        this.pathPattern = path.replace(/\{([^/}]+)\}/g, (p1, p2) => `:${p2}`);
        this.method = method.toUpperCase();
        this.operation = operation;
        this.securitySchemes = securitySchemes || null;
        this.generator = generator;
        this.pathRegexp = (0, path_to_regexp_1.pathToRegexp)(this.pathPattern);
    }
    getResponseStatus() {
        const responses = (0, lodash_1.get)(this.operation, 'responses');
        if (!responses) {
            return 200;
        }
        const status = (0, lodash_1.findKey)(responses, (content, code) => {
            const statusCode = parseInt(code, 10);
            if (Number.isNaN(statusCode)) {
                return false;
            }
            return statusCode >= 200 && statusCode < 299;
        });
        return status ? parseInt(status, 10) : 200;
    }
    getResponseSchema(responseStatus = 200) {
        if ((0, lodash_1.has)(this.operation, [
            'responses',
            responseStatus,
            'content',
            'application/json',
            'schema',
        ]) ||
            (0, lodash_1.has)(this.operation, ['responses', '200', 'schema'])) {
            const { schema, example, examples } = (0, lodash_1.get)(this.operation, [
                'responses',
                responseStatus,
                'content',
                'application/json',
            ]) || (0, lodash_1.get)(this.operation, ['responses', '200']);
            if (schema && !isReferenceObject(schema)) {
                const resultSchema = schema;
                if (example) {
                    resultSchema.example = example;
                }
                if (examples) {
                    resultSchema.examples = examples;
                }
                return resultSchema;
            }
            return null;
        }
        return null;
    }
    getSecurityRequirements() {
        const requirements = this.operation.security || [];
        return requirements;
    }
    getParamsSchemas() {
        const schemas = {
            header: {
                type: 'object',
                required: [],
            },
            query: {
                type: 'object',
                additionalProperties: false,
                required: [],
            },
            path: {
                type: 'object',
                additionalProperties: false,
                required: [],
            },
        };
        const parameters = (0, lodash_1.get)(this.operation, ['parameters']);
        if (parameters) {
            parameters.forEach((parameter) => {
                if (parameter &&
                    !isReferenceObject(parameter) &&
                    (parameter.in === 'header' ||
                        parameter.in === 'query' ||
                        parameter.in === 'path') &&
                    schemas[parameter.in]) {
                    const prevRequired = schemas[parameter.in].required || [];
                    (0, lodash_1.set)(schemas, [
                        parameter.in,
                        'properties',
                        parameter.in === 'header'
                            ? parameter.name.toLowerCase()
                            : parameter.name,
                    ], parameter.schema);
                    if (parameter.required) {
                        (0, lodash_1.set)(schemas, [parameter.in, 'required'], [
                            ...prevRequired,
                            parameter.in === 'header'
                                ? parameter.name.toLowerCase()
                                : parameter.name,
                        ]);
                    }
                }
            });
        }
        return schemas;
    }
    getBodySchema(contentType) {
        return (0, lodash_1.get)(this.operation, [
            'requestBody',
            'content',
            contentType,
            'schema',
        ]);
    }
    generateResponse(req, res) {
        const responseStatus = this.getResponseStatus();
        const responseSchema = this.getResponseSchema(responseStatus);
        return res.status(responseStatus).json(responseSchema
            ? {
                code: '0000',
                message: '处理成功',
                timestamp: '2022-01-10 00:56:45',
                data: this.generator.generate(responseSchema),
            }
            : {
                code: '0000',
                message: '处理成功',
                timestamp: '2022-01-10 00:56:45',
                data: {},
            });
    }
}
exports.Operation = Operation;
const createOperation = ({ method, path, operation, generator, securitySchemes, }) => new Operation({
    method,
    path,
    operation,
    generator,
    securitySchemes,
});
exports.createOperation = createOperation;
//# sourceMappingURL=operation.js.map