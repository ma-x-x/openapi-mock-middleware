"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sep = path_1.default.sep;
const getSync = (paths = [], opts = {}) => {
    const results = [];
    const ignorePatterns = [];
    let i;
    if (!(paths instanceof Array)) {
        paths = [paths];
    }
    if (opts.ignore) {
        if (!(opts.ignore instanceof Array)) {
            opts.ignore = [opts.ignore];
        }
        for (i = 0; i < opts.ignore.length; i++) {
            ignorePatterns.push(new RegExp(opts.ignore[i]));
        }
    }
    if (!opts.ext) {
        opts.ext = [];
    }
    else if (!(opts.ext instanceof Array)) {
        opts.ext = [opts.ext];
    }
    paths.forEach(function (path) {
        if (!fs_1.default.existsSync(path)) {
            throw new Error('No such file or directory: ' + path);
        }
        else if (fs_1.default.statSync(path).isFile()) {
            return results.push(path);
        }
        walkSync(path, function (dirPath, dirs, files) {
            files.forEach(function (file) {
                let filePath;
                let ext = path_1.default.extname(file);
                // @ts-ignore
                if (opts.ext.length && opts.ext.indexOf(ext) === -1) {
                    return;
                }
                if (dirPath.slice(-1) !== sep) {
                    dirPath += sep;
                }
                if (dirPath.indexOf(sep) !== 0 && dirPath.indexOf('.') !== 0) {
                    dirPath = './' + dirPath;
                }
                filePath = dirPath + file;
                for (let i = 0; i < ignorePatterns.length; i++) {
                    if (ignorePatterns[i].test(filePath))
                        return;
                }
                results.push(filePath);
            });
        });
    });
    return results;
};
exports.getSync = getSync;
function walkSync(dir, fn) {
    if (!fs_1.default.statSync(dir).isDirectory()) {
        throw new Error(dir + ' is not a directory');
    }
    const dirs = [];
    const files = [];
    fs_1.default.readdirSync(dir).forEach(function (name) {
        const stat = fs_1.default.lstatSync(path_1.default.join(dir, name));
        // Don't follow symbolic links
        if (stat.isSymbolicLink()) {
            return;
        }
        else if (stat.isDirectory()) {
            dirs.push(name);
        }
        else {
            files.push(name);
        }
    });
    fn(dir, dirs, files);
    dirs.forEach(function (subDir) {
        walkSync(path_1.default.join(dir, subDir), fn);
    });
}
//# sourceMappingURL=filePaths.js.map