export function evaluateExpression(expression) {
  const tokens = tokenizeExpression(expression);
  const ast = buildAST(tokens);
  return evaluateAST(ast);
}

function tokenizeExpression(expression) {
  const tokens: string[] = [];
  let currentToken = "";

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === " ") {
      continue;
    } else if (char === "(" || char === ")") {
      if (currentToken !== "") {
        tokens.push(currentToken);
        currentToken = "";
      }
      tokens.push(char);
    } else if (isOperator(char)) {
      if (currentToken !== "") {
        tokens.push(currentToken);
        currentToken = "";
      }
      tokens.push(char);
    } else {
      currentToken += char;
    }
  }

  if (currentToken !== "") {
    tokens.push(currentToken);
  }

  return tokens;
}

function buildAST(tokens) {
  const stack: string[] = [];
  const output: Array<undefined | string> = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    const top = stack.length > 0 ? stack[stack.length - 1] : null;
    if (isOperator(token)) {
      while (isOperator(top) && getOperatorPrecedence(token) <= getOperatorPrecedence(top)) {
        output.push(stack.pop());
      }
      stack.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (top !== "(") {
        output.push(stack.pop());
      }
      stack.pop();
    } else {
      output.push(token);
    }
  }

  while (stack.length > 0) {
    output.push(stack.pop());
  }

  return output;
}

function evaluateAST(ast) {
  const stack: string[] = [];

  for (let i = 0; i < ast.length; i++) {
    const token = ast[i];

    if (isOperator(token)) {
      const operand2 = stack.pop();
      const operand1 = stack.pop();
      stack.push(performOperation(token, operand1, operand2));
    } else {
      stack.push(token);
    }
  }

  return stack.pop();
}

function isOperator(token) {
  return token === "+" || token === "-" || token === "*" || token === "/" || token === "&&" || token === "||";
}

function getOperatorPrecedence(operator) {
  if (operator === "&&" || operator === "||") {
    return 1;
  }
  if (operator === "+" || operator === "-") {
    return 2;
  }
  if (operator === "*" || operator === "/") {
    return 3;
  }
  return 0;
}

function performOperation(operator, operand1, operand2) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
    case "&&":
      return operand1 && operand2;
    case "||":
      return operand1 || operand2;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}
