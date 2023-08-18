<script>
	// @ts-nocheck

	let previous = '';
	export let input = '';
	let operatorClick = true;
	let decimalClick = true;
	let initial = true;

	async function compute() {
		const response = await fetch('/compute');
		let result = await response.json();
		result = result.toString();
		input = result;
	}

	function buttonPress(button) {
		if (initial) {
			if (button.match(/[0-9]/)) {
				input += button;
				initial = false;
				operatorClick = false;
				decimalClick = false;
			}
			if (button.match('clear')) {
				input = '';
				previous = '';
				initial = true;
			}
			if (button.match('delete')) {
				input = input.slice(0, -1);
			}
		} else {
			if (button.match(/[0-9]/)) {
				input += button;
				operatorClick = false;
			} else {
				if (!operatorClick && button.match(/[+\-*/]/)) {
					input += button;
					operatorClick = true;
					decimalClick = false;
				}
				if (!operatorClick && !decimalClick && button.match(/\./)) {
					input += button;
					operatorClick = true;
					decimalClick = true;
				}
				if (button.match('clear')) {
					input = '';
					previous = '';
					initial = true;
				}
				if (button.match('delete')) {
					input = input.slice(0, -1);
				}
			}
		}
	}

	function onKeyDown(e) {
		if (e.key == 'Enter') {
			const equals = document.querySelector('.equals');
			equals?.focus();
		}

		if (initial) {
			if (e.key.match(/[0-9]/) && !(e.keyCode >= 112 && e.keyCode <= 123)) {
				input += e.key;
				initial = false;
				operatorClick = false;
				decimalClick = false;
			}
			if (e.keyCode == 8) {
				input = input.slice(0, -1);
			}
		} else {
			if (e.key.match(/[0-9]/) && !(e.keyCode >= 112 && e.keyCode <= 123)) {
				input += e.key;
				operatorClick = false;
			} else {
				if (!operatorClick && e.key.match(/[+\-*/]/)) {
					input += e.key;
					operatorClick = true;
					decimalClick = false;
				}
				if (!operatorClick && !decimalClick && e.key.match(/\./)) {
					!decimalClick;
					input += e.key;
					operatorClick = true;
					decimalClick = true;
				}
				if (e.keyCode == 8) {
					input = input.slice(0, -1);
				}
			}
		}
	}
</script>

<div class="baseContainer">
	<div class="container">
		<div class="textArea">
			<p class="previous">{previous}</p>
			<p class="total">{input}</p>
		</div>

		<input autocomplete="off" name="expression" value={input} hidden />
		<div class="buttonArea">
			<button type="button" class="acButton" on:click={() => buttonPress('clear')}>AC</button>
			<button type="button" class="operation" on:click={() => buttonPress('/')}>&divide;</button>

			<button type="button" class="number" on:click={() => buttonPress('7')}>7</button>
			<button type="button" class="number" on:click={() => buttonPress('8')}>8</button>
			<button type="button" class="number" on:click={() => buttonPress('9')}>9</button>
			<button type="button" class="operation" on:click={() => buttonPress('*')}>&times;</button>

			<button type="button" class="number" on:click={() => buttonPress('4')}>4</button>
			<button type="button" class="number" on:click={() => buttonPress('5')}>5</button>
			<button type="button" class="number" on:click={() => buttonPress('6')}>6</button>
			<button type="button" class="operation" on:click={() => buttonPress('-')}>&minus;</button>

			<button type="button" class="number" on:click={() => buttonPress('1')}>1</button>
			<button type="button" class="number" on:click={() => buttonPress('2')}>2</button>
			<button type="button" class="number" on:click={() => buttonPress('3')}>3</button>
			<button type="button" class="operation" on:click={() => buttonPress('+')}>&plus;</button>

			<button type="button" class="deleteButton" on:click={() => buttonPress('delete')}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="25"
					height="25"
					fill="currentColor"
					class="bi bi-backspace"
					viewBox="0 0 16 16"
				>
					<path
						d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"
					/>
					<path
						d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z"
					/>
				</svg></button
			>
			<button type="button" class="number" on:click={() => buttonPress('0')}>0</button>
			<button type="button" class="number" on:click={() => buttonPress('.')}>.</button>
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
				}}>&equals;</button
			>
		</div>
	</div>
</div>

<svelte:window on:keydown={onKeyDown} />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;700&family=Poppins:ital,wght@0,100;0,300;0,400;0,700;1,100;1,300;1,400;1,700&display=swap');

	:root {
		--buttonBackground: #f7f7f7;
		--buttonArea: #f9f9f9;
		--operation: #f37878;
		--green: #32fad6;
	}

	* {
		margin: 0;
		padding: 0;
		font-family: 'Inter', sans-serif;
		font-family: 'Poppins', sans-serif;
	}

	.bi-backspace {
		margin-top: 10px;
	}

	.baseContainer {
		display: flex;
		justify-content: center;
	}

	.container {
		text-align: center;
	}

	.textArea {
		height: 300px;
		width: calc(320px + 96px + 15px);
		margin: auto;
		text-align: right;
		position: relative;
		overflow: hidden;
		white-space: nowrap;
	}

	.textArea:before {
		content: '';
		display: block;
		background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 80%);
		position: absolute;
		top: 0;
		bottom: 0;
		left: -50px;
		right: calc(320px + 96px + 20px);
		z-index: 1;
		box-shadow: 20px 0 30px 50px white;
	}

	.textArea .total {
		position: absolute;
		bottom: 30px;
		right: 0;
		font-weight: bold;
		font-size: 3rem;
	}

	.textArea .previous {
		position: absolute;
		right: 0;
		bottom: 150px;
		font-size: 1.5rem;
	}

	.buttonArea {
		display: grid;
		grid-template-columns: 6rem 6rem 6rem 6rem;
		grid-template-rows: 6rem 6rem 6rem 6rem 6rem;
		column-gap: 0.5rem;
		row-gap: 0.5rem;
		font-weight: bold;
		width: 100%;
		justify-content: center;
		padding: 30px 0 30px 0;
		margin-top: 20px;
		background-color: var(--buttonArea);
		width: 500px;
		margin: auto;
		border-radius: 35px;
	}

	.buttonArea button {
		font-size: 1.5rem;
		background-color: var(--buttonBackground);
		border: none;
		border-radius: 25%;
		transition: 250ms;
	}

	.buttonArea .number:hover {
		background-color: #d8d8d8;
	}

	.buttonArea .operation:hover,
	.buttonArea .deleteButton:hover {
		background-color: var(--operation);
		color: black;
	}

	.buttonArea .acButton:hover {
		background-color: var(--green);
		color: black;
	}

	.buttonArea .acButton {
		grid-column: 1 / span 3;
		border-radius: 30px 30px 30px 30px;
		color: var(--green);
		font-weight: bold;
	}

	.buttonArea .operation {
		color: var(--operation);
		font-weight: bold;
	}

	.buttonArea .number {
		font-weight: bold;
	}

	/* Container */
	@media screen and (min-width: 1400px) {
		.container {
			width: 1320px;
		}
	}

	@media screen and (min-width: 1200px) and (max-width: 1400px) {
		.container {
			width: 1140px;
		}
	}

	@media screen and (min-width: 992px) and (max-width: 1200px) {
		.container {
			width: 960px;
		}
	}

	@media screen and (min-width: 768px) and (max-width: 992px) {
		.container {
			width: 720px;
		}
	}

	@media screen and (min-width: 576px) and (max-width: 768px) {
		.container {
			width: 540px;
		}
	}

	@media screen and (max-width: 576px) {
		.container {
			width: 100%;
		}
	}
</style>
