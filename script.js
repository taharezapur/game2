
const $ = (id) => document.getElementById(id);

const loginScreen = $("loginScreen");
const creatorScreen = $("creatorScreen");
const gameScreen = $("gameScreen");

const playerNameInput = $("playerName");
const welcomeName = $("welcomeName");
const gamePlayerName = $("gamePlayerName");

const arena = $("arena");
const target = $("target");
const gameWelcome = $("gameWelcome");
const message = $("message");

const scoreEl = $("score");
const timeEl = $("time");
const bestEl = $("best");

let playerName = "";
let score = 0;
let time = 30;
let best = 0;
let playing = false;
let timer = null;
let targetSize = 48;

// خواندن رکورد ذخیره‌شده
try {
  best = Number(localStorage.getItem("neonHuntBest")) || 0;
} catch (error) {
  best = 0;
}

bestEl.textContent = best;

// تغییر صفحه
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ورود بازیکن
$("loginBtn").addEventListener("click", () => {
  const name = playerNameInput.value.trim();

  if (!name) {
    playerNameInput.focus();
    playerNameInput.placeholder = "اول اسمت رو وارد کن!";
    playerNameInput.style.borderColor = "#ff5478";
    return;
  }

  playerName = name;

  welcomeName.textContent = playerName;
  gamePlayerName.textContent = playerName;

  showScreen(creatorScreen);
});

// امکان ورود با کلید Enter
playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    $("loginBtn").click();
  }
});

// بازگشت به صفحه ورود
$("backBtn").addEventListener("click", () => {
  showScreen(loginScreen);
});

// ورود به محیط بازی
$("enterGameBtn").addEventListener("click", () => {
  showScreen(gameScreen);
  prepareGame();
});

// نمایش دوباره معرفی سازنده
$("aboutAgainBtn").addEventListener("click", () => {
  stopGame();
  showScreen(creatorScreen);
});

// خروج از بازی
$("exitBtn").addEventListener("click", () => {
  stopGame();
  showScreen(loginScreen);
});

// آماده‌سازی محیط بازی
function prepareGame() {
  stopGame();

  score = 0;
  time = 30;
  targetSize = 48;

  scoreEl.textContent = score;
  timeEl.textContent = time;

  gameWelcome.hidden = false;
  target.hidden = true;
  message.hidden = true;
}

// شروع بازی
function startGame() {
  stopGame();

  score = 0;
  time = 30;
  targetSize = 48;
  playing = true;

  scoreEl.textContent = score;
  timeEl.textContent = time;

  gameWelcome.hidden = true;
  message.hidden = true;
  target.hidden = false;

  moveTarget();

  timer = setInterval(() => {
    if (!playing) return;

    time--;
    timeEl.textContent = time;

    if (time <= 0) {
      endGame();
    }
  }, 1000);
}

// جابه‌جایی تصادفی هدف
function moveTarget() {
  const padding = targetSize / 2 + 6;

  const maxX = arena.clientWidth - padding;
  const maxY = arena.clientHeight - padding;

  const x = padding + Math.random() * Math.max(0, maxX - padding);
  const y = padding + Math.random() * Math.max(0, maxY - padding);

  target.style.width = targetSize + "px";
  target.style.height = targetSize + "px";
  target.style.left = x + "px";
  target.style.top = y + "px";
}

// زدن هدف
target.addEventListener("click", () => {
  if (!playing) return;

  score++;
  scoreEl.textContent = score;

  // افزایش سختی هر پنج امتیاز
  if (score % 5 === 0 && targetSize > 28) {
    targetSize -= 4;
  }

  moveTarget();
});

// پایان بازی
function endGame() {
  playing = false;
  clearInterval(timer);
  timer = null;

  target.hidden = true;
  message.hidden = false;

  let newRecord = false;

  if (score > best) {
    best = score;
    bestEl.textContent = best;
    newRecord = true;

    try {
      localStorage.setItem("neonHuntBest", String(best));
    } catch (error) {}
  }

  const resultText =
    score >= 20
      ? "عالی بود! 🔥"
      : "دوباره تلاش کن و رکورد بزن!";

  message.replaceChildren();

  const title = document.createElement("div");
  title.textContent = "⏱ زمان تمام شد!";

  const result = document.createElement("div");
  result.style.color = "#00eaff";
  result.textContent = `امتیاز ${playerName}: ${score}`;

  const feedback = document.createElement("div");
  feedback.style.cssText =
    "font-size:12px;color:#aab5cf";
  feedback.textContent = newRecord && score > 0
    ? "🏆 رکورد جدید ثبت شد!"
    : resultText;

  const restart = document.createElement("button");
  restart.textContent = "بازی دوباره";
  restart.addEventListener("click", startGame);

  const intro = document.createElement("button");
  intro.textContent = "درباره سازنده";
  intro.style.cssText =
    "background:transparent;color:#00eaff;margin-top:0";
  intro.addEventListener("click", () => {
    stopGame();
    showScreen(creatorScreen);
  });

  message.append(title, result, feedback, restart, intro);
}

// توقف کامل تایمر
function stopGame() {
  playing = false;
  clearInterval(timer);
  timer = null;
}

// دکمه شروع بازی
$("startBtn").addEventListener("click", startGame);
