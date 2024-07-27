let num1, num2, operator, correctAnswer;
let voices = [];
let selectedVoice = null;

const operatorToPronuciation = new Map([
    ['*', 'times'],
    ['/', 'divided by'],
    ['-', 'minus'],
    ['+', 'plus']
]);

let selectedCharecters = []

function setSelectedOptions() {
    
    const operationsElement = document.getElementById("charecters");
    const operationsSelected = Array.from(charectersElement.selectedOptions);
    selectedCharecters = selectedOptions.map(option => option.text);
    
    const charectersElement = document.getElementById("charecters");
    const selectedOptions = Array.from(charectersElement.selectedOptions);
    selectedCharecters = selectedOptions.map(option => option.text);
}

function generateProblem() {
    document.getElementById('charecters').innerText
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
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
}

function checkAnswer(event) {
    if (event && event.key !== 'Enter') {
        return;
    }    
    const userAnswer = parseFloat(document.getElementById('answer').value);
    if (userAnswer === correctAnswer) {
        document.getElementById('result').innerText = 'Correct!';
        speakProblem('Correct!');
    } else {
        document.getElementById('result').innerText = `Wrong! The correct answer is ${correctAnswer}`;
        speakProblem(`Wrong! The correct answer is ${correctAnswer}`);
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
        voiceSelect.appendChild(option);
    });
    voiceSelect.onchange = () => {
        selectedVoice = voices[voiceSelect.value];
    };
}

window.speechSynthesis.onvoiceschanged = populateVoiceList;
window.onload = () => {
    // populateVoiceList();
    generateProblem();
   
};
