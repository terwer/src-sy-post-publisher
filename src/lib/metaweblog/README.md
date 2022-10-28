# metaweblog-api

## 依赖

```bash
yarn add metaweblog-api -S

yarn add @babel/cli @babel/node @babel/preset-env
```

package.json

```json
{
  "dependencies": {
    "metaweblog-api": "^1.2.0",
    "core-js": "^3.8.3"
  },
  "devDependencies": {
    "@babel/cli": "^7.18.9",
    "@babel/node": "^7.18.9",
    "@babel/preset-env": "^7.18.9"
  }
}
```
.babelrc

```bash
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry",
        "corejs": "3.8.3"
      }
    ]
  ]
}
```

## test
```
babel-node src/lib/metaweblog/test.js
```

