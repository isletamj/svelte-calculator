# Svelte Calculator
A simple calculator made using svelte and sveltekit

## Front End

 - This is a single page app.

 - I didn't use any svelte UI library. I only used vanilla CSS.

 - The script part mainly contains the `GET()` call for the computation result and the functions `buttonPress(button)` and `onKeyDown(e)` for the interactivity of the website.

**Main functions in \<script>\</script>**

```javascript
async function compute() {
		const response = await fetch('/compute');
		let result = await response.json();
		result = result.toString();
		input = result;
	}

function buttonPress(button)... //Button parameter is the value of the button pressed

function onKeyDown(e)... //The e parameter contains the event. I get the key pressed by using e.key or e.keyCode
```

**Sample usage of the `buttonPress(button)`**

```javascript
<button type="button" class="number" on:click={() => buttonPress('0')}>0</button>
```

**Usage of the `onKeyDown(e)`**

```javascript
<svelte:window on:keydown={onKeyDown} />
```

### Passing the input to the built-in mini API using POST call

- The POST call is inside the equals button. When the `=` button is clicked or when you pressed enter then it will trigger this button.

- When the button is triggered it will run the asynchronous-anonymous function that fetches from the `/compute` endpoint looking for a POST function in the `+server.ts` passing the value of the `input` variable in stringified JSON format.

- After posting the input in the built-in mini API we will transfer the value of the user input to the `previous` variable then clear the value of the `input` variable

- Then we will GET() the computation result by calling the `compute()` function which is our GET() call stated earlier.

```javascript
<button
    type="submit"
    class="operation equals"
    on:click={async (e) => {
      const response = await fetch('/compute', {
        method: 'POST',
        body: JSON.stringify({ input }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      previous = input + '=';
      input = '';
      compute();
    }}>&equals;</button>
```

## Backend

- The important files that are working in the backend are
1. `input.js`
2. `+server.ts`

```
.
└── server-calculator/
    └── src/
        ├── lib/
        │   └── input.js
        └── routes/
            └── compute/
                └── +server.ts
```

- The `input.js` is the file that stores the default and the user input expression using a javascript object.

### 1. `input.js` - Default expression:

```javascript
export const inputExpression = [
  {
    expression: ""
  }
]
```

### 2. `+server.ts`

- First are the imports and the `GET()` call

- We import the `json` from `@sveltejs/kit` so that I wont't need to return a Response object for simplicity.

- Then we import the expression from `input.js` using the name inputExpression.

- In the GET function we get the expression value from the `input.js` file then pass it as an argument in the `compute()` function, but first making it a character array to seperate the numbers from operations.

```typescript
import { json } from '@sveltejs/kit';
import { inputExpression } from '$lib/input.js';

export function GET() {
  let expression: string = inputExpression[0].expression;
  
  //Computation
  let result: number = compute(Array.from(expression));

	return json(result);
}
```

- before going into the `compute()` function let's first look at the POST function

- In the POST we will get the user input by invoking the `await request.json()` and saving it in `input` variable. Then putting it in a new javascript object that we will pass to the `input.js` file through the `inputExpression[0]`.

> I'm using `inputExpression[0]` because I want to overwrite the first index. If ever I want to make a history functionality in the calculator then I may use the `inputExpression.push(newExpression)`. But for simplicity I just overwrite it.

```typescript
export async function POST({request}) {
  const {input} = await request.json();
  const newExpression = {
    expression: input
  }
  inputExpression[0] = (newExpression);
  return json(newExpression);
}
```
### Computation Logic

- The computation is done using the `compute()` function <mark>different from the compute() function in +page.svelte </mark>. This compute function is defined as `function compute(expression: Array<string>): number` which returns a number.

- First is the variable declarations...
```typescript
  var stack: any = []; //Stores positive and negative numbers
  let sign: string = "+"; //Stores the previously detected operation
  let selected: any = 0; //Stores the currently selected number or operation
  let hasDecimal: boolean = false; //Detects whether the current string of numbers has decimal 
```

- Then we will have a for loop `for (let i = 0; i < expression.length; i++)` that iterates till the last character in the array.

#### Inside the for loop

```typescript
let char = expression[i];

if (char.match(/[0-9]/) && !hasDecimal) {
  selected = selected * 10 + (parseInt(char) - 0);
} else if (char == ".") {
  selected += ".";
  hasDecimal = true;
} else if (char.match(/[0-9]/) && hasDecimal) {
  selected += char;
}
```

- `char` variable will store the currently selected element.

- Then in the first if statement we will detect using Regex whether the `char` variable matches the pattern and whether `hasDecimal` is false.

    - Inside the first if we are computing the currently selected numbers. The `selected*10` just helps us to add a <mark>place value</mark> then add the currently selected char
     - e.g. (56) first iteration: 0 + 5; second iteration: 50 + 6

- The second else if statement just runs when we detect a `.` char and assigns true to `hasDecimal`.

- The third else if becomes true only when the `char` is an integer and `hasDecimal` is true. This means that `selected` variable will now become a string and we will not compute like in the first if statement and just add the following integers as characters until we run into an operation.

**Separate second if statment**

```typescript
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
```

- This second if statement becomes true whenever `char` is an operation or when we are in the last element of the `expression` array

- The `temp` variable stores the previously selected integer which is taken from the `stack` array using `stack.pop()`.

- Then we have a switch statement that evaluates what `sign` variable has which stores the previously selected operation.

 - Once it determines what operation it is then it executes the following blocks of code.

     - `case: +` - just push the currently selected number to the `stack` array

     - `case: -` - make the currently selected number into a negative then push it to the `stack` array

     - `case: *` - Immediately perform the operation...
    1. First by storing the previously processed number in `temp` by getting the last element in the `stack` using `stack.pop()`
    2. Then multiply the previously(`temp`) and currently(`selected`) selected number and push it to the `stack` array

    - `case: /` - Immdiately perform the operation...
    1. First by storing the previously processed number in `temp` by getting the last element in the `stack` using `stack.pop()`
    2. Then divide the previously(`temp`) and currently(`selected`) selected number and push it to the `stack` array

- Like I said earlier when we encounter an operation then `hasDecimal` will be equals to false since we will look into a new number.

- The second to the last statement which is `sign = char` proves what I said that `sign` variable stores the previously selected sign because `char` variable is the one that stores the currently selected number or operation.

- The last statement just resets the `selected` variable

#### Outside the for loop

```typescript
let result: number = 0;

while (stack.length > 0 ) {
  result += stack.pop();
}

return result;
```

- The `result` variable stores the final answer

- The `while` loop runs until we reached the first element in the `stack` array. So we will add the numbers starting from the last element of the `stack` array until the very first element.

> So the computation of the elements inside the `stack` array looks like this. e.g. +53+5+(-20)+2+(-31)

- Lastly we will just return the `result`
.