import nodePath from 'path';
import fs from 'fs';

const sep = nodePath.sep;

type optsType =
  | {
      ignore?: string | string[] | RegExp | RegExp[];
      ext?: string | string[];
    }
  | undefined;

export const getSync = (paths: string | string[] = [], opts: optsType = {}) => {
  const results: string[] = [];
  const ignorePatterns: RegExp[] = [];
  let i: number;

  if (!(paths instanceof Array)) {
    paths = [paths];
  }

  if (opts.ignore) {
    if (!(opts.ignore instanceof Array)) {
      opts.ignore = [opts.ignore as string];
    }

    for (i = 0; i < opts.ignore.length; i++) {
      ignorePatterns.push(new RegExp(opts.ignore[i]));
    }
  }

  if (!opts.ext) {
    opts.ext = [];
  } else if (!(opts.ext instanceof Array)) {
    opts.ext = [opts.ext];
  }

  paths.forEach(function (path) {
    if (!fs.existsSync(path)) {
      throw new Error('No such file or directory: ' + path);
    } else if (fs.statSync(path).isFile()) {
      return results.push(path);
    }

    walkSync(path, function (dirPath, dirs, files) {
      files.forEach(function (file) {
        let filePath;
        let ext = nodePath.extname(file);

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
          if (ignorePatterns[i].test(filePath)) return;
        }
        results.push(filePath);
      });
    });
  });

  return results;
};

function walkSync(
  dir: string,
  fn: (dir: string, dirs: string[], files: string[]) => void
) {
  if (!fs.statSync(dir).isDirectory()) {
    throw new Error(dir + ' is not a directory');
  }

  const dirs: string[] = [];
  const files: string[] = [];

  fs.readdirSync(dir).forEach(function (name) {
    const stat = fs.lstatSync(nodePath.join(dir, name));
    // Don't follow symbolic links
    if (stat.isSymbolicLink()) {
      return;
    } else if (stat.isDirectory()) {
      dirs.push(name);
    } else {
      files.push(name);
    }
  });

  fn(dir, dirs, files);

  dirs.forEach(function (subDir) {
    walkSync(nodePath.join(dir, subDir), fn);
  });
}
