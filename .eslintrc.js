module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2021,
        "sourceType": "module"
    },
    "rules": {
        // Possible Errors
        "no-console": "warn",
        "no-debugger": "warn",
        
        // Best Practices
        "eqeqeq": ["error", "always"],
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-var": "error",
        "prefer-const": "warn",
        
        // Stylistic Issues
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double", { "avoidEscape": true }],
        "semi": ["error", "always"],
        "comma-dangle": ["warn", "only-multiline"],
        "no-trailing-spaces": "warn",
        "no-multiple-empty-lines": ["warn", { "max": 2 }],
        
        // ES6
        "arrow-spacing": "warn",
        "no-duplicate-imports": "error",
        "prefer-template": "warn",
        
        // Variables
        "no-unused-vars": ["warn", { 
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_"
        }]
    },
    "globals": {
        // Add any global variables used in the project
        "Malla": "readonly",
        "Ramo": "readonly",
        "SelectableRamo": "readonly",
        "SemesterManager": "readonly",
        "workbox": "readonly",
        "importScripts": "readonly"
    },
    "ignorePatterns": [
        "node_modules/",
        "js/min*.js",
        "js/init.js",
        "*.min.js"
    ]
};
