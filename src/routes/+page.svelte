<div class="baseContainer">
  <div class="container">
    
    <div class="textArea">
      <p class="previous">previous</p>
      <p class="total">Testing</p>
    </div>

    <div class="buttonArea">
      <button class="acButton">AC</button>
      <button class="operation">&divide;</button>
  
      <button class=number>7</button>
      <button class=number>8</button>
      <button class=number>9</button>
      <button class="operation">&times;</button>
  
      <button class=number>4</button>
      <button class=number>5</button>
      <button class=number>6</button>
      <button class="operation">&minus;</button>
  
      <button class=number>1</button>
      <button class=number>2</button>
      <button class=number>3</button>
      <button class="operation">&plus;</button>
  
      <button></button>
      <button class=number>0</button>
      <button class=number>.</button>
      <button class="operation">&equals;</button>
    </div>
  </div>
</div>


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
    column-gap: .5rem;
    row-gap: .5rem;
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
