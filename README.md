
# openapi-mock-middleware

## 介绍
 后台定义好规范的openapi接口后，利用api文档简化前端mock数据。

## 使用
```js
const express = require('express');

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

参考：【[openapi-mock-express-middleware](https://github.com/aleksandryackovlev/openapi-mock-express-middleware)】
