import calculate from "./index.js";

const a = 0.1;
const b = 0.2;
const c = 3;

const expression = `${a} + ((5 * ${b} ** ${c}) + 1) - (2e3 % 3) / 4`;
console.log(expression, " = ", calculate(expression));
console.log("0.1 + 0.2 = ", calculate("0.1 + 0.2"));
console.log("-0.1 + 0.2 * (-1) = ", calculate("-0.1 + 0.2 * (-1)"));
console.log("-(-1) = ", calculate("-(-1)"));
console.log("2 % 0 + 3 = ", calculate("2 % 0 + 3"));
console.log("2 / 0 + 3 = ", calculate("2 / 0 + 3"));