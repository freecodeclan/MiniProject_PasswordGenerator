'use strict';
const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');

const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const upperCaseCheck = document.querySelector('#upperCase');
const lowerCaseCheck = document.querySelector('#lowerCase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox');
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//--Initial Start
let password = '';
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator('#ccc');

//--Set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const randomNum = getRandomInteger(0, symbols.length);
  return symbols.charAt(randomNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator('#0f0');
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator('#ff0');
  } else {
    setIndicator('#f00');
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = 'copied';
  } catch (e) {
    copyMsg.innerText = 'failed';
  }

  //--To make copy wala span visible
  copyMsg.classList.add('active');

  setTimeout(() => {
    copyMsg.classList.remove('active');
  }, 2000);
}

function shufflePassword(array) {
  //--Fisher Yates Method use for shuffling
  for (let i = array.length - 1; i > 0; i--) {
    //--Finding random j
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = '';
  array.forEach(el => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach(checkbox => {
    if (checkbox.checked) checkCount++;
  });

  //--Special Condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach(checkbox => {
  checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', e => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener('click', () => {
  //--If none of the checkboxes are selected
  if (checkCount == 0) {
    return;
  }
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //-- Now lets find the new password
  console.log('Looking for new password');

  //--Remove old Password
  password = '';

  //--let's put the stuff mentioned by checkboxes

  // if(uppercaseCheck.checked) {
  //     password += generateUpperCase();
  // }

  // if(lowercaseCheck.checked) {
  //     password += generateLowerCase();
  // }

  // if(numbersCheck.checked) {
  //     password += generateRandomNumber();
  // }

  // if(symbolsCheck.checked) {
  //     password += generateSymbol();
  // }

  let functionArr = [];
  if (upperCaseCheck.checked) {
    functionArr.push(generateUpperCase);
  }

  if (lowerCaseCheck.checked) {
    functionArr.push(generateLowerCase);
  }

  if (numbersCheck.checked) {
    functionArr.push(generateRandomNumber);
  }

  if (symbolsCheck.checked) {
    functionArr.push(generateSymbol);
  }

  //-- Compulsory Addition
  for (let i = 0; i < functionArr.length; i++) {
    password += functionArr[i]();
  }
  console.log('Compulsory Addition done');

  //--Now remaining addition
  for (let i = 0; i < passwordLength - functionArr.length; i++) {
    let randomIndex = getRandomInteger(0, functionArr.length);
    console.log('randomIndex' + randomIndex);
    password += functionArr[randomIndex]();
  }
  console.log('Remaining addition done');

  //-- Calling the shuffle Password
  password = shufflePassword(Array.from(password));
  console.log('Shuffling done');

  //--Now show in UI
  passwordDisplay.value = password;
  console.log('UI done');

  //-- Now calling calcStrength function
  calcStrength();
});
