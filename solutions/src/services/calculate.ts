/**
 * Evaluates a mathematical expression given as a string.
 * Supports the operators +, -, *, and /, as well as parentheses for grouping.
 *
 * @param {string} expression - The mathematical expression to evaluate.
 * @returns {number} - The result of the evaluated expression.
 */
export function evaluateExpression(expression: string): number {
  const precedence: { [key: string]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  }

  const isOperator = (c: string) => ['+', '-', '*', '/'].includes(c)
  const isDigit = (c: string) => /\d/.test(c)

  /**
   * Converts an infix expression to a postfix expression using the Shunting Yard algorithm.
   *
   * @param {string} expression - The infix expression to convert.
   * @returns {string[]} - The postfix expression as an array of tokens.
   */
  function infixToPostfix(expression: string): string[] {
    const output: string[] = []
    const operators: string[] = []
    let i = 0

    while (i < expression.length) {
      const char = expression[i]

      if (isDigit(char)) {
        let num = ''
        while (i < expression.length && isDigit(expression[i])) {
          num += expression[i++]
        }
        output.push(num)
        continue
      }

      if (char === '(') {
        operators.push(char)
      } else if (char === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          output.push(operators.pop()!)
        }
        operators.pop() // Remove '('
      } else if (isOperator(char)) {
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[char]) {
          output.push(operators.pop()!)
        }
        operators.push(char)
      }

      i++
    }

    while (operators.length) {
      output.push(operators.pop()!)
    }

    return output
  }

  /**
   * Evaluates a postfix expression.
   *
   * @param {string[]} postfix - The postfix expression to evaluate.
   * @returns {number} - The result of the evaluated postfix expression.
   */
  function evaluatePostfix(postfix: string[]): number {
    const stack: number[] = []

    for (const token of postfix) {
      if (isDigit(token)) {
        stack.push(parseInt(token))
      } else if (isOperator(token)) {
        const b = stack.pop()!
        const a = stack.pop()!
        switch (token) {
          case '+':
            stack.push(a + b)
            break
          case '-':
            stack.push(a - b)
            break
          case '*':
            stack.push(a * b)
            break
          case '/':
            stack.push(a / b)
            break
        }
      }
    }

    return stack.pop()!
  }

  const postfix = infixToPostfix(expression.replace(/\s+/g, ''))
  return evaluatePostfix(postfix)
}
