import BigNumber from "bignumber.js";

// 根据不同的优先级区分,越靠前,优先级越高
const operatorArrList = [["**"], ["*", "/", "%"], ["+", "-"]];
const operatorRegString = operatorArrList
  .reduce((acc, pre) => {
    acc.push(...pre);
    return acc;
  }, [])
  .map((operator) => operator.replace(/(.)/g, "\\$1"))
  .join("|");
const floatRegString = String.raw`(?:\d+\.?\d*|\.\d+)`;
const scientificRegString = String.raw`${floatRegString}[Ee][\+\-]?\d+`;
const numberRegString = String.raw`(?:NaN|${scientificRegString}|${floatRegString})`;
const minUnitRegString = String.raw`(?:${numberRegString}|\(\s*[\+\-]?\s*${numberRegString}\s*\))`;
const expressionRegString = String.raw`^\s*[\+\-]?(?:\s*${minUnitRegString}\s*(?:${operatorRegString}))*\s*${minUnitRegString}\s*$`;

export default function calculate(expression: string) {
  if (typeof expression !== "string") {
    throw new Error(`"${expression}" is not a string`);
  }
  return calc(expression).replace(/\(|\)/g, "");
}

/**
 * 递归计算,直到不包含子表达式为止
 *
 * @param {string} expression - The mathematical expression to be evaluated.
 * @return {string} The result of the evaluation.
 */
function calc(expression: string) {
  if (!expression.match(expressionRegString)) {
    try {
      eval(expression);
    } catch (error) {
      throw new Error(`"${expression}" syntax error`);
    }
    // 如果表达式含有子表达式(在括号里的算数表达式),先计算子表达式
    if (expression.match(/\(|\)/)) {
      expression = getExpressionWithoutParentheses(expression);
    } else {
      return expression;
    }
  }
  return calculateExpressionWithoutParentheses(expression);
}

/**
 * Generates a new expression without parentheses based on the given expression.
 *
 * @param {string} expression - The original expression with parentheses.
 * @return {string} The new expression without parentheses.
 */
function getExpressionWithoutParentheses(expression: string) {
  const bracketPairArr = getBracketPairArr(expression); // 获取第一层的括号对信息
  let newExpression = "";
  bracketPairArr.forEach((bracketPair, index) => {
    if (index === 0) {
      newExpression += expression.slice(0, bracketPair[0]);
      newExpression += calc(
        expression.slice(bracketPair[0] + 1, bracketPair[1])
      );
    } else {
      newExpression += expression.slice(
        bracketPairArr[index - 1][1] + 1,
        bracketPair[0]
      );
      newExpression += calc(
        expression.slice(bracketPair[0] + 1, bracketPair[1])
      );
    }
    // 如果是最后一个括号对,表达式还要加上最后面的一截
    if (index === bracketPairArr.length - 1) {
      newExpression += expression.slice(bracketPair[1] + 1);
    }
  });
  return newExpression;
}

/**
 * Generates an array of bracket pairs from the given expression.
 *
 * @param {string} expression - The expression to extract bracket pairs from.
 * @return {Array} An array of bracket pairs, where each pair is represented as an array containing the indices of the left and right brackets.
 */
function getBracketPairArr(expression: string) {
  const bracketPairArr: number[][] = []; // 记录第一层的括号对信息
  const leftBracketIndexArr: number[] = []; // 记录左括号的位置
  void [...expression].forEach((item, index) => {
    if (item === "(") {
      leftBracketIndexArr.push(index);
    } else if (item === ")") {
      if (leftBracketIndexArr.length === 1) {
        const leftBracketIndex = leftBracketIndexArr.pop()!;
        bracketPairArr.push([leftBracketIndex, index]);
      } else {
        leftBracketIndexArr.pop();
      }
    }
  });
  return bracketPairArr;
}

/**
 * 计算不含括号的表达式,根据运算符优先级分割表达式进行计算
 *
 * @param {string} expression - 不含括号的表达式
 * @returns {string} 不含括号的表达式最终计算结果
 */
function calculateExpressionWithoutParentheses(expression: string) {
  expression = expression.trim();
  if (expression.startsWith("-")) {
    expression = "0" + expression;
  }
  operatorArrList.forEach((operatorArr) => {
    // 如果包含当前运算符的计算式,就循环计算,直到不含当前运算符的计算式
    while (
      !expression.match(String.raw`^\s*[\+\-]?${minUnitRegString}\s*$`) &&
      operatorArr.some((operator) =>
        expression.match(
          String.raw`${minUnitRegString}\s*${operator.replace(
            /(.)/g,
            "\\$1"
          )}\s*${minUnitRegString}`
        )
      )
    ) {
      const regResult = expression.match(
        String.raw`${minUnitRegString}\s*(${operatorArr
          .map((operator) => operator.replace(/(.)/g, "\\$1"))
          .join("|")})\s*${minUnitRegString}`
      );
      if (regResult) {
        const operator = regResult[1];
        const { index } = regResult[0].match(operator.replace(/(.)/g, "\\$1"))!;
        const leftString = regResult[0]
          .slice(0, index)
          .replace(/\(|\)|\s/g, "");
        const rightString = regResult[0]
          .slice(index! + operator.length)
          .replace(/\(|\)|\s/g, "");
        let calcResult = operate(leftString, rightString, operator);
        if (calcResult.startsWith("-")) {
          calcResult = `(${calcResult})`;
        }
        expression = expression.replace(regResult[0], calcResult);
      } else {
        throw new Error(`"${expression}" syntax error`);
      }
    }
  });
  return expression;
}

/**
 * Performs the specified arithmetic operation on two strings representing numbers.
 *
 * @param {string} leftString - The left operand of the arithmetic operation.
 * @param {string} rightString - The right operand of the arithmetic operation.
 * @param {string} operator - The operator specifying the arithmetic operation to perform.
 * @return {string} The result of the arithmetic operation as a string.
 */
function operate(leftString: string, rightString: string, operator: string) {
  const operatorInfo: Record<string, string> = {
    "**": "exponentiatedBy",
    "*": "multipliedBy",
    "/": "dividedBy",
    "%": "modulo",
    "+": "plus",
    "-": "minus",
  };
  return (BigNumber(leftString) as { [key: string]: any })
    [operatorInfo[operator]](BigNumber(rightString))
    .toString();
}
