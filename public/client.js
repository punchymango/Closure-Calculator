 // calculation object, contains all methods that add, subtract, multiply and divide
var calculation = {
  storedFunction : undefined,
  repeatFunction : undefined, //added
  moreNumbers : false,
  add : function(firstValue) {
    return function(secondValue) {
      return firstValue + secondValue;
    };
  },
 
  subtract : function(firstValue) {
    return function(secondValue) {
      return firstValue - secondValue;
    };
  },
  
  multiply : function(firstValue) {
    return function(secondValue) {
      return firstValue * secondValue;
    };
  },
  
  divide : function(firstValue) {
    return function(secondValue) {
      return firstValue / secondValue;
    };
  },
  
  negative : function(value) {
    return value * -1;
  },
  
  repeat : function(value) {
    return this.repeatFunction(value);
  },
  
  doMath : function(number, operator, symbol) {
    var outputMain = document.querySelector('h3');
    if (this.storedFunction === undefined || !calculation.moreNumbers) {
      this.storedFunction = calculation[operator](number);
      view.displayHistory(symbol);
      calculation.moreNumbers = false;
    } else {
      view.displayResult(calculation.storedFunction);
      this.doMath(parseFloat(outputMain.textContent), operator, symbol);
    }
  }
};

//everything related to storing or retrieving numbers from memory goes here
var memory = {
  storedNumber : undefined,
  storeMemory : function() {
    var outputMain = document.querySelector('h3');
    this.storedNumber = parseFloat(outputMain.textContent);
    view.memoryCheck();
  },
  addMemory : function() {
    var outputMain = document.querySelector('h3');
    if (this.storedNumber === undefined) {
      this.storedNumber = 0;
    }
    this.storedNumber = calculation.add(this.storedNumber)(parseFloat(outputMain.textContent));
    view.memoryCheck();
  },
  clearMemory : function() {
    this.storedNumber = undefined;
    view.memoryCheck();
  },
  displayMemory : function() {
    if (!isNaN(this.storedNumber)) {
      view.displayNumbers(this.storedNumber, 'replace');
      view.memoryCheck();
    } else {
      view.memoryCheck();
      return;
    }
  }
};

//everything that handles click events is here
var handlers = {
  decimalCheck : /[.]/,
  
  setupClickHandlers : function() {
    var buttonPad = document.getElementById('buttonPad');
    var outputMain = document.querySelector('h3');
    buttonPad.addEventListener('click', function(event) {
    var userInput = event.target.id;
    if (!isNaN(parseFloat(userInput))) {
      view.displayNumbers(userInput);
      view.displayHistory(userInput);
    } else if (userInput === '.') {
      if (handlers.decimalCheck.test(outputMain.textContent)) {
      return;
    } else {
      view.displayNumbers(userInput);
      view.displayHistory(userInput);
      }
    } else {
      switch(userInput) {
        case 'clear' : 
          view.clearDisplay();
        break;
        case 'negative' :
          outputMain.textContent = calculation.negative((parseFloat(outputMain.textContent)));
          break;
        case 'equals' :
          view.displayResult(calculation.storedFunction);
          break;
        case 'add' :
          calculation.doMath(parseFloat(outputMain.textContent), userInput, ' + ');
          break;
        case 'subtract' :
          calculation.doMath(parseFloat(outputMain.textContent), userInput, ' - ');
          break;
        case 'multiply' :
          calculation.doMath(parseFloat(outputMain.textContent), userInput, ' * ');
          break;
        case 'divide' :
          calculation.doMath(parseFloat(outputMain.textContent), userInput, ' / ');
          break;
        case 'backspace' :
          view.displayBackspace();
          break;
        case 'memoryStore' :
          memory.storeMemory();
          break;
        case 'memoryAdd' :
          memory.addMemory();  
          break;
        case 'memoryDisplay' :
          memory.displayMemory();  
            break;
        case 'memoryClear' :
          memory.clearMemory();  
          break;
        } 
        calculation.moreNumbers = false;
      } 
    });
  },
  
  setupKeyboardHandlers : function(event) {
    window.addEventListener('keydown', function(event) {
      var userInput = event.key;
      var outputMain = document.querySelector('h3');
      if (!isNaN(parseFloat(userInput))) {
      view.displayNumbers(userInput);
      view.displayHistory(userInput);
    } else if (userInput === '.') {
      if (handlers.decimalCheck.test(outputMain.textContent)) {
      return;
    } else {
      view.displayNumbers(userInput);
      view.displayHistory(userInput);
      }
    } else {
      switch(userInput) {
        case 'Enter' :
          view.displayResult(calculation.storedFunction);
          break;
        case '+' :
          calculation.doMath(parseFloat(outputMain.textContent), 'add', ' + ');
          break;
        case '-' :
          calculation.doMath(parseFloat(outputMain.textContent), 'subtract', ' - ');
          break;
        case '*' :
          calculation.doMath(parseFloat(outputMain.textContent), 'multiply', ' * ');
          break;
        case '/' :
          calculation.doMath(parseFloat(outputMain.textContent), 'divide', ' / ');
          break;
        case 'Backspace' :
          view.displayBackspace();
          break;
        } 
        calculation.moreNumbers = false;
      } 
    });
  }
};
  
