"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    strict: false,
    coerceTypes: 'array',
    formats: {
        int32: true,
        int64: true,
        binary: true,
    },
});
exports.default = ajv;
//# sourceMappingURL=validator.js.map