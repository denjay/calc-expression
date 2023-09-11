# calc-expression

This project is a JavaScript library for precise calculations. It is built on top of bignumber.js and simplifies the usage by allowing calculation of arithmetic expressions with accurate results. It supports addition, subtraction, multiplication, division, modulus, and exponentiation.

## Installation

To install the library, run the following command:

```bash
npm install calc-expression
```

## Usage

> ES module

```javascript
import calculate from "calc-expression";
console.log(calculate("0.1 + 0.2")); // "0.3"
```

> CommonJS

```javascript
const  calculate = require("calc-expression").default;
let a = 0.1; let b = 0.2;
console.log(calculate(`${a} + ((5 * ${b} ** 3) + 1) - (2e3 % 3) / 4`));  // "0.64"
```
