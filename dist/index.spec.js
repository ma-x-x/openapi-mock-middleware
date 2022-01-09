"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const index_1 = require("./index");
describe('createMockMiddleware', () => {
    it('should return an instance of the express router', () => __awaiter(void 0, void 0, void 0, function* () {
        const middleware = (0, index_1.createMockMiddleware)({
            request: {
                spec: path_1.default.resolve(__dirname, '../test/fixtures/petstore.yaml'),
            },
        });
        expect(Object.getPrototypeOf(middleware)).toBe(express_1.Router);
    }));
    it('should throw an error if the given file does not exist', () => {
        try {
            (0, index_1.createMockMiddleware)({
                request: {
                    spec: path_1.default.resolve(__dirname, '../test/fixtures/petstore_not_exist.yaml'),
                },
            });
            throw new Error('exit');
        }
        catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', `OpenAPI spec not found at location: ${path_1.default.resolve(__dirname, '../test/fixtures/petstore_not_exist.yaml')}`);
        }
    });
});
//# sourceMappingURL=index.spec.js.map