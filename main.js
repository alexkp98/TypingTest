const paragraphEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const resetBtn = document.querySelector(".reset");

let paragraph = "";
let startTime;
let timeInterval;
let testCompleted = false;

// Offline quotes (no API needed)
const quotes = [
  "Be yourself everyone else is already taken.",
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect and perfect practice makes winners.",
  "To be or not to be that is the question.",
  "Life is what happens when you're busy making other plans.",
  "The only way to do great work is to love what you do.",
  "Stay hungry stay foolish.",
  "Simplicity is the ultimate sophistication.",
  "The journey of a thousand miles begins with one step.",
  "It is during our darkest moments that we must focus to see the light.",
  "Success is not final failure is not fatal it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "In the middle of difficulty lies opportunity.",
  "Your time is limited so don't waste it living someone else's life.",
  "The best way to predict the future is to create it.",
  "Do not wait the time will never be just right.",
  "Everything you've ever wanted is on the other side of fear.",
  "Whether you think you can or you think you can't you're right.",
  "The only impossible journey is the one you never begin.",
  "Live as if you were to die tomorrow learn as if you were to live forever.",
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function loadQuotes() {
  testCompleted = false;
  inputEl.innerHTML = "";
  startTime = null;
  clearInterval(timeInterval);
  inputEl.contentEditable = true;
  inputEl.style.backgroundColor = "";
  inputEl.style.color = "";
  inputEl.style.cursor = "text";
  inputEl.title = "";
  resetStats();
  document.querySelector(".container").classList.remove("celebrating");

  paragraph = getRandomQuote();
  paragraphEl.textContent = paragraph;

  inputEl.focus();
}

function resetStats() {
  clearInterval(timeInterval);
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";
  timeEl.textContent = "0";
}

function highlightTyping() {
  const inputText = inputEl.textContent || "";
  const quoteText = paragraph;

  let html = "";

  for (let i = 0; i < inputText.length && i < quoteText.length; i++) {
    const ch = inputText[i];
    const target = quoteText[i];

    if (ch === target) {
      html += `<span class="correct">${ch}</span>`;
    } else if (ch.toLowerCase() === target.toLowerCase()) {
      html += `<span class="wrong-case">${ch}</span>`;
    } else {
      html += `<span class="incorrect">${ch}</span>`;
    }
  }

  inputEl.innerHTML = html;

  // Caret at end (simple, avoids focus bugs)
  const range = document.createRange();
  range.selectNodeContents(inputEl);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function calStats() {
  if (testCompleted) return;

  highlightTyping();

  const inputText = inputEl.textContent || "";
  const quoteText = paragraph;

  const seconds = parseInt(timeEl.textContent) || 1;
  const timeMinutes = seconds / 60;

  const inputWords = inputText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const wpm = Math.round(inputWords / timeMinutes) || 0;
  wpmEl.textContent = wpm;

  const minLength = Math.min(inputText.length, quoteText.length);
  let correctChars = 0;
  for (let i = 0; i < minLength; i++) {
    if (
      inputText[i] === quoteText[i] ||
      inputText[i]?.toLowerCase() === quoteText[i]?.toLowerCase()
    ) {
      correctChars++;
    }
  }
  const accuracy = Math.round((correctChars / quoteText.length) * 100) || 0;
  accuracyEl.textContent = accuracy;
}

function finishTest() {
  if (testCompleted) return;

  testCompleted = true;
  clearInterval(timeInterval);

  inputEl.contentEditable = false;
  inputEl.style.backgroundColor = "#e8f5e8";
  inputEl.style.color = "#28a745";
  inputEl.style.cursor = "not-allowed";
  inputEl.title = "✅ Perfect! Click 'Try again' for a new quote";

  wpmEl.textContent += " ⭐";
  accuracyEl.textContent = "100 ⭐";
  document.querySelector(".container").classList.add("celebrating");
}

function protectTypingTest() {
  const showCheatAlert = (action) => {
    alert(
      `🚫 ${action} is disabled!\n\n📝 Please type manually for accurate results.`
    );
  };

  ["paste", "copy", "cut"].forEach((event) => {
    inputEl.addEventListener(event, (e) => {
      e.preventDefault();
      showCheatAlert("Copy-paste");
    });
    paragraphEl.addEventListener(event, (e) => {
      e.preventDefault();
      showCheatAlert("Text copying");
    });
  });

  inputEl.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showCheatAlert("Right-click");
  });

  inputEl.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && [86, 67, 88].includes(e.keyCode)) {
      e.preventDefault();
      showCheatAlert("Keyboard shortcut");
    }
  });
}

inputEl.addEventListener("input", () => {
  if (testCompleted) return;

  if (!startTime) {
    startTime = Date.now();
    let seconds = 0;
    timeInterval = setInterval(() => {
      seconds++;
      timeEl.textContent = seconds;
    }, 1000);
  }

  calStats();

  setTimeout(() => {
    if (inputEl.textContent.trim() === paragraph.trim() && !testCompleted) {
      finishTest();
    }
  }, 50);
});

resetBtn.addEventListener("click", loadQuotes);

window.addEventListener("DOMContentLoaded", () => {
  protectTypingTest();
  loadQuotes();
});
