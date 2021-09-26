"use strict";

window.addEventListener("load", function () {
  const continueBtn = document.getElementById("continue-btn");
  continueBtn.addEventListener("click", btnHandler);
});

window.addEventListener("load", startPrompts);

function startPrompts() {
  const promptList = {
    1: {
      question: "What is your fav color?",
      answers: ["red", "green", "blue"],
      values: [5, 1, 3],
    },
    2: {
      question: "What is your fav pet?",
      answers: ["dog", "cat"],
      values: [2, 1],
    },
    3: {
      question: "What is your fav sport?",
      answers: ["baseball", "soccer", "football", "tennis"],
      values: [3, 4, 5, 6],
    },
  };
  let promptToAsk = sessionStorage.getItem("prompt");
  if (
    promptToAsk &&
    promptToAsk !== undefined &&
    promptToAsk !== "" &&
    promptToAsk <= Object.keys(promptList).length
  ) {
    askUser(promptToAsk, promptList);
  } else if (promptToAsk > Object.keys(promptList).length) {
    finishPrompts();
  } else {
    promptToAsk = 1;
    sessionStorage.setItem("prompt", promptToAsk);
    askUser(promptToAsk, promptList);
  }
}

const askUser = function (targetPrompt, promptList) {
  if (
    promptList[targetPrompt] == undefined ||
    targetPrompt > Object.keys(promptList[targetPrompt]).length
  ) {
    finishPrompts();
  } else {
    removePrevQuestion();
    const questionOutput = document.getElementById("question");
    const promptArea = document.getElementById("prompt-area");
    questionOutput.textContent = `${promptList[targetPrompt].question}`;

    for (
      let color = 0;
      color < promptList[targetPrompt].answers.length;
      color++
    ) {
      const input = document.createElement("input");
      const label = document.createElement("label");

      input.type = "radio";
      input.classList.add("answer-option");
      input.id = `${promptList[targetPrompt].answers[color]}`;
      input.value = `${promptList[targetPrompt].values[color]}`;
      input.name = "option";
      label.textContent = `${promptList[targetPrompt].answers[color]}`;
      label.setAttribute("for", `${promptList[targetPrompt].answers[color]}`);

      promptArea.append(input);
      promptArea.append(label);
    }
  }
};

function btnHandler() {
  const choice = document.querySelector('input[name="option"]:checked');
  if (!choice) {
    return;
  } else {
    saveAnswer(Number(choice.value));
    nextPrompt();
  }
}

function nextPrompt() {
  const promptList = {
    1: {
      question: "What is your fav color?",
      answers: ["red", "green", "blue"],
      values: [5, 1, 3],
    },
    2: {
      question: "What is your fav pet?",
      answers: ["dog", "cat"],
      values: [2, 1],
    },
    3: {
      question: "What is your fav sport?",
      answers: ["baseball", "soccer", "football", "tennis"],
      values: [3, 4, 5, 6],
    },
  };
  let currentPrompt = sessionStorage.getItem("prompt" || "");
  currentPrompt++;
  sessionStorage.setItem("prompt", currentPrompt);
  removePrevQuestion();
  startPrompts();
}

function removePrevQuestion() {
  const questionOutput = document.getElementById("question");
  const promptArea = document.getElementById("prompt-area");

  questionOutput.textContent = "";
  while (promptArea.firstChild) {
    promptArea.removeChild(promptArea.lastChild);
  }
}

//BUG
//probably need to rewrite this whole funcion.
//maybe just push answers into array and only save on page reload
//or save in answers as an object instead and loop through
//i think the issue is trying to get + set sessionstorae values too much

const saveAnswer = function (val) {
  let savedAnswers = JSON.parse(sessionStorage.getItem("answers"));
  //if null
  if (!savedAnswers) {
    savedAnswers = [];
  }
  savedAnswers.push(val);
  sessionStorage.setItem("answers", JSON.stringify(savedAnswers));
};

function finishPrompts() {
  const promptContainer = document.getElementById("prompt-container");
  const scoreArea = document.getElementById("score-area");
  const answerArray = JSON.parse(sessionStorage.getItem("answers"));
  const replayMessage = document.createElement("p");

  while (promptContainer.firstChild) {
    promptContainer.removeChild(promptContainer.lastChild);
  }

  const calcScore = function (arr) {
    const reducer = (prevValue, currValue) => prevValue + currValue;
    const score = arr.reduce(reducer);
    return Number(score);
  };

  const finalScore = calcScore(answerArray);
  sessionStorage.setItem("final-score", JSON.stringify(finalScore));

  if (finalScore >= 8 && finalScore < 10) {
    scoreArea.textContent = `you qualify for offer 1`;
  } else if (finalScore >= 10 && finalScore < 12) {
    scoreArea.textContent = `you qualify for offer 2`;
  } else if (finalScore >= 13 && finalScore <= 15) {
    scoreArea.textContent = `you qualify for offer 3`;
  } else {
    scoreArea.textContent = `you qualify for default offer`;
  }
  replayMessage.textContent = `Please refresh your browser to take the quiz again.`;
  scoreArea.appendChild(replayMessage);

  const itemsToClear = ["prompt", "answers"];
  clearStorage(itemsToClear);
}

function clearStorage(arr) {
  for (let o = 0; o < arr.length; o++) {
    sessionStorage.clear(arr[o]);
  }
}
