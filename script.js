let time = 60;
let interval = null;
let isRunning = false;
let currentText = "";

// 📚 Passages
let passages = [
  "The quick brown fox jumps over the lazy dog",
  "Typing fast requires practice and patience every day",
  "JavaScript helps you build interactive web applications",
  "Consistency is the key to improving typing speed",
  "Good typing skills increase productivity in coding",
  "Artificial intelligence is changing the world rapidly",
  "Practice makes a man perfect in every field of life"
];

// 🎲 Load random text
function loadRandomText() {
  let index = Math.floor(Math.random() * passages.length);
  currentText = passages[index];
  let container = document.getElementById("textToType");
  container.innerHTML = "";

  for (let i = 0; i < currentText.length; i++) {
    let span = document.createElement("span");
    span.innerText = currentText[i];
    span.dataset.char = currentText[i];
    container.appendChild(span);
  }
}

function updateHighlight() {
  let input = document.getElementById("inputBox").value;
  let spans = document.getElementById("textToType").querySelectorAll("span");

  spans.forEach((span, idx) => {
    span.classList.remove("correct", "wrong");

    if (idx < input.length) {
      let typedChar = input[idx];
      let originalChar = span.dataset.char;
      if (typedChar === originalChar) {
        span.classList.add("correct");
      } else {
        span.classList.add("wrong");
      }
    }
  });
}

// 🚀 Start Test
function startTest() {
  // stop old timer
  if (interval !== null) {
    clearInterval(interval);
  }

  isRunning = true;
  time = 60;

  document.getElementById("result").style.display = "none";

  loadRandomText();

  document.getElementById("inputBox").value = "";
  document.getElementById("inputBox").focus();
  updateHighlight();

  document.getElementById("timer").innerText = time;

  interval = setInterval(() => {
    if (!isRunning) return;

    time--;
    document.getElementById("timer").innerText = time;

    if (time <= 0) {
      isRunning = false;
      clearInterval(interval);
      calculateResult();
    }
  }, 1000);
}

// ✅ DONE BUTTON FIX
function finishTest() {
  isRunning = false;
  clearInterval(interval);
  interval = null;

  calculateResult();
}

// 📊 Calculate Result
function calculateResult() {
  isRunning = false;
  clearInterval(interval);
  interval = null;

  let input = document.getElementById("inputBox").value.trim();

  let typedWords = input.length > 0 ? input.split(/\s+/).length : 0;
  let wpm = typedWords;

  let correctChars = 0;
  let mistakes = {};

  for (let i = 0; i < currentText.length; i++) {
    let originalChar = currentText[i];
    let typedChar = input[i];

    if (typedChar === originalChar) {
      correctChars++;
    } else {
      let wrongChar = originalChar;
      if (wrongChar === " ") wrongChar = "[space]";

      if (mistakes[wrongChar]) {
        mistakes[wrongChar]++;
      } else {
        mistakes[wrongChar] = 1;
      }
    }
  }

  let accuracy = Math.round((correctChars / currentText.length) * 100);

  let mistakeText = "Mistaken Letters:\n";
  for (let char in mistakes) {
    mistakeText += char + " → " + mistakes[char] + " times\n";
  }

  document.getElementById("wpmResult").innerText = "WPM: " + wpm;
  document.getElementById("accuracyResult").innerText = "Accuracy: " + accuracy + "%";
  document.getElementById("mistakeResult").innerText = mistakeText;

  document.getElementById("result").style.display = "block";
}

// 🔄 Restart
function restartTest() {
  startTest();
}

document.getElementById("inputBox").addEventListener("input", updateHighlight);