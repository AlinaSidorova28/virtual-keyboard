module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "airbnb-base",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "quotes": "off",
        "linebreak-style": "off",
        "curly": "off",
        "no-use-before-define": ["error", { functions: false, variables: false }],
        "object-property-newline": "off",
        "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"],
        "guard-for-in": "off",
        "indent": "off",
        "no-param-reassign": "off",
        "no-prototype-builtins": "off",
        "class-methods-use-this": "off",
    }
};