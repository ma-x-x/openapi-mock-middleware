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
exports.createOperations = exports.Operations = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
const operation_1 = require("./operation");
const filePaths_1 = require("../utils/filePaths");
class Operations {
    constructor({ request, response, }) {
        this.operations = null;
        const { spec, ignore, ext } = request;
        this.spec = spec;
        this.ignore = ignore;
        this.ext = ext;
        this.watch();
        this.generator = (0, utils_1.createGenerator)(response);
    }
    parseFileToApiRoutersArr() {
        return __awaiter(this, void 0, void 0, function* () {
            let routers = [];
            if (typeof this.spec === 'string') {
                console.log('api files：', this.spec);
                const api = (yield swagger_parser_1.default.dereference(this.spec));
                routers.push(api);
            }
            else if (Array.isArray(this.spec)) {
                let filesPath = (0, filePaths_1.getSync)(JSON.parse(JSON.stringify(this.spec)), {
                    ignore: this.ignore,
                    ext: this.ext,
                });
                if (filesPath.length === 0) {
                    throw new Error(`api spec file not exit: ${this.spec}`);
                }
                console.log('api files：', filesPath);
                for (let i = 0; i < filesPath.length; i++) {
                    const item = filesPath[i];
                    const apiInfo = (yield swagger_parser_1.default.dereference(item));
                    routers.push(apiInfo);
                }
            }
            return routers;
        });
    }
    reset() {
        this.operations = null;
    }
    watch() {
        if (typeof this.spec !== 'string' && !Array.isArray(this.spec))
            return;
        // 一个字符串或者是一个数组，描述监听的文件或者文件夹的路径
        const watcher = chokidar_1.default.watch(this.spec, {
            ignored: this.ignore, // ignore dotfiles
        });
        watcher.on('all', () => {
            console.log('hot mock................');
            this.reset();
        });
    }
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            let operations = [];
            let apiRoutersArr = yield this.parseFileToApiRoutersArr();
            for (let i = 0; i < apiRoutersArr.length; i++) {
                let item = apiRoutersArr[i];
                let curApiRouters = (0, lodash_1.toPairs)(item.paths).reduce((result, [pathName, pathOperations]) => [
                    ...result,
                    ...this.compileFromPath(pathName, pathOperations, (0, lodash_1.get)(item, 'components.securitySchemes')),
                ], []);
                operations = [...operations, ...curApiRouters];
            }
            this.operations = operations;
        });
    }
    /* eslint-disable class-methods-use-this */
    compileFromPath(pathName, pathOperations, securitySchemes) {
        return (0, lodash_1.toPairs)(pathOperations).map(([method, operation]) => (0, operation_1.createOperation)({
            method,
            path: pathName,
            operation: operation,
            securitySchemes,
            generator: this.generator,
        }));
    }
    /* eslint-enable class-methods-use-this */
    match(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.operations) {
                yield this.compile();
            }
            const { method, path: pathname } = req;
            return ((this.operations &&
                this.operations.find(({ method: operationMethod, pathRegexp }) => pathRegexp.exec(pathname) &&
                    method.toUpperCase() === operationMethod.toUpperCase())) ||
                null);
        });
    }
}
exports.Operations = Operations;
const createOperations = ({ request, response, }) => new Operations({ request, response });
exports.createOperations = createOperations;
//# sourceMappingURL=operations.js.map