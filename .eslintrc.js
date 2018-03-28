module.exports = {
    "parserOptions": {
        "ecmaVersion": 8
    },
    "env": {
        "browser": true,
        "webextensions": true,
        "es6": true
    },
    "plugins": [
        "no-unsanitized"
    ],
    "extends": "eslint:recommended",
    "rules": {
        "no-unsanitized/method": [
            "error"
        ],
        "no-unsanitized/property": [
            "error",
            {
                "escape": {
                    "taggedTemplates": ["escaped"]
                }
            }
        ],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
