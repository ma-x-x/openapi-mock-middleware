# openapi-mock-middleware

Generating mock data using open API file

## Installation

npm i openapi-mock-middleware --save-dev

## Usage

```js
const express = require('express');
const { createMockMiddleware } = require('openapi-mock-middleware');

const app = express();

app.use(
  '/api',
  createMockMiddleware({
    request: {
      spec: ['./example'], // apiSpec。支持file, dir,  array。
      ignore: [/\.js$/], // 扫描目录时忽略的文件 string, RegExp or array
      ext: ['.yml', '.json'], // API文件后缀格式：string or array
      isValidate: true, // 是否开启校验: 开启之后将校验请求的 header、path、query、body。
    },
    response: {
      locale: 'zh', // json-schema-faker locale, default to 'en'
      options: {
        // json-schema-faker options
        /**
         * alwaysFakeOptionals-当启用时，它会设置optionalsProbability: 1.0和 fixedProbabilities: true（默认值：false）
         * optionalsProbability— 一个值 from 0.0to1.0以一致的方式生成值，例如0.5将生成 from 0%to 50%of 的值。使用数组这意味着项目，在对象上他们的属性等。（默认值：false）
         * fixedProbabilities-如果启用，那么optionalsProbability: 0.5总是会生成值的一半（默认值：false）
         */
        alwaysFakeOptionals: true,
        useExamplesValue: true, //如果启用，它会返回一个随机值从examples它们是否存在
        // useDefaultValue-如果启用，它将返回default值，如果存在（默认：false）
      },
      callback: (jsf, faker) => {
        // function where you can extend json-schema-faker
        // ...
      },
    },
  })
);

app.listen(8090, () =>
  console.log('Server listening on http://localhost:8090')
);
```

### **webpack.config.js**

```
const { createMockMiddleware } = require('openapi-mock-middleware');

module.exports = {
  // ...
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

    devServer?.app?.use(
          '/mock',
          createMockMiddleware({
            request: {
              spec: ['./mock/open-api'], // apiSpec。支持file, dir,  array。
              ignore: [/\.js$/], // 扫描目录时忽略的文件 string, RegExp or array
              ext: ['.yml', '.json'], // API文件后缀格式：string or array
              isValidate: false, // 是否开启校验: 开启之后将校验请求的 header、path、query、body。
            },
            // json-schema-faker options
            response: {
              locale: 'zh',
              options: {
                /**
                 * alwaysFakeOptionals-当启用时，它会设置optionalsProbability: 1.0和 fixedProbabilities: true（默认值：false）
                 * optionalsProbability— 一个值 from 0.0to1.0以一致的方式生成值，例如0.5将生成 from 0%to 50%of 的值。使用数组这意味着项目，在对象上他们的属性等。（默认值：false）
                 * fixedProbabilities-如果启用，那么optionalsProbability: 0.5总是会生成值的一半（默认值：false）
                 */
                alwaysFakeOptionals: true,
                useExamplesValue: true, // 如果启用，它会返回一个随机值从examples它们是否存在
                useDefaultValue: true, // -如果启用，它将返回default值，如果存在（默认：false）
              },
            },
          })
        );
      return middlewares;
    },
  },
};
```

### vue.config.js

```
const { defineConfig } = require("@vue/cli-service");
const { createMockMiddleware } = require("openapi-mock-middleware");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    before: function(app) {
      if (!app) {
        throw new Error("webpack-dev-server is not defined");
      }
      app.use(
        "/mock",
        createMockMiddleware({
          request: {
            spec: ["./mock"], // apiSpec。支持file, dir,  array。
            ignore: [/\.js$/], // 扫描目录时忽略的文件 string, RegExp or array
            ext: [".yml", ".json"], // API文件后缀格式：string or array
            isValidate: false // 是否开启校验: 开启之后将校验请求的 header、path、query、body。
          },
          response: {
            locale: "zh", // json-schema-faker locale, default to 'en'
            options: {
              alwaysFakeOptionals: true,
              useExamplesValue: true
            },
            withResponse: response => {
              if (response.object) {
                return {
                  ...response,
                  code: "00000",
                  data: response.object
                };
              } else {
                return {
                  code: "00000",
                  data: response,
                  message: "success"
                };
              }
            }
          }
        })
      );
    }
  }
});
```

### vite

package.json

```
"script":{
    "start": "node ./scripts/dev.js",
}
```

scripts/dev.js

```
const express = require('express')
const { createServer: createViteServer } = require('vite')
const { createMockMiddleware } = require('openapi-mock-middleware');

async function createServer() {
    const app = express();

    // mock 中间件
    app.use(
        '/mock',
        createMockMiddleware({
            request: {
                spec: ['./mock'], // apiSpec。支持file, dir,  array。
                ignore: [/\.js$/], // 扫描目录时忽略的文件 string, RegExp or array
                ext: ['.yml', '.json'], // API文件后缀格式：string or array
                isValidate: false, // 是否开启校验: 开启之后将校验请求的 header、path、query、body。
            },
            // json-schema-faker options
            response: {
                locale: 'zh',
                options: {
                    alwaysFakeOptionals: true,
                    useExamplesValue: true, // 如果启用，它会返回一个随机值从examples它们是否存在
                    useDefaultValue: true, // -如果启用，它将返回default值，如果存在（默认：false）
                },
                callback: (jsf, faker) => {
                    console.log('faker: ', faker);
                    console.log('jsf: ', jsf);
                    // function where you can extend json-schema-faker
                    // ...
                },
                withResponse: (response) => {
                    if (response.data) {
                        return response;
                    } else {
                        return {
                            code: '00000',
                            data: response,
                            message: 'success'
                        }
                    }
                }
            },
        })
    );

    // 以中间件模式创建 Vite 服务器
    const vite = await createViteServer({
        server: { middlewareMode: 'html' }
    });

    // 将 vite 的 connect 实例作中间件使用
    app.use(vite.middlewares);

    app.use('*', async (req, res) => {
        // 如果 `middlewareMode` 是 `'ssr'`，应在此为 `index.html` 提供服务.
        // 如果 `middlewareMode` 是 `'html'`，则此处无需手动服务 `index.html`
        // 因为 Vite 自会接管
    });

    app.listen(4000, () => {
        console.log('server is running at http://localhost:4000');
    });
}

createServer();
```

Example

```
yarn install
```

```
node example/example.js
```

open browser

http://localhost:8090/api/pet/findByStatus

[codesandbox](https://codesandbox.io/s/sharp-blackburn-qgln38)

参考：【[openapi-mock-express-middleware](https://github.com/aleksandryackovlev/openapi-mock-express-middleware)】
