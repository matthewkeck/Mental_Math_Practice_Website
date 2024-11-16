let num1, num2, operator, correctAnswer;

const operatorToPronuciation = new Map([
    ['*', 'multiplyed by'],
    ['/', 'divided by'],
    ['-', 'subtracted by'],
    ['+', 'added to']
]);

let selectedCharecters1 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
let selectedCharecters2 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
let selectedOperations = ["*", "/", "-", "+"]
let firstNumberDigits = 2
let secondNumbersDigits = 2
let selectedVoiceName = "Microsoft Ava Online (Natural) - English (United States)";

let selectedVoice = null;

let elapsedTime = 0; // Time in seconds
let lastTime = 0
let timerInterval; 

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        operation: params.get('operation') ? params.get('operation').split(',') : [],
        charecters1: params.get('charecters1') ? params.get('charecters1').split(',') : [],
        charecters2: params.get('charecters2') ? params.get('charecters2').split(',') : [],
        numDigits1: parseInt(params.get('numDigits1')) || 2,
        numDigits2: parseInt(params.get('numDigits2')) || 2,
        selectedVoice: params.get('selectedVoice') || null
    };
}

function prependInput(element) {
    // Track the last value to detect backspace/delete action
    let previousValue = element.getAttribute('data-previous-value') || '';
    
    // Capture the current input value
    const currentValue = element.value;

    // Check if the current value is shorter than the previous value (indicating a delete)
    if (currentValue.length < previousValue.length) {
        // A delete occurred, handle it by removing the last character
        element.value = previousValue.slice(1);
    } else {
        // No delete occurred, get the new character typed
        const newChar = currentValue.slice(-1);

        // Check if the new character is a digit
        if (!/\d/.test(newChar)) {
            // If not, remove it from the input value
            element.value = currentValue.slice(0, -1);
        } else {
            // Prepend the new character to the previous value
            element.value = newChar + previousValue;
        }
    }

    // Store the new value as the previous value for the next input event
    element.setAttribute('data-previous-value', element.value);
}


function startTimer() {
    const timerElement = document.getElementById('timer');

    timerInterval = setInterval(() => {
        elapsedTime++;

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const minutesElapsed = Math.floor(elapsedTime / 60);
    const secondsElapsed = elapsedTime % 60;
    elapsedTime = 0;
    // console.log(minutesElapsed, secondsElapsed)
    return { minutesElapsed, secondsElapsed };
}

function generateProblem() {
    // document.getElementById('charecters').innerText
    num1 = "" 
    // console.log(selectedCharecters1)
    for (let i = 0; i < firstNumberDigits; i++) {
        num1 = num1 + selectedCharecters1[Math.floor(Math.random() * selectedCharecters1.length)]
    }
    num2 = "" 
    for (let i = 0; i < secondNumbersDigits; i++) {
        num2 = num2 + selectedCharecters2[Math.floor(Math.random() * selectedCharecters2.length)]
    }

    num1 = parseInt(num1);
    num2 = parseInt(num2);

    operator = selectedOperations[Math.floor(Math.random() * selectedOperations.length)];
    switch (operator) {
        case '+':
            correctAnswer = num1 + num2;
            break;
        case '-':
            correctAnswer = num1 - num2;
            break;
        case '*':
            correctAnswer = num1 * num2;
            break;
        case '/':
            correctAnswer = Math.round((num1 / num2) * 100) / 100; // Rounded to 2 decimals
            break;
    }

    document.getElementById('firstNumber').innerText = `${num1}`
    document.getElementById('operation').innerText = `${operator}`
    document.getElementById('secondNumber').innerText = `${num2} = ?`
    adjustInput();
    
    // document.getElementById('problem').innerText = `${num1} ${operator} ${num2} = ?`;
    // speakProblem(`${num1} ${operatorToPronuciation.get(operator)} ${num2}`);
    startTimer();
}

let correctCount = 0;
let wrongCount = 0;

function checkAnswer(event) {
    if (event && event.key !== 'Enter') {
        return;
    }    
    const answerInput = document.getElementById('answer');
    console.log(answerInput)
    const {minutesElapsed, secondsElapsed} = stopTimer();
    const userAnswer = parseFloat(answerInput.value);
    const timeTaken = `${num1}${operator}${num2}=${userAnswer} ${minutesElapsed}:${secondsElapsed}`;
    if (userAnswer === correctAnswer) {
        // document.getElementById('result').innerText = `${userAnswer} is Correct! You took ${minutesElapsed} minutes and ${secondsElapsed} seconds to answer!`;
        // document.getElementById('result').innerText = `Correct!`;
        // speakProblem(`${userAnswer} is Correct!`);
        correctCount++;  // Increment correct answers count
        addTimeToList('correctTimes', timeTaken);  // Add time to correct column
    } else {
        // document.getElementById('result').innerText = `Wrong!`;
        // speakProblem(`${userAnswer} is Wrong! The correct answer is ${correctAnswer}!`);
        wrongCount++;  // Increment wrong answers count
        addTimeToList('wrongTimes', timeTaken);  // Add time to wrong column
    }

    if (minutesElapsed === 0) {
        // speakProblem(`you took ${secondsElapsed} seconds to answer!`);
    } 
    else if (secondsElapsed === 0) {
        // speakProblem(`you took ${minutesElapsed} minutes to answer!`);
    }
    else {
        // speakProblem(`you took ${minutesElapsed} minutes and ${secondsElapsed} seconds to answer!`)
    }

    // Clear the input field and reset the previous value attribute
    answerInput.value = '';
    answerInput.setAttribute('data-previous-value', '');

    document.getElementById('answer').value = '';
    generateProblem();
}

// Function to add time to the correct or wrong times list
function addTimeToList(listId, timeTaken) {
    const list = document.getElementById(listId);
    const listItem = document.createElement('li');
    listItem.textContent = timeTaken;
    list.appendChild(listItem);
}

function speakProblem(problem) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(problem);
        utterance.voice = selectedVoice;
        speechSynthesis.speak(utterance);
    } else {
        alert('Your browser does not support text to speech.');
    }
}

function startSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = function() {
            console.log('Speech recognition started');
        };

        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            console.log(`Result received: ${speechResult}`);
            document.getElementById('answer').value = speechResult;
            checkAnswer();
        };

        recognition.onspeechend = function() {
            recognition.stop();
        };

        recognition.onerror = function(event) {
            console.error(`Speech recognition error detected: ${event.error}`);
        };
    } else {
        alert('Your browser does not support speech recognition.');
    }
}

function setVoice() {
    const allVoices = speechSynthesis.getVoices();
    console.log("voices", allVoices.length)
    selectedVoice = allVoices.find(voice => voice.name === selectedVoiceName) || null;
    console.log(selectedVoice.name)
    if (!selectedVoice) {
        console.warn('Selected voice not found, using default voice.');
        selectedVoice = allVoices[6];
    }
}

// function adjustInputWidth() {
//     const userInpt = document.getElementById('userInput');
//     const problem = document.getElementById('problem');

//     // const problemPerimiter = referenceElement.getBoundingClientRect();
//     userInpt.style.width = `${1}em`;
//     // userInpt.style.marginRight = `${secondNumbersDigits}em`;
//     userInpt.style.marginLeft = `${160 - (6 * secondNumbersDigits)}px`;

// }

function adjustInput() {
    const firstNumber = document.getElementById('firstNumber');
    const inputBox = document.getElementById('answer');

    if (firstNumber && inputBox) {
        // Get the size and position of the problem div
        const problemRect = firstNumber.getBoundingClientRect();

        // Set the input box size and position to match the problem div
        inputBox.style.width = `${problemRect.width + 50}px`;  // Set width to match
        inputBox.style.height = `${problemRect.height}px`; // Optional: if you want to match height
        inputBox.style.position = 'absolute';  // Use absolute positioning to align it
        inputBox.style.left = `${problemRect.left - 50}px`;    // Align to left of problem div
        inputBox.style.top = `${problemRect.bottom + 10}px`; // Align just below the problem div, add 10px margin for spacing

    } else {
        console.log("firstNumber or inputBox not found")
    }

}

window.onload = () => {
    const params = getQueryParams();
    
    selectedOperations = params.operation;
    selectedCharecters1 = params.charecters1;
    selectedCharecters2 = params.charecters2;
    firstNumberDigits = params.numDigits1;
    secondNumbersDigits = params.numDigits2;
    selectedVoiceName = params.selectedVoice;

    console.log(selectedOperations, selectedCharecters1, selectedCharecters2, firstNumberDigits, secondNumbersDigits, selectedVoiceName)

    generateProblem();
    
    
    // Add event listener to start speech recognition when the user starts speaking
    // document.getElementById('answer').addEventListener('focus', () => {
    //     startSpeechRecognition();
    //     recognition.start();
    // });

    // document.getElementById('answer').addEventListener('blur', () => {
    //     recognition.stop();
    // });
   
};
