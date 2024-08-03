let num1, num2, operator, correctAnswer;
let voices = [];
let selectedVoice = null;

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

let elapsedTime = 0; // Time in seconds
let lastTime = 0
let timerInterval; 

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
    console.log(minutesElapsed, secondsElapsed)
    return { minutesElapsed, secondsElapsed };
}

function setSelectedOptions() {
    
    const operationsElement = document.getElementById("operations");
    const selectedOperationOptions = Array.from(operationsElement.selectedOptions);
    selectedOperations = selectedOperationOptions .map(option => option.text);
    
    const charectersElement1 = document.getElementById("firstNumberCharecters");
    const selectedCharecterOptions1 = Array.from(charectersElement1.selectedOptions);
    selectedCharecters1 = selectedCharecterOptions1 .map(option => option.text);
    
    const charectersElement2 = document.getElementById("secondNumberCharecters");
    const selectedCharecterOptions2 = Array.from(charectersElement2.selectedOptions);
    selectedCharecters2 = selectedCharecterOptions2 .map(option => option.text);

    firstNumberDigits = document.getElementById("secondNumbersDigits").value;
    secondNumbersDigits = document.getElementById("firstNumbersDigits").value;

}

function generateProblem() {
    // document.getElementById('charecters').innerText
    num1 = "" 
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
    document.getElementById('problem').innerText = `${num1} ${operator} ${num2} = ?`;
    speakProblem(`${num1} ${operatorToPronuciation.get(operator)} ${num2}`);
    startTimer();
}

function checkAnswer(event) {
    if (event && event.key !== 'Enter') {
        return;
    }    
    const {minutesElapsed, secondsElapsed} = stopTimer();
    const userAnswer = parseFloat(document.getElementById('answer').value);
    if (userAnswer === correctAnswer) {
        document.getElementById('result').innerText = `Correct!`;
        speakProblem(`Correct!`);
    } else {
        document.getElementById('result').innerText = `Wrong! The correct answer is ${correctAnswer}!`;
        speakProblem(`Wrong! The correct answer is ${correctAnswer}!`);
    }
    console.log(minutesElapsed)
    console.log(secondsElapsed)
    if (minutesElapsed === 0) {
        speakProblem(`you took ${secondsElapsed} seconds to answer!`);
    } 
    else if (secondsElapsed === 0) {
        speakProblem(`you took ${minutesElapsed} minutes to answer!`);
    }
    else {
        speakProblem(`you took ${minutesElapsed} minutes and ${secondsElapsed} seconds to answer!`)
    }

    document.getElementById('answer').value = '';
    generateProblem();
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

function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = '';

    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;
        // console.log(voice.name)
        // Set Microsoft Ava Online (Natural) as the default selected voice
        if (voice.name === "Microsoft Ava Online (Natural) - English (United States)") {
            option.selected = true;
            selectedVoice = voice; // Set the selectedVoice to the default selected voice
        }

        voiceSelect.appendChild(option);
    });

    // Set the selectedVoice to the currently selected option in the dropdown
    voiceSelect.onchange = () => {
        selectedVoice = voices[voiceSelect.value];
    };
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

window.speechSynthesis.onvoiceschanged = populateVoiceList;
window.onload = () => {
    populateVoiceList();
    generateProblem();

    // Add event listener to start speech recognition when the user starts speaking
    document.getElementById('answer').addEventListener('focus', () => {
        startSpeechRecognition();
        recognition.start();
    });

    document.getElementById('answer').addEventListener('blur', () => {
        recognition.stop();
    });
   
};
