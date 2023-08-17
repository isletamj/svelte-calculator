
import { json } from '@sveltejs/kit';
import { inputExpression } from '$lib/input.js';

export function GET() {
  let expression: string = inputExpression[0].expression;
  
  //Computation
  let result: number = compute(Array.from(expression));

	return json(result);
}

export async function POST({request}) {
  const {input} = await request.json();
  const newExpression = {
    expression: input
  }
  inputExpression[0] = (newExpression);
  return json(newExpression);
}

function compute(expression: Array<string>): number {
  var stack: any = [];
  let sign: string = "+";
  let selected: any = 0;
  let hasDecimal: boolean = false;

  for (let i = 0; i < expression.length; i++) {

    let char = expression[i];

    if (char.match(/[0-9]/) && !hasDecimal) {
      selected = selected * 10 + (parseInt(char) - 0);
    } else if (char == ".") {
      selected += ".";
      hasDecimal = true;
    } else if (char.match(/[0-9]/) && hasDecimal) {
      selected += char;
    }

    if (char.match(/[+\-*/]/) || i===expression.length-1) {
      let temp: any = -1;
      switch (sign) {
        case '+':
          stack.push(parseFloat(selected));
          hasDecimal = false;
          break;
        case '-':
          stack.push(parseFloat(selected)*-1);
          hasDecimal = false;
          break;
        case '*':
          temp = stack.pop();
          stack.push(parseFloat(temp)*selected);
          hasDecimal = false;
          break;
        case '/':
          temp = stack.pop();
          stack.push(parseFloat(temp)/selected);
          hasDecimal = false;
          break;
      }
      
      sign = char;
      selected = 0;
    }
  }

  let result: number = 0;

  while (stack.length > 0 ) {
    result += stack.pop();
  }

  return result;
}

