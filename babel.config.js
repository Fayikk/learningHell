module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true, // Modern tarayıcılar için ES modules
        },
        bugfixes: true,
        modules: false, // Tree shaking için false
        loose: true, // Daha küçük output
        // Sadece gerekli polyfill'leri ekle
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-react'
  ],
  // Sadece production'da minify
  env: {
    production: {
      plugins: [
        ['transform-remove-console'],
        ['transform-react-remove-prop-types']
      ]
    }
  }
};
