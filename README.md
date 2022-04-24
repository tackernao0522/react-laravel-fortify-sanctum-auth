https://akiblog10.com/authentication-spa-laravel-react/ <br>

## 01 パッケージのインストール

- `$ npm i -D react react-dom @types/react @types/react-dom`を実行<br>

- `rm -rf node_modules && rm -rf package-lock.json`を実行<br>

* `package.json`を編集<br>

```json:package.json
{
  "private": true,
  "scripts": {
    "dev": "npm run development",
    "development": "mix",
    "watch": "mix watch",
    "watch-poll": "mix watch -- --watch-options-poll=1000",
    "hot": "mix watch --hot",
    "prod": "npm run production",
    "production": "mix --production"
  },
  "devDependencies": {
    "@types/react": "^17.0.29",
    "@types/react-dom": "^17.0.9",
    "axios": "^0.21",
    "laravel-mix": "^6.0.6",
    "lodash": "^4.17.19",
    "postcss": "^8.1.14",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
```

- `$ npm install`を実行<br>

* `$ npm i -D @emotion/react@11.4.1`を実行<br>

- `$ npm i -D @emotion/styled@11.3.0`を実行<br>

- `$ npm i -D @mui/icons-material@5.0.4 @mui/lab@5.0.0-alpha.51`を実行<br>

* `$ npm i -D @mui/material@5.0.3`を実行<br>

- `$ npm i -D @types/react-router-dom@5.3.1`を実行<br>

* `$ npm i -D autoprefixer@10.3.7`を実行<br>

- `$ npm i -D import-glob-loader@1.1.0`を実行<br>

* `$ npm i -D postcss-import@14.0.2`を実行<br>

- `$ npm i -D react-hook-form@7.17.3`を実行<br>

* `$ npm i -D react-router@5.2.1`を実行<br>

- `$ npm i -D react-router-dom@5.3.1`を実行<br>

* `$ npm i -D resolve-url-loader@4.0.0`を実行<br>

- `$ npm i -D sass@1.42.1`を実行<br>

* `$ npm i -D sass-loader@12.2.0`を実行<br>

- `$ npm i -D tailwindcss@2.2.16`を実行<br>

* `$ npm i -D ts-loader@9.2.6`を実行<br>

- `$ npm i -D typescript@4.4.4`を実行<br>

* `$ npx tailwindcss init`を実行<br>

## 02 React.js や Sass の設定

- `webpack.mix.js`を編集<br>

```js:webpack.mix.js
const mix = require('laravel-mix')
const tailwindcss = require('tailwindcss')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig({
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss/,
        loader: 'import-glob-loader',
      },
    ],
  },
})

mix
  .ts('resources/ts/app.tsx', 'public/js')
  .js('resources/js/app.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .options({
    processCssUrls: false,
    postCss: [tailwindcss('./tailwind.config.js')],
  })
```

- `$ mkdir resources/sass && touch $_/app.scss`を実行<br>

* `resources/sass/app.scss`を編集<br>

```scss/app.scss
@use 'tailwindcss/base';
@use 'tailwindcss/components';
@use 'tailwindcss/utilities';
```

- `$ touch tsconfig.json`を実行<br>

`tsconfig.json`を編集<br>

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true
  }
}
```

- `$ mkdir resources/ts`を実行<br>
