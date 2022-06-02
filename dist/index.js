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
exports.createMockMiddleware = void 0;
/* eslint-disable no-console */
const fs_1 = __importDefault(require("fs"));
const router_1 = __importDefault(require("./router"));
const operations_1 = require("./operations");
const middleware_1 = require("./middleware");
/** */
const createMockMiddleware = ({ request, response }) => {
    if (typeof request.spec === 'string' && !fs_1.default.existsSync(request.spec)) {
        throw new Error(`api spec file not exit: ${request.spec}`);
    }
    else if (request.spec === undefined) {
        throw new Error(`api spec not exit`);
    }
    const router = (0, router_1.default)();
    const operations = (0, operations_1.createOperations)({
        request,
        response,
    });
    router.use('/{0,}', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        res.locals.operation = yield operations.match(req);
        next();
    }));
    /** 开启校验 */
    if (request.isValidate) {
        router.use(middleware_1.isAuthenticated);
        router.use(middleware_1.validateHeaders);
        router.use(middleware_1.validatePath);
        router.use(middleware_1.validateQuery);
        router.use(middleware_1.validateBody);
    }
    router.use((req, res, next) => {
        return res.locals.operation
            ? res.locals.operation.generateResponse(req, res, response === null || response === void 0 ? void 0 : response.withResponse)
            : next();
    });
    router.use((req, res) => {
        res.status(404).send({ message: 'Not found' });
    });
    router.use((err, req, res) => {
        res.status(500).send({ message: 'Something broke!' });
    });
    return router;
};
exports.createMockMiddleware = createMockMiddleware;
//# sourceMappingURL=index.js.map