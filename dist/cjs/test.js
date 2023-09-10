"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const a = 0.1;
const b = 0.2;
const c = 3;
const expression = `${a} + ((5 * ${b} ** ${c}) + 1) - (2e3 % 3) / 4`;
console.log(expression, " = ", (0, index_js_1.default)(expression));
console.log("0.1 + 0.2 = ", (0, index_js_1.default)("0.1 + 0.2"));
console.log("-0.1 + 0.2 * (-1) = ", (0, index_js_1.default)("-0.1 + 0.2 * (-1)"));
console.log("-(-1) = ", (0, index_js_1.default)("-(-1)"));
