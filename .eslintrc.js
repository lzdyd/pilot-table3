module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "react"
  ],
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "globals": {
    "window": true,
    "document": true,
    "NODE_ENV": true,
    "CONTEXT": true
  },
  "rules": {
    "skipBlankLines": 0,
    "comma-dangle": ["error", "never"],
    "arrow-body-style": [0, "as-needed"]
  }
};