//everything that changes the ui is here
var view = {
  displayNumbers : function(userInput) {
    var outputMain = document.querySelector('h3');
    if (outputMain.textContent === '0' || !calculation.moreNumbers || arguments[1] === 'replace') {
      outputMain.textContent = userInput;
      calculation.moreNumbers = true;
    } else {
      outputMain.textContent = outputMain.textContent + userInput;
    }
  },
  
  displayResult : function(closure) {
    var outputMain = document.querySelector('h3');
    if (typeof closure !== 'function') {
      if (calculation.repeatFunction !== undefined) {
      var result = calculation.repeatFunction(outputMain.textContent);
        } else {
        return;
        }
    } else {
    var result = closure(parseFloat(outputMain.textContent));
    }
    if (isNaN(result) === true || !Number.isFinite(result)) {
      result = "Invalid calculation";
      view.displayNumbers(result, 'replace');
    } else {
    view.displayNumbers(result, 'replace');
    view.displayHistory(result, 'replace');
    calculation.storedFunction = undefined;
    }
  }, 
  
  displayHistory : function(userInput) {
    var outputHistory = document.querySelector('h4');
    if (outputHistory.style.visibility !== 'visible') {
      outputHistory.style.visibility = 'visible';
    }
    if (outputHistory.textContent === '0' || arguments[1] === 'replace') {
      outputHistory.textContent = userInput;
    } else {
      outputHistory.textContent = outputHistory.textContent + userInput;
    }
  },
  
  displayBackspace : function() {
    var outputMain = document.querySelector('h3');
    var outputHistory = document.querySelector('h4');
    if (!calculation.moreNumbers) {
      return;
    }
    outputMain.textContent = outputMain.textContent.slice(0, -1);
    outputHistory.textContent = outputHistory.textContent.slice(0, -1);
    if (outputMain.textContent === '') {
      outputMain.textContent = '0';
    } 
    if (outputHistory.textContent === '') {
      outputHistory.textContent = '0';
    }
  },
  
  clearDisplay : function() {
    var outputMain = document.querySelector('h3');
    var outputHistory = document.querySelector('h4');
    outputMain.textContent = '0';
    outputHistory.textContent = '0';
    calculation.storedFunction = undefined;
  },
  
  memoryCheck : function() {
    var memoryIcon = document.getElementById('memory');
    if (memory.storedNumber !== undefined) {
      memoryIcon.style.visibility = 'visible';
    } else if (memory.storedNumber === undefined) {
      memoryIcon.style.visibility = 'hidden';
    }
  }
};

handlers.setupClickHandlers();
handlers.setupKeyboardHandlers();