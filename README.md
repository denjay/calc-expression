# calculate.js

This project is a JavaScript library for precise calculations. It is built on top of bignumber.js and simplifies the usage by allowing calculation of arithmetic expressions with accurate results. It supports addition, subtraction, multiplication, division, modulus, and exponentiation.

## Installation

To install the library, run the following command:

```bash
npm install calculate.js
```

## Usage
> ES module
```javascript
import calculate from "calculate.js";
console.log(calculate("0.1 + 0.2"));  // "0.3"
```
> CommonJS
```javascript
const  calculate = require("calculate.js");
let a = 0.1; let b = 0.2;
console.log(calculate(`${a} + ${b}`}));  // "0.3"
```