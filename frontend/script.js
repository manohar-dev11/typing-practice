const textDisplay = document.getElementById("text-display");
const typingInput = document.getElementById("typing-input");
const startBtn = document.getElementById("start-btn");

const wpmSpan = document.getElementById("wpm");
const netWpmSpan = document.getElementById("net-wpm");
const accuracySpan = document.getElementById("accuracy");
const errorsSpan = document.getElementById("errors");
const timerSpan = document.getElementById("timer");

let testText = "The quick brown fox jumps over the lazy dog.";
let timer = 60;
let interval;
let started = false;

let startTime;
let typedChars = 0;
let correctChars = 0;
let errorCount = 0;

// Display initial text
textDisplay.textContent = testText;

// Start Test
startBtn.addEventListener("click", () => {
  typingInput.value = "";
  timer = 60;
  timerSpan.textContent = `Time: ${timer}s`;
  typedChars = 0;
  correctChars = 0;
  errorCount = 0;
  started = true;
  startTime = new Date();

  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    timerSpan.textContent = `Time: ${timer}s`;
    if (timer <= 0) finishTest();
  }, 1000);
});

// Capture typing
typingInput.addEventListener("input", () => {
  if (!started) return;

  const input = typingInput.value;
  typedChars = input.length;

  // Count errors and correct chars
  correctChars = 0;
  errorCount = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === testText[i]) correctChars++;
    else errorCount++;
  }

  // Update stats
  const minutes = (60 - timer) / 60;
  const wpm = minutes > 0 ? Math.round((typedChars / 5) / minutes) : 0;
  const netWpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;

  wpmSpan.textContent = `WPM: ${wpm}`;
  netWpmSpan.textContent = `Net WPM: ${netWpm}`;
  accuracySpan.textContent = `Accuracy: ${accuracy}%`;
  errorsSpan.textContent = `Errors: ${errorCount}`;
});

// Finish Test
function finishTest() {
  clearInterval(interval);
  started = false;
  alert("Test finished! Sending results to server...");

  // Send data to backend
  const token = localStorage.getItem("token"); // assume JWT stored after login
  fetch("http://localhost:5000/api/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      grossWpm: parseInt(wpmSpan.textContent.split(": ")[1]),
      netWpm: parseInt(netWpmSpan.textContent.split(": ")[1]),
      accuracy: parseFloat(accuracySpan.textContent.split(": ")[1]),
      errors: errorCount,
      keystrokeData: [] // we can capture per-keystroke timestamps later
    })
  })
  .then(res => res.json())
  .then(data => console.log("Saved session:", data))
  .catch(err => console.log(err));
}
