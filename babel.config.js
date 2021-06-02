module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry',
        polyfills: ['es6.map', 'es6.symbol', 'es6.array.iterator', 'es6.promise', 'es6.object.assign', 'es7.promise.finally']
      }
    ]
  ],
  plugins: ['lodash', '@babel/syntax-dynamic-import'],
  env: {
    test: {
      plugins: ['dynamic-import-node']
    }
  }
};
