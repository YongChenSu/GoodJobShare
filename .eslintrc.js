const path = require('path');

module.exports = {
  extends: ['react-app', 'prettier', 'prettier/flowtype', 'prettier/react'],
  plugins: ['prettier', 'flowtype', 'react-hooks'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': [
      'error',
      199,
      {
        ignorePattern: ' // eslint-disable-line ',
      },
    ],
    'react/prefer-stateless-function': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'error',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js'],
      },
    ],
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/require-default-props': 'off',
    'react/no-array-index-key': 'off',
    'no-unused-vars': 'error',
    'react/no-deprecated': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
    'no-use-before-define': 'error',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              actions: path.resolve('./src/actions'),
              apis: path.resolve('./src/apis'),
              common: path.resolve('./src/components/common'),
              images: path.resolve('./src/components/images'),
              constants: path.resolve('./src/constants'),
              contexts: path.resolve('./src/contexts'),
              graphql: path.resolve('./src/graphql'),
              hooks: path.resolve('./src/hooks'),
              selectors: path.resolve('./src/selectors'),
              utils: path.resolve('./src/utils'),
            },
          },
        },
      },
    },
  },
};
