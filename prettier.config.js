module.exports = {
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  overrides: [
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
