const paragraphEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const resetBtn = document.querySelector(".reset");

let paragraph = "";
const COUNT = 1;
let startTime;
let timeInterval;

function loadQuotes() {
  inputEl.value = "";
  startTime = null;
  inputEl.disabled = false;
  inputEl.value = "";
  inputEl.style.backgroundColor = "";
  inputEl.style.color = "";
  inputEl.style.cursor = "text";
  inputEl.placeholder = "start typing here...";
  inputEl.focus();

  resetStats();

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let url = `http://metaphorpsum.com/sentences/${COUNT}`;
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          paragraph = this.responseText;
          paragraphEl.innerHTML = paragraph;
          resolve(paragraph);
        } else {
          reject("Failed to load");
        }
      }
    };
    xhr.send();
  });
}

function resetStats() {
  clearInterval(timeInterval);
  wpmEl.textContent = accuracyEl.textContent = timeEl.textContent = "0";
}

function calStats() {
  const inputText = inputEl.value.trim();
  const quoteText = paragraph.trim();
  const inputwords = inputText.split(" ");
  const quotewords = quoteText.split(" ");

  const inputWords = inputText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  let sec = parseInt(timeEl.textContent) || 1;
  const timeTaken = sec / 60;
  const wpm = Math.round(inputWords / timeTaken) || 0;
  wpmEl.textContent = wpm;

  const minLength = Math.min(inputText.length, quoteText.length);
  let correctChars = 0;
  for (let i = 0; i < minLength; i++) {
    if (inputText[i] === quoteText[i]) {
      correctChars++;
    }
  }

  const accuracy = Math.round((correctChars / quoteText.length) * 100);
  accuracyEl.textContent = accuracy;
}

inputEl.addEventListener("input", () => {
  function startTimer() {
    let seconds = 0;
    timeInterval = setInterval(() => {
      seconds++;
      timeEl.textContent = seconds;
    }, 1000);
  }
  if (!startTime) {
    startTime = Date.now();
    startTimer();
  }
  calStats();
  setTimeout(() => {
    if (inputEl.value.trim() === paragraph.trim()) {
      clearInterval(timeInterval);
      inputEl.placeholder = "✅ Test completed! Great job!";
      inputEl.disabled = true;
      inputEl.style.backgroundColor = "#e8f5e8";
      inputEl.style.color = "#28a745";
      inputEl.style.cursor = "not-allowed";

      // Visual feedback
      inputEl.blur();
    }
  }, 50);
});

function protectTypingTest() {
  const input = document.getElementById("input");
  const quote = document.getElementById("quote");

  // Friendly alerts for all copy/paste attempts
  const showCheatAlert = (action) => {
    alert(
      `🚫 ${action} is disabled!\n\n📝 Please type manually for accurate results.`
    );
  };

  // Block all cheat methods
  ["paste", "copy", "cut"].forEach((event) => {
    input.addEventListener(event, (e) => {
      e.preventDefault();
      showCheatAlert("Copy-paste");
    });

    quote.addEventListener(event, (e) => {
      e.preventDefault();
      showCheatAlert("Text copying");
    });
  });

  // Right-click alert
  input.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showCheatAlert("Right-click");
  });

  // Keyboard shortcuts
  input.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && [86, 67, 88].includes(e.keyCode)) {
      e.preventDefault();
      showCheatAlert("Keyboard shortcut");
    }
  });
}

resetBtn.addEventListener("click", loadQuotes);
window.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  protectTypingTest();
});